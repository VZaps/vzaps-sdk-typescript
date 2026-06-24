import { VZapsClient } from '@vzaps/sdk';

const CLIENT_TOKEN = 'your-client-token';
const CLIENT_SECRET = 'your-client-secret';
const INSTANCE_ID = 'VZ...';
const INSTANCE_TOKEN = 'your-instance-token';
const WEBHOOK_URL = 'https://example.com/webhooks/vzaps';

const vzaps = new VZapsClient({
  clientToken: CLIENT_TOKEN,
  clientSecret: CLIENT_SECRET,
});

const result = await vzaps.webhooks.set({
  instanceId: INSTANCE_ID,
  instanceToken: INSTANCE_TOKEN,
  webhookURL: WEBHOOK_URL,
  events: ['Message', 'ReadReceipt', 'Connected', 'Disconnected'],
});

console.log('Webhook configured:');
console.dir(result, { depth: null });
