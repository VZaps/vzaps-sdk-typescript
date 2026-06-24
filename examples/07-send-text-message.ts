import { VZapsClient } from '@vzaps/sdk';

const CLIENT_TOKEN = 'your-client-token';
const CLIENT_SECRET = 'your-client-secret';
const INSTANCE_ID = 'VZ...';
const INSTANCE_TOKEN = 'your-instance-token';
const TO_PHONE = '5511999999999';
const MESSAGE = 'Hello from VZaps SDK';

const vzaps = new VZapsClient({
  clientToken: CLIENT_TOKEN,
  clientSecret: CLIENT_SECRET,
});

const result = await vzaps.messages.sendText({
  instanceId: INSTANCE_ID,
  instanceToken: INSTANCE_TOKEN,
  phone: TO_PHONE,
  message: MESSAGE,
});

console.log('Send text response:');
console.dir(result, { depth: null });
