# VZaps SDK Examples (internal)

Standalone `.ts` files for local validation. Not published with the npm package.

Imports use the published package name (`@vzaps/sdk`). To run from this repo:

```bash
npm run build
npm link
npx tsx examples/01-auth-and-list-instances.ts
```

Edit constants at the top of each file, then run directly:

```bash
npx tsx examples/01-auth-and-list-instances.ts
npx tsx examples/02-create-instance.ts
npx tsx examples/03-instance-subscription.ts
npx tsx examples/04-session-and-pairing.ts
npx tsx examples/05-configure-webhook.ts
npx tsx examples/06-realtime-subscribe.ts
npx tsx examples/07-send-text-message.ts
npx tsx examples/08-send-media-and-interactive.ts
npx tsx examples/09-send-poll-reaction-and-chat-actions.ts
npx tsx examples/10-queues.ts
npx tsx examples/11-typebot-and-chatwoot.ts
```

## Coverage

- Auth and instance listing
- Instance creation and billing subscription checkout
- Session status, QR, and phone pairing code
- Webhook and realtime subscription
- Text, media, buttons, list, poll, reactions, presence
- Queue list/remove/purge examples
- TypeBot and Chatwoot integration examples
