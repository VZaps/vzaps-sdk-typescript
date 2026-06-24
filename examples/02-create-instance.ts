import { VZapsClient } from '@vzaps/sdk';

const CLIENT_TOKEN = 'your-client-token';
const CLIENT_SECRET = 'your-client-secret';

const INSTANCE_NAME = 'SDK Demo Instance';
const WEBHOOK_URL = 'https://example.com/webhooks/vzaps';

const vzaps = new VZapsClient({
  clientToken: CLIENT_TOKEN,
  clientSecret: CLIENT_SECRET,
});

const created = await vzaps.instances.create({
  name: INSTANCE_NAME,
  webhook: WEBHOOK_URL,
  eventsSubscribe: ['Message', 'ReadReceipt', 'Connected', 'Disconnected'],
});

console.log('Instance created:');
console.dir(created, { depth: null });
