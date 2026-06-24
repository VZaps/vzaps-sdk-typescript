import WebSocket from 'ws';
import type {
  ErrorHandler,
  EventHandler,
  EventSubscribeRequest,
  VZapsEvent,
  WebSocketFactory,
  WebSocketLike,
} from './types.js';
import type { HttpClient } from './http.js';

type LifecycleEvent = 'open' | 'close' | 'error';
type HandlerMap = Map<string, Set<EventHandler>>;

export class EventsResource {
  constructor(
    private readonly http: HttpClient,
    private readonly webSocketFactory?: WebSocketFactory,
  ) {}

  async subscribe(request: EventSubscribeRequest): Promise<EventSubscription> {
    const subscription = new EventSubscription(this.http, request, this.webSocketFactory);
    await subscription.open();
    return subscription;
  }
}

export class EventSubscription {
  private readonly handlers: HandlerMap = new Map();
  private readonly errorHandlers = new Set<ErrorHandler>();
  private readonly lifecycleHandlers = new Map<LifecycleEvent, Set<(...args: unknown[]) => void>>();
  private socket?: WebSocketLike;
  private closed = false;
  private retryCount = 0;

  constructor(
    private readonly http: HttpClient,
    private readonly request: EventSubscribeRequest,
    private readonly webSocketFactory?: WebSocketFactory,
  ) {}

  async open(): Promise<void> {
    const token = await this.http.getAccessToken(this.request.signal);
    const url = this.http.buildRealtimeUrl('/events/ws', {
      instance_id: this.request.instanceId,
      events: this.request.events?.join(','),
      access_token: token,
      client_token: this.http.clientToken,
      instance_token: this.request.instanceToken,
      last_event_id: this.request.lastEventId,
    });
    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
      'X-Client-Token': this.http.clientToken,
    };

    headers['X-Instance-Token'] = this.request.instanceToken;

    this.socket = this.createSocket(url, headers);
    this.bindSocket(this.socket);
  }

  on<TEvent extends VZapsEvent = VZapsEvent>(event: string, handler: EventHandler<TEvent>): this {
    if (event === 'error') {
      this.errorHandlers.add(handler as ErrorHandler);
      return this;
    }

    if (event === 'open' || event === 'close') {
      this.addLifecycleHandler(event, handler as (...args: unknown[]) => void);
      return this;
    }

    const handlers = this.handlers.get(event) ?? new Set<EventHandler>();
    handlers.add(handler as EventHandler);
    this.handlers.set(event, handlers);
    return this;
  }

  off<TEvent extends VZapsEvent = VZapsEvent>(event: string, handler: EventHandler<TEvent>): this {
    if (event === 'error') {
      this.errorHandlers.delete(handler as ErrorHandler);
      return this;
    }

    if (event === 'open' || event === 'close') {
      this.lifecycleHandlers.get(event)?.delete(handler as (...args: unknown[]) => void);
      return this;
    }

    this.handlers.get(event)?.delete(handler as EventHandler);
    return this;
  }

  async close(code = 1000, reason = 'Client closed subscription'): Promise<void> {
    this.closed = true;
    this.socket?.close(code, reason);
  }

  private createSocket(url: string, headers: Record<string, string>): WebSocketLike {
    if (this.webSocketFactory) {
      return this.webSocketFactory(url, headers);
    }

    if (typeof globalThis.WebSocket !== 'undefined') {
      return new globalThis.WebSocket(url) as unknown as WebSocketLike;
    }

    return new WebSocket(url, { headers }) as unknown as WebSocketLike;
  }

  private bindSocket(socket: WebSocketLike): void {
    listen(socket, 'open', () => {
      this.retryCount = 0;
      this.emitLifecycle('open');
    });

    listen(socket, 'message', (eventOrData) => {
      const raw = readMessageData(eventOrData);
      if (raw !== undefined) {
        void this.dispatch(raw);
      }
    });

    listen(socket, 'error', (error) => {
      this.emitError(error);
    });

    listen(socket, 'close', () => {
      this.emitLifecycle('close');
      void this.reconnectIfNeeded();
    });

    this.request.signal?.addEventListener('abort', () => {
      void this.close(1000, 'Subscription aborted');
    }, { once: true });
  }

  private async dispatch(raw: unknown): Promise<void> {
    try {
      const event = parseEvent(raw);
      const handlers = new Set<EventHandler>([
        ...(this.handlers.get(event.type) ?? []),
        ...(this.handlers.get('All') ?? []),
      ]);

      await Promise.all([...handlers].map((handler) => handler(event)));
      this.ack(event.id);
    } catch (error) {
      this.emitError(error);
    }
  }

  private ack(eventId: string): void {
    if (!eventId || !this.socket) {
      return;
    }
    this.socket.send(JSON.stringify({ type: 'ack', event_id: eventId }));
  }

  private async reconnectIfNeeded(): Promise<void> {
    if (this.closed || this.request.reconnect === false) {
      return;
    }

    const maxRetries = this.request.maxRetries ?? Number.POSITIVE_INFINITY;
    if (this.retryCount >= maxRetries) {
      return;
    }

    this.retryCount += 1;
    await delay(this.request.retryDelayMs ?? Math.min(30_000, 1000 * this.retryCount));
    await this.open();
  }

  private addLifecycleHandler(event: LifecycleEvent, handler: (...args: unknown[]) => void): void {
    const handlers = this.lifecycleHandlers.get(event) ?? new Set<(...args: unknown[]) => void>();
    handlers.add(handler);
    this.lifecycleHandlers.set(event, handlers);
  }

  private emitLifecycle(event: LifecycleEvent, ...args: unknown[]): void {
    for (const handler of this.lifecycleHandlers.get(event) ?? []) {
      handler(...args);
    }
  }

  private emitError(error: unknown): void {
    if (this.errorHandlers.size === 0) {
      return;
    }

    for (const handler of this.errorHandlers) {
      handler(error);
    }
  }
}

function listen(socket: WebSocketLike, type: string, listener: (event: unknown) => void): void {
  if (socket.addEventListener) {
    socket.addEventListener(type, listener);
    return;
  }

  socket.on?.(type, listener);
}

function readMessageData(eventOrData: unknown): unknown {
  if (isRecord(eventOrData) && 'data' in eventOrData) {
    return eventOrData.data;
  }
  return eventOrData;
}

function parseEvent(raw: unknown): VZapsEvent {
  const text = typeof raw === 'string' ? raw : Buffer.isBuffer(raw) ? raw.toString('utf8') : String(raw);
  return JSON.parse(text) as VZapsEvent;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
