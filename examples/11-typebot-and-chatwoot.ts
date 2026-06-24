import { VZapsClient } from '@vzaps/sdk';

const CLIENT_TOKEN = 'your-client-token';
const CLIENT_SECRET = 'your-client-secret';
const INSTANCE_ID = 'VZ...';
const INSTANCE_TOKEN = 'your-instance-token';
const TO_PHONE = '5511999999999';

const TYPEBOT_PUBLIC_ID = 'support';
const CHATWOOT_BASE_URL = 'https://chatwoot.example.com';
const CHATWOOT_ACCOUNT_ID = '1';
const CHATWOOT_API_TOKEN = 'your-chatwoot-token';

const vzaps = new VZapsClient({
  clientToken: CLIENT_TOKEN,
  clientSecret: CLIENT_SECRET,
});

const typebots = await vzaps.typebots.list(INSTANCE_ID, {
  instanceToken: INSTANCE_TOKEN,
});

console.log('TypeBots:');
console.dir(typebots, { depth: null });

const typebotSession = await vzaps.typebots.startSession({
  instanceId: INSTANCE_ID,
  instanceToken: INSTANCE_TOKEN,
  publicId: TYPEBOT_PUBLIC_ID,
  phone: TO_PHONE,
  pushName: 'SDK Test Contact',
  message: 'Hello from SDK',
});

console.log('TypeBot session start:');
console.dir(typebotSession, { depth: null });

const chatwoot = await vzaps.chatwoot.set({
  instanceId: INSTANCE_ID,
  instanceToken: INSTANCE_TOKEN,
  enabled: true,
  url: CHATWOOT_BASE_URL,
  accountId: CHATWOOT_ACCOUNT_ID,
  token: CHATWOOT_API_TOKEN,
  autoCreate: true,
  importContacts: true,
  importMessages: false,
});

console.log('Chatwoot config:');
console.dir(chatwoot, { depth: null });

const importJob = await vzaps.chatwoot.triggerImport({
  instanceId: INSTANCE_ID,
  instanceToken: INSTANCE_TOKEN,
  what: 'contacts',
});

console.log('Chatwoot import job:');
console.dir(importJob, { depth: null });
