import { VZapsClient } from '@vzaps/sdk';

const CLIENT_TOKEN = 'your-client-token';
const CLIENT_SECRET = 'your-client-secret';
const INSTANCE_ID = 'VZ...';
const INSTANCE_TOKEN = 'your-instance-token';
const TO_PHONE = '5511999999999';

// Use a message ID returned by WhatsApp when testing reactions/edit/delete.
const MESSAGE_ID = '3EB0000000000000000000';

const vzaps = new VZapsClient({
  clientToken: CLIENT_TOKEN,
  clientSecret: CLIENT_SECRET,
});

const poll = await vzaps.messages.sendPoll({
  instanceId: INSTANCE_ID,
  instanceToken: INSTANCE_TOKEN,
  phone: TO_PHONE,
  name: 'Which channel do you prefer?',
  options: ['WhatsApp', 'Email', 'Phone'],
  selectableOptionsCount: 1,
});

console.log('Poll response:');
console.dir(poll, { depth: null });

const presence = await vzaps.messages.presence({
  instanceId: INSTANCE_ID,
  instanceToken: INSTANCE_TOKEN,
  phone: TO_PHONE,
  state: 'composing',
});

console.log('Presence response:');
console.dir(presence, { depth: null });

const reaction = await vzaps.messages.react({
  instanceId: INSTANCE_ID,
  instanceToken: INSTANCE_TOKEN,
  phone: TO_PHONE,
  messageId: MESSAGE_ID,
  reaction: '👍',
});

console.log('Reaction response:');
console.dir(reaction, { depth: null });

const chat = await vzaps.chats.get({
  instanceId: INSTANCE_ID,
  instanceToken: INSTANCE_TOKEN,
  phone: TO_PHONE,
});

console.log('Chat metadata:');
console.dir(chat, { depth: null });

const pinned = await vzaps.chats.pin({
  instanceId: INSTANCE_ID,
  instanceToken: INSTANCE_TOKEN,
  phone: TO_PHONE,
});

console.log('Pin chat response:');
console.dir(pinned, { depth: null });
