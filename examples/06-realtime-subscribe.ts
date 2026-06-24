import { VZapsClient } from '@vzaps/sdk';

const CLIENT_TOKEN = 'your-client-token';
const CLIENT_SECRET = 'your-client-secret';
const INSTANCE_ID = 'VZ...';
const INSTANCE_TOKEN = 'your-instance-token';

const vzaps = new VZapsClient({
  clientToken: CLIENT_TOKEN,
  clientSecret: CLIENT_SECRET,
});

console.log('Connecting to realtime...');

const subscription = await vzaps.events.subscribe({
  instanceId: INSTANCE_ID,
  instanceToken: INSTANCE_TOKEN,
  events: ['Message', 'ReadReceipt', 'Connected', 'Disconnected'],
  reconnect: true,
});

subscription.on('open', () => {
  console.log('Realtime subscription opened.');
});

subscription.on('Message', (event) => {
  console.log('Message event:');
  console.dir(event, { depth: null });
});

subscription.on('ReadReceipt', (event) => {
  console.log('Read receipt event:');
  console.dir(event, { depth: null });
});

subscription.on('Connected', (event) => {
  console.log('Connected event:');
  console.dir(event, { depth: null });
});

subscription.on('Disconnected', (event) => {
  console.log('Disconnected event:');
  console.dir(event, { depth: null });
});

subscription.on('error', (error) => {
  console.error('Realtime error:', error);
});

console.log('Listening. Send a WhatsApp message to the instance, or press Ctrl+C to stop.');

process.on('SIGINT', async () => {
  console.log('\nClosing realtime subscription...');
  await subscription.close();
  process.exit(0);
});
