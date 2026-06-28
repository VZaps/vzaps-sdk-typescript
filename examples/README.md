# VZaps TypeScript SDK Examples

Runnable `.ts` files that consume the published npm package (`@vzaps/sdk`).

You do **not** need to clone the full SDK repository to run an example. Download only the `examples/` folder, install dependencies, edit credentials, and run one file with `tsx`.

## Prerequisites

- Node.js 18 or later
- npm, yarn, or pnpm

## Option A — one example folder (recommended)

Download only the [`examples/`](https://github.com/VZaps/vzaps-sdk-typescript/tree/main/examples) folder:

1. Open [examples on GitHub](https://github.com/VZaps/vzaps-sdk-typescript/tree/main/examples) and choose **Download ZIP**, or run:

```bash
npx --yes degit VZaps/vzaps-sdk-typescript/examples vzaps-ts-examples
cd vzaps-ts-examples
```

2. Install dependencies:

```bash
npm install
```

3. Edit constants at the top of the file you want to run (for example `07-send-text-message.ts`).

4. Run:

```bash
npx tsx 07-send-text-message.ts
```

You can also use environment variables instead of editing the file constants.

## Option B — sparse checkout (one folder from Git)

If you prefer Git without downloading the whole repository:

```bash
git clone --depth 1 --filter=blob:none --sparse https://github.com/VZaps/vzaps-sdk-typescript.git
cd vzaps-sdk-typescript
git sparse-checkout set examples
cd examples
npm install
npx tsx 07-send-text-message.ts
```

## Option C — full repository clone

Use this when you want every example locally or you are contributing to the SDK:

```bash
git clone https://github.com/VZaps/vzaps-sdk-typescript.git
cd vzaps-sdk-typescript/examples
npm install
npx tsx 07-send-text-message.ts
```

When developing the SDK itself, build and link the local package first:

```bash
npm run build
npm link
cd examples && npm link @vzaps/sdk
```

## Examples

| File | Topic |
| --- | --- |
| `01-auth-and-list-instances.ts` | Auth and instance listing |
| `02-create-instance.ts` | Create instance |
| `03-instance-subscription.ts` | Billing subscription |
| `04-session-and-pairing.ts` | Session status, QR, and pairing code |
| `05-configure-webhook.ts` | Webhook configuration |
| `06-realtime-subscribe.ts` | Realtime WebSocket subscription |
| `07-send-text-message.ts` | Send text message |
| `08-send-media-and-interactive.ts` | Media, buttons, and list |
| `09-send-poll-reaction-and-chat-actions.ts` | Poll, reaction, and chat actions |
| `10-queues.ts` | Message and operation queues |
| `11-typebot-and-chatwoot.ts` | TypeBot and Chatwoot |

## Coverage

- Auth and instance listing
- Instance creation and billing subscription checkout
- Session status, QR, and phone pairing code
- Webhook and realtime subscription
- Text, media, buttons, list, poll, reactions, presence
- Queue list/remove/purge examples
- TypeBot and Chatwoot integration examples
