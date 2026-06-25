# VZaps TypeScript SDK

[![CI](https://github.com/VZaps/vzaps-sdk-typescript/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/VZaps/vzaps-sdk-typescript/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@vzaps/sdk.svg)](https://www.npmjs.com/package/@vzaps/sdk)

Official TypeScript/JavaScript client for the [VZaps public API](https://docs.vzaps.com). Send WhatsApp messages, manage instances, configure webhooks, and subscribe to realtime events with a typed, promise-based interface.

Works in **Node.js 18+** (ESM and CommonJS). Browser usage is supported for HTTP calls; WebSocket realtime in Node uses the bundled `ws` client automatically.

---

## Table of contents

- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Quick start](#quick-start)
- [Authentication](#authentication)
- [Configuration](#configuration)
- [Resources](#resources)
- [Instance tokens](#instance-tokens)
- [Webhooks](#webhooks)
- [Realtime events](#realtime-events)
- [Error handling](#error-handling)
- [TypeScript](#typescript)
- [Documentation](#documentation)

---

## Features

- **Automatic JWT handling** — exchanges `clientToken` + `clientSecret` for a bearer token and refreshes it before expiry.
- **Resource-oriented API** — `instances`, `messages`, `webhooks`, `contacts`, `groups`, and `events` mirror the public HTTP contract.
- **Realtime WebSocket client** — subscribe to instance events with reconnect, resume (`lastEventId`), and server-side ack.
- **Instance token support** — set a default token on the client or override it per request.
- **Fully typed** — ships TypeScript definitions for client options, events, and request payloads.
- **Extensible transport** — inject custom `fetch` and `webSocketFactory` implementations for tests or edge runtimes.

---

## Requirements

| Runtime | Minimum version |
| --- | --- |
| Node.js | 18+ |
| TypeScript | 5.x (optional, for app development) |

The SDK uses the global `fetch` API. On Node 18+, no extra HTTP dependency is required.

---

## Installation

```bash
npm install @vzaps/sdk
```

```bash
yarn add @vzaps/sdk
```

```bash
pnpm add @vzaps/sdk
```

---

## Quick start

Create credentials in the [VZaps dashboard](https://docs.vzaps.com) (`clientToken` and `clientSecret`), then send a text message:

```ts
import { VZapsClient } from '@vzaps/sdk';

const vzaps = new VZapsClient({
  clientToken: process.env.VZAPS_CLIENT_TOKEN!,
  clientSecret: process.env.VZAPS_CLIENT_SECRET!,
});

await vzaps.messages.sendText({
  instanceId: 'VZKB8AU4S4CWY1SLXX4I5WJGRZQMDDFTV6',
  instanceToken: process.env.VZAPS_INSTANCE_TOKEN!,
  phone: '5511999999999',
  message: 'Hello from VZaps',
});
```

---

## Authentication

VZaps uses a two-step model:

1. **Account credentials** — `clientToken` and `clientSecret` identify your integration. The SDK calls `POST /auth/token` and caches the JWT.
2. **Instance token** — instance-scoped routes also require `X-Instance-Token`. Pass it on each instance-scoped request (see [Instance tokens](#instance-tokens)).

Every authenticated HTTP request sends:

| Header | Value |
| --- | --- |
| `Authorization` | `Bearer <jwt>` |
| `X-Client-Token` | Your client token |
| `X-Instance-Token` | Instance token, on instance-scoped requests |

You rarely need to call `auth.getAccessToken()` directly — resources attach the token for you. Use it when integrating with custom HTTP logic:

```ts
const token = await vzaps.auth.getAccessToken();
```

---

## Configuration

The SDK connects to the VZaps production platform automatically:

| Service | Endpoint |
| --- | --- |
| REST API | `https://api.vzaps.com` |
| Realtime WebSocket | `wss://realtime.vzaps.com/events/ws` |

Pass options to `new VZapsClient(options)`:

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `clientToken` | `string` | — | **Required.** Public client token from the dashboard. |
| `clientSecret` | `string` | — | **Required.** Client secret used to obtain JWTs. |
| `timeoutMs` | `number` | `30000` | HTTP request timeout in milliseconds. |
| `tokenSkewMs` | `number` | `60000` | Refresh JWT this many ms before expiry. |
| `fetch` | `FetchLike` | `globalThis.fetch` | Custom fetch implementation. |
| `webSocketFactory` | `WebSocketFactory` | Node: `ws` / browser: `WebSocket` | Custom WebSocket constructor. |
| `userAgent` | `string` | — | Optional `User-Agent` header on HTTP requests. |

No host configuration is required — install the package, pass your credentials, and the client targets the production API and realtime service.

---

## Resources

The client exposes namespaced resources. Generic response types (`TResponse`) let you align with your own interfaces or the [OpenAPI schema](https://docs.vzaps.com/api-reference).

### `vzaps.instances`

| Method | HTTP | Description |
| --- | --- | --- |
| `create(data)` | `PUT /instances/create` | Create a WhatsApp instance. |
| `list(data?)` | `POST /instances/list` | List instances (pagination, search, sort). |
| `get(instanceId, options?)` | `GET /instances/:id` | Get instance details. |
| `update(instanceId, data, options?)` | `PATCH /instances/:id` | Update instance settings. |
| `restart(instanceId, options?)` | `POST /instances/:id/restart` | Restart instance runtime. |

### `vzaps.messages`

`vzaps.messages` wraps the public WhatsApp send and chat endpoints. The most common calls are shown below; the SDK also exposes the other public message operations documented in the API reference, including media, interactive messages, reactions, polls, downloads, edits, deletes, presence, and read receipts.

```ts
await vzaps.messages.sendText({
  instanceId: 'VZ...',
  instanceToken: 'instance-token',
  phone: '5511999999999',
  message: 'Hello',
});

await vzaps.messages.sendImage({
  instanceId: 'VZ...',
  instanceToken: 'instance-token',
  phone: '5511999999999',
  image: 'https://example.com/photo.jpg',
  caption: 'Check this out',
});
```

Available send helpers include `sendText`, `sendImage`, `sendAudio`, `sendDocument`, `sendVideo`, `sendSticker`, `sendGif`, `sendLocation`, `sendContact`, `sendButtons`, `sendList`, `sendLink`, and `sendPoll`. See the API documentation for complete payload examples.

### `vzaps.webhooks`

| Method | HTTP | Description |
| --- | --- | --- |
| `get(instanceId, options?)` | `GET /instances/:id/webhook` | Read current webhook configuration. |
| `set(request)` | `POST /instances/:id/webhook` | Configure webhook URL and subscribed events. |

### `vzaps.contacts`

| Method | HTTP | Description |
| --- | --- | --- |
| `list(instanceId, options?)` | `GET /instances/:id/contact/list` | List contacts for the instance. |
| `add(request)` | `POST /instances/:id/contact/add` | Add a contact. |

### `vzaps.groups`

| Method | HTTP | Description |
| --- | --- | --- |
| `list(request)` | `GET /instances/:id/group/list` | List groups (paginated). |
| `get(request)` | `GET /instances/:id/group/info` | Get group metadata by `groupId`. |

Other public namespaces are available as first-class resources too: `sessions`, `users`, `queues`, `typebots`, `chatwoot`, and `chats`.

### `vzaps.request(method, path, options?)`

Escape hatch for advanced calls or newly released endpoints:

```ts
const instance = await vzaps.request('POST', '/instances/get', {
  body: { id: 'VZ...' },
});
```

---

## Instance Tokens

Instance-scoped routes require the instance token in addition to account credentials. Pass it on each request that targets an instance:

```ts
await vzaps.messages.sendText({
  instanceId: 'VZ...',
  instanceToken: 'instance-token',
  phone: '5511999999999',
  message: 'Hello',
});
```

---

## Webhooks

Configure HTTP callbacks for instance events (same payload shape as realtime `data`, delivered to your URL):

```ts
await vzaps.webhooks.set({
  instanceId: 'VZ...',
  webhookURL: 'https://example.com/webhooks/vzaps',
  events: ['Message', 'Connected', 'Disconnected'],
});
```

Common event types: `Message`, `ReadReceipt`, `Connected`, `Disconnected`, `Presence`, `ChatPresence`, `HistorySync`, `GroupParticipantsAdd`, `GroupParticipantsRemove`, or `All`.

Event payloads (webhook and realtime) use **snake_case**, matching the platform. Incoming media events include `media_url` inside `data` when platform storage is available.

---

## Realtime events

Subscribe to the same events over WebSocket at **`wss://realtime.vzaps.com`**. This is the recommended path for in-app notifications, bots, and dashboards that need low-latency delivery without exposing a public webhook URL.

### Subscribe

```ts
const subscription = await vzaps.events.subscribe({
  instanceId: 'VZ...',
  instanceToken: 'instance-token',
  events: ['Message', 'Connected', 'Disconnected'],
  reconnect: true,
  lastEventId: 'evt_previous_id', // optional resume after disconnect
});

subscription.on('open', () => {
  console.log('Connected to realtime');
});

subscription.on('Message', (event) => {
  console.log(event.data);
});

subscription.on('error', (error) => {
  console.error(error);
});

// Graceful shutdown
await subscription.close();
```

### Event envelope

Each WebSocket message keeps the platform shape (`snake_case`):

```json
{
  "id": "evt_…",
  "type": "Message",
  "instance_id": "VZ…",
  "created_at": "2026-06-23T22:57:17.000Z",
  "data": {
    "type": "Message",
    "event": { },
    "media_url": "https://…"
  }
}
```

- **`data`** — same payload as webhook delivery (`snake_case`).
- **`media_url`** — present on incoming media messages when platform storage is available.

### Delivery and ack

Delivery is **at-least-once**. After your handler runs, the SDK sends an ack automatically on the WebSocket connection. Use `lastEventId` when reconnecting if you need to reduce gaps. Deduplicate on `event.id` in your application if you process events idempotently.

### Subscribe options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `instanceId` | `string` | — | **Required.** Instance to watch. |
| `events` | `VZapsEventType[]` | all subscribed | Comma-filtered event types. |
| `instanceToken` | `string` | — | **Required.** Instance token for authorization. |
| `reconnect` | `boolean` | `true` | Reconnect after socket close. |
| `maxRetries` | `number` | unlimited | Max reconnect attempts. |
| `retryDelayMs` | `number` | exponential backoff | Delay between reconnects. |
| `lastEventId` | `string` | — | Resume cursor after disconnect. |
| `signal` | `AbortSignal` | — | Abort subscription (closes socket). |

### Handler registration

| Event name | When it fires |
| --- | --- |
| `open` | WebSocket connected. |
| `close` | WebSocket closed. |
| `error` | Handler or transport error. |
| `Message`, `Connected`, … | Matching realtime event type. |
| `All` | Every event type. |

---

## Error handling

The SDK throws typed errors you can catch and branch on:

| Class | When |
| --- | --- |
| `VZapsError` | Base class; HTTP errors include `status`, `code`, and `details`. |
| `VZapsAuthenticationError` | Invalid `clientToken` / `clientSecret` (401). |
| `VZapsTimeoutError` | Request exceeded `timeoutMs`. |

```ts
import {
  VZapsClient,
  VZapsAuthenticationError,
  VZapsError,
  VZapsTimeoutError,
} from '@vzaps/sdk';

try {
  await vzaps.messages.sendText({ instanceId, instanceToken, phone, message });
} catch (error) {
  if (error instanceof VZapsAuthenticationError) {
    console.error('Check client credentials');
  } else if (error instanceof VZapsTimeoutError) {
    console.error('Request timed out');
  } else if (error instanceof VZapsError) {
    console.error(error.status, error.message, error.details);
  }
  throw error;
}
```

---

## TypeScript

The package uses **camelCase** for HTTP request types and API responses. **Realtime and webhook event payloads stay in snake_case** so both delivery channels match.

Exported types include options, events, and requests:

```ts
import type {
  VZapsClientOptions,
  VZapsEvent,
  VZapsEventType,
  MessageSendTextRequest,
  WebhookConfigRequest,
  EventSubscribeRequest,
} from '@vzaps/sdk';
```

Resources accept a generic `TResponse` when you want strongly typed API responses:

```ts
interface InstanceListResponse {
  data: Array<{ instanceId: string; name: string }>;
}

const page = await vzaps.instances.list<InstanceListResponse>({
  page: 1,
  pageSize: 20,
});
```

---

## Documentation

- [VZaps docs](https://docs.vzaps.com)
- [API reference (OpenAPI)](https://docs.vzaps.com/api-reference)
- [Postman collections](https://docs.vzaps.com/postman/)
- [Report an issue](https://github.com/VZaps/vzaps-sdk-typescript/issues)

---

## License

MIT © VZaps
