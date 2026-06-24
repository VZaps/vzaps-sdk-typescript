import { VZapsClient } from '@vzaps/sdk';

const CLIENT_TOKEN = 'your-client-token';
const CLIENT_SECRET = 'your-client-secret';
const INSTANCE_ID = 'VZ...';
const INSTANCE_TOKEN = 'your-instance-token';

const MESSAGE_ID_TO_REMOVE = 'queue-message-id';

const vzaps = new VZapsClient({
  clientToken: CLIENT_TOKEN,
  clientSecret: CLIENT_SECRET,
});

const messages = await vzaps.queues.listMessages({
  instanceId: INSTANCE_ID,
  instanceToken: INSTANCE_TOKEN,
});

console.log('Message queue:');
console.dir(messages, { depth: null });

const operations = await vzaps.queues.listOperations({
  instanceId: INSTANCE_ID,
  instanceToken: INSTANCE_TOKEN,
});

console.log('Operation queue:');
console.dir(operations, { depth: null });

// Remove one queued message when you know its queue id.
const removed = await vzaps.queues.removeMessage({
  instanceId: INSTANCE_ID,
  instanceToken: INSTANCE_TOKEN,
  messageId: MESSAGE_ID_TO_REMOVE,
});

console.log('Removed queued message:');
console.dir(removed, { depth: null });

// Dangerous: clears the full message queue. Keep commented unless testing cleanup.
// const purged = await vzaps.queues.purgeMessages({ instanceId: INSTANCE_ID, instanceToken: INSTANCE_TOKEN });
// console.dir(purged, { depth: null });
