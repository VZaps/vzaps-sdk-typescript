import { describe, expect, it, vi } from 'vitest';
import { VZapsClient } from '../src/index.js';

describe('VZapsClient', () => {
  it('authenticates once and reuses the access token', async () => {
    const fetchMock = vi.fn(async () => jsonResponse({ access_token: 'jwt-token', expires_in: 3600 }));
    const client = new VZapsClient({
      clientToken: 'client-token',
      clientSecret: 'client-secret',
      baseUrl: 'https://api.test',
      fetch: fetchMock as typeof fetch,
    });

    await expect(client.auth.getAccessToken()).resolves.toBe('jwt-token');
    await expect(client.auth.getAccessToken()).resolves.toBe('jwt-token');

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect((fetchMock.mock.calls as unknown[][])[0]?.[0]).toBe('https://api.test/token');
  });

  it('sends text messages with auth and instance headers', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse({ access_token: 'jwt-token', expires_in: 3600 }))
      .mockResolvedValueOnce(jsonResponse({ success: true }));

    const client = new VZapsClient({
      clientToken: 'client-token',
      clientSecret: 'client-secret',
      baseUrl: 'https://api.test',
      fetch: fetchMock as typeof fetch,
    });

    await client.messages.sendText({
      instanceId: 'VZ123',
      instanceToken: 'instance-token',
      phone: '5511999999999',
      message: 'Hello',
    });

    const [url, init] = fetchMock.mock.calls[1] as [string, RequestInit];
    const headers = init.headers as Headers;

    expect(url).toBe('https://api.test/instances/VZ123/chat/send/text');
    expect(headers.get('Authorization')).toBe('Bearer jwt-token');
    expect(headers.get('X-Client-Token')).toBe('client-token');
    expect(headers.get('X-Instance-Token')).toBe('instance-token');
    expect(init.body).toBe(JSON.stringify({ phone: '5511999999999', message: 'Hello' }));
  });

  it('serializes request payloads as snake_case on the wire', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse({ access_token: 'jwt-token', expires_in: 3600 }))
      .mockResolvedValueOnce(jsonResponse({ success: true }));

    const client = new VZapsClient({
      clientToken: 'client-token',
      clientSecret: 'client-secret',
      baseUrl: 'https://api.test',
      fetch: fetchMock as typeof fetch,
    });

    await client.instances.create({
      name: 'Support',
      eventsSubscribe: ['Message'],
    });

    const [, init] = fetchMock.mock.calls[1] as [string, RequestInit];
    expect(init.body).toBe(JSON.stringify({ name: 'Support', events_subscribe: ['Message'] }));
  });

  it('deserializes API responses as camelCase', async () => {
    const fetchMock = vi.fn(async () => jsonResponse({ access_token: 'jwt-token', expires_in: 3600 }));
    const client = new VZapsClient({
      clientToken: 'client-token',
      clientSecret: 'client-secret',
      baseUrl: 'https://api.test',
      fetch: fetchMock as typeof fetch,
    });

    await expect(client.auth.getAccessToken()).resolves.toBe('jwt-token');
  });

  it('lists instances with search params on the wire', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse({ access_token: 'jwt-token', expires_in: 3600 }))
      .mockResolvedValueOnce(jsonResponse({ page: 1, size: 10, total: 0, total_pages: 0, content: [] }));

    const client = new VZapsClient({
      clientToken: 'client-token',
      clientSecret: 'client-secret',
      baseUrl: 'https://api.test',
      fetch: fetchMock as typeof fetch,
    });

    await client.instances.list({
      page: 1,
      pageSize: 10,
      search: 'atendimento',
    });

    const [, init] = fetchMock.mock.calls[1] as [string, RequestInit];
    expect(init.body).toBe(
      JSON.stringify({
        page: 1,
        size: 10,
        filter: { query: 'atendimento' },
      }),
    );
  });

  it('gets a public instance by id on the wire', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse({ access_token: 'jwt-token', expires_in: 3600 }))
      .mockResolvedValueOnce(jsonResponse({ id: 'VZ123', name: 'Support', token: 'inst-token' }));

    const client = new VZapsClient({
      clientToken: 'client-token',
      clientSecret: 'client-secret',
      baseUrl: 'https://api.test',
      fetch: fetchMock as typeof fetch,
    });

    await client.instances.get('VZ123');

    const [url, init] = fetchMock.mock.calls[1] as [string, RequestInit];
    expect(url).toBe('https://api.test/instances/get');
    expect(init.method).toBe('POST');
    expect(init.body).toBe(JSON.stringify({ id: 'VZ123' }));
  });

  it('creates realtime subscriptions with WebSocket headers', async () => {
    const fetchMock = vi.fn(async () => jsonResponse({ access_token: 'jwt-token', expires_in: 3600 }));
    const socket = new FakeSocket();
    const webSocketFactory = vi.fn(() => socket);
    const client = new VZapsClient({
      clientToken: 'client-token',
      clientSecret: 'client-secret',
      baseUrl: 'https://api.test',
      fetch: fetchMock as typeof fetch,
      webSocketFactory,
    });

    const subscription = await client.events.subscribe({
      instanceId: 'VZ123',
      instanceToken: 'instance-token',
      events: ['Message', 'Connected'],
      reconnect: false,
    });

    expect(webSocketFactory).toHaveBeenCalledWith(
      'wss://realtime.vzaps.com/events/ws?instance_id=VZ123&events=Message%2CConnected&access_token=jwt-token&client_token=client-token&instance_token=instance-token',
      {
        Authorization: 'Bearer jwt-token',
        'X-Client-Token': 'client-token',
        'X-Instance-Token': 'instance-token',
      },
    );

    await subscription.close();
    expect(socket.closed).toBe(true);
  });
});

function jsonResponse(body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

class FakeSocket {
  closed = false;

  close(): void {
    this.closed = true;
  }

  send(): void {}

  addEventListener(): void {}
}
