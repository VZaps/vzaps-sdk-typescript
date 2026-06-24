import { VZapsClient } from '@vzaps/sdk';

const CLIENT_TOKEN = 'your-client-token';
const CLIENT_SECRET = 'your-client-secret';
const INSTANCE_ID = 'VZ...';
const INSTANCE_TOKEN = 'your-instance-token';

const SUCCESS_URL = 'https://app.example.com/billing/success';
const CANCEL_URL = 'https://app.example.com/billing/cancel';

const vzaps = new VZapsClient({
  clientToken: CLIENT_TOKEN,
  clientSecret: CLIENT_SECRET,
});

const subscription = await vzaps.instances.subscribe(
  INSTANCE_ID,
  {
    successUrl: SUCCESS_URL,
    cancelUrl: CANCEL_URL,
  },
  { instanceToken: INSTANCE_TOKEN },
);

console.log('Instance subscription checkout:');
console.dir(subscription, { depth: null });

// To resume a canceled prepaid subscription:
// const resumed = await vzaps.instances.resumeSubscription(INSTANCE_ID, { instanceToken: INSTANCE_TOKEN });
// console.dir(resumed, { depth: null });
