import { VZapsAuthenticationError, VZapsError, VZapsTimeoutError } from './errors.js';
import { keysToCamelCase, keysToSnakeCase, toSnakeCaseKey } from './casing.js';
import type { AuthTokenResponse, FetchLike, RequestOptions, VZapsClientOptions } from './types.js';

const DEFAULT_BASE_URL = 'https://api.vzaps.com';
const DEFAULT_REALTIME_URL = 'wss://realtime.vzaps.com';
const DEFAULT_TIMEOUT_MS = 30_000;
const DEFAULT_TOKEN_SKEW_MS = 60_000;

interface CachedToken {
  accessToken: string;
  expiresAt: number;
}

export class HttpClient {
  readonly baseUrl: string;
  readonly realtimeUrl?: string;
  readonly clientToken: string;
  readonly clientSecret: string;

  private readonly fetchImpl: FetchLike;
  private readonly timeoutMs: number;
  private readonly tokenSkewMs: number;
  private readonly userAgent?: string;
  private cachedToken?: CachedToken;
  private pendingToken?: Promise<string>;

  constructor(options: VZapsClientOptions) {
    this.clientToken = requireNonEmpty(options.clientToken, 'clientToken');
    this.clientSecret = requireNonEmpty(options.clientSecret, 'clientSecret');
    this.baseUrl = normalizeBaseUrl(options.baseUrl ?? DEFAULT_BASE_URL);
    this.realtimeUrl = normalizeBaseUrl(options.realtimeUrl ?? DEFAULT_REALTIME_URL);
    this.timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    this.tokenSkewMs = options.tokenSkewMs ?? DEFAULT_TOKEN_SKEW_MS;
    this.userAgent = options.userAgent;
    this.fetchImpl = options.fetch ?? globalThis.fetch;

    if (!this.fetchImpl) {
      throw new VZapsError('No fetch implementation available. Use Node.js 18+ or pass options.fetch.');
    }
  }

  async getAccessToken(signal?: AbortSignal): Promise<string> {
    if (this.cachedToken && this.cachedToken.expiresAt > Date.now()) {
      return this.cachedToken.accessToken;
    }

    this.pendingToken ??= this.requestToken(signal).finally(() => {
      this.pendingToken = undefined;
    });

    return this.pendingToken;
  }

  async request<T>(method: string, path: string, options: RequestOptions = {}): Promise<T> {
    const url = this.buildUrl(path, options.query);
    const headers = new Headers();
    headers.set('Accept', 'application/json');

    if (options.body !== undefined) {
      headers.set('Content-Type', 'application/json');
    }

    if (this.userAgent) {
      headers.set('User-Agent', this.userAgent);
    }

    for (const [key, value] of Object.entries(options.headers ?? {})) {
      if (value !== undefined) {
        headers.set(key, value);
      }
    }

    if (options.auth !== false) {
      headers.set('Authorization', `Bearer ${await this.getAccessToken(options.signal)}`);
      headers.set('X-Client-Token', this.clientToken);
    }

    if (options.instanceToken) {
      headers.set('X-Instance-Token', options.instanceToken);
    }

    const body =
      options.body === undefined ? undefined : JSON.stringify(keysToSnakeCase(options.body));

    const response = await this.fetchWithTimeout(url, {
      method,
      headers,
      body,
      signal: options.signal,
    });

    return parseResponse<T>(response);
  }

  buildRealtimeUrl(path: string, query?: Record<string, string | number | boolean | undefined>): string {
    return buildUrl(this.realtimeUrl!, path, query);
  }

  private async requestToken(signal?: AbortSignal): Promise<string> {
    const response = await this.request<AuthTokenResponse>('POST', '/token', {
      auth: false,
      signal,
      body: {
        clientToken: this.clientToken,
        clientSecret: this.clientSecret,
      },
    });

    if (!response.accessToken || !response.expiresIn) {
      throw new VZapsAuthenticationError('VZaps token response is missing accessToken or expiresIn', response);
    }

    this.cachedToken = {
      accessToken: response.accessToken,
      expiresAt: Date.now() + response.expiresIn * 1000 - this.tokenSkewMs,
    };

    return response.accessToken;
  }

  private buildUrl(path: string, query?: Record<string, string | number | boolean | undefined>): string {
    return buildUrl(this.baseUrl, path, query);
  }

  private async fetchWithTimeout(url: string, init: RequestInit): Promise<Response> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);
    const signal = mergeSignals(controller.signal, init.signal ?? undefined);

    try {
      return await this.fetchImpl(url, { ...init, signal });
    } catch (error) {
      if (controller.signal.aborted) {
        throw new VZapsTimeoutError();
      }
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }
}

function requireNonEmpty(value: string | undefined, name: string): string {
  if (!value || value.trim() === '') {
    throw new VZapsError(`VZaps ${name} is required`);
  }
  return value;
}

function normalizeBaseUrl(value: string): string {
  return value.replace(/\/+$/, '');
}

function buildUrl(baseUrl: string, path: string, query?: Record<string, string | number | boolean | undefined>): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const url = new URL(`${normalizeBaseUrl(baseUrl)}${cleanPath}`);

  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined) {
      url.searchParams.set(toSnakeCaseKey(key), String(value));
    }
  }

  return url.toString();
}

async function parseResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  const data = text ? safeJsonParse(text) : undefined;

  if (!response.ok) {
    if (response.status === 401) {
      throw new VZapsAuthenticationError(readErrorMessage(data, response.statusText), data);
    }

    throw new VZapsError(readErrorMessage(data, response.statusText), {
      status: response.status,
      details: data,
    });
  }

  return keysToCamelCase(data) as T;
}

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function readErrorMessage(data: unknown, fallback: string): string {
  if (isRecord(data)) {
    if (typeof data.error === 'string') return data.error;
    if (typeof data.message === 'string') return data.message;
  }
  return fallback || 'VZaps request failed';
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function mergeSignals(primary: AbortSignal, secondary?: AbortSignal): AbortSignal {
  if (!secondary) {
    return primary;
  }

  if (secondary.aborted) {
    return secondary;
  }

  const controller = new AbortController();
  const abort = () => controller.abort();

  primary.addEventListener('abort', abort, { once: true });
  secondary.addEventListener('abort', abort, { once: true });

  return controller.signal;
}
