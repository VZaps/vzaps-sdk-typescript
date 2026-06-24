import { VZapsClient } from '@vzaps/sdk';

const CLIENT_TOKEN = 'your-client-token';
const CLIENT_SECRET = 'your-client-secret';

const vzaps = new VZapsClient({
  clientToken: CLIENT_TOKEN,
  clientSecret: CLIENT_SECRET,
});

const accessToken = await vzaps.auth.getAccessToken();
console.log('Authenticated. JWT prefix:', `${accessToken.slice(0, 16)}...`);

const instances = await vzaps.instances.list({
  page: 1,
  pageSize: 10,
});

console.log('Instances response:');
console.dir(instances, { depth: null });
