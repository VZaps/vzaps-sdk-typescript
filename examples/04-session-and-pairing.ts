import { VZapsClient } from '@vzaps/sdk';

const CLIENT_TOKEN = 'your-client-token';
const CLIENT_SECRET = 'your-client-secret';
const INSTANCE_ID = 'VZ...';
const INSTANCE_TOKEN = 'your-instance-token';
const PAIRING_PHONE = '5511999999999';

const vzaps = new VZapsClient({
  clientToken: CLIENT_TOKEN,
  clientSecret: CLIENT_SECRET,
});

const status = await vzaps.sessions.status(INSTANCE_ID, {
  instanceToken: INSTANCE_TOKEN,
});

console.log('Session status:');
console.dir(status, { depth: null });

const qr = await vzaps.sessions.qr(INSTANCE_ID, {
  instanceToken: INSTANCE_TOKEN,
});

console.log('Session QR:');
console.dir(qr, { depth: null });

const pairCode = await vzaps.sessions.pairCode(INSTANCE_ID, PAIRING_PHONE, {
  instanceToken: INSTANCE_TOKEN,
});

console.log('Pairing code:');
console.dir(pairCode, { depth: null });
