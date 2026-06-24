import { VZapsClient } from '@vzaps/sdk';

const CLIENT_TOKEN = 'your-client-token';
const CLIENT_SECRET = 'your-client-secret';
const INSTANCE_ID = 'VZ...';
const INSTANCE_TOKEN = 'your-instance-token';
const TO_PHONE = '5511999999999';

const IMAGE_URL = 'https://picsum.photos/800/600.jpg';
const VIDEO_URL = 'https://example.com/video.mp4';
const DOCUMENT_URL = 'https://example.com/invoice.pdf';

const vzaps = new VZapsClient({
  clientToken: CLIENT_TOKEN,
  clientSecret: CLIENT_SECRET,
});

const image = await vzaps.messages.sendImage({
  instanceId: INSTANCE_ID,
  instanceToken: INSTANCE_TOKEN,
  phone: TO_PHONE,
  image: IMAGE_URL,
  caption: 'Image sent with VZaps SDK',
});

console.log('Image response:');
console.dir(image, { depth: null });

const document = await vzaps.messages.sendDocument({
  instanceId: INSTANCE_ID,
  instanceToken: INSTANCE_TOKEN,
  phone: TO_PHONE,
  document: DOCUMENT_URL,
  fileName: 'invoice.pdf',
  caption: 'Document sent with VZaps SDK',
});

console.log('Document response:');
console.dir(document, { depth: null });

const video = await vzaps.messages.sendVideo({
  instanceId: INSTANCE_ID,
  instanceToken: INSTANCE_TOKEN,
  phone: TO_PHONE,
  video: VIDEO_URL,
  caption: 'Video sent with VZaps SDK',
});

console.log('Video response:');
console.dir(video, { depth: null });

const buttons = await vzaps.messages.sendButtons({
  instanceId: INSTANCE_ID,
  instanceToken: INSTANCE_TOKEN,
  phone: TO_PHONE,
  message: 'Choose an option',
  footer: 'VZaps SDK',
  buttons: [
    { id: 'sales', text: 'Sales' },
    { id: 'support', text: 'Support' },
  ],
});

console.log('Buttons response:');
console.dir(buttons, { depth: null });

const list = await vzaps.messages.sendList({
  instanceId: INSTANCE_ID,
  instanceToken: INSTANCE_TOKEN,
  phone: TO_PHONE,
  title: 'Main menu',
  description: 'Pick one item',
  buttonText: 'Open menu',
  sections: [
    {
      title: 'Departments',
      rows: [
        { id: 'sales', title: 'Sales', description: 'Talk to sales' },
        { id: 'support', title: 'Support', description: 'Talk to support' },
      ],
    },
  ],
});

console.log('List response:');
console.dir(list, { depth: null });
