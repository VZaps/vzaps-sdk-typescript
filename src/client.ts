import { EventsResource } from './events.js';
import { HttpClient } from './http.js';
import {
  AuthResource,
  ChatwootResource,
  ChatsResource,
  ContactsResource,
  GroupsResource,
  InstancesResource,
  MessagesResource,
  QueuesResource,
  SessionsResource,
  TypebotsResource,
  UsersResource,
  WebhooksResource,
} from './resources.js';
import type { RequestOptions, VZapsClientOptions } from './types.js';

export class VZapsClient {
  readonly auth: AuthResource;
  readonly instances: InstancesResource;
  readonly sessions: SessionsResource;
  readonly messages: MessagesResource;
  readonly webhooks: WebhooksResource;
  readonly contacts: ContactsResource;
  readonly groups: GroupsResource;
  readonly users: UsersResource;
  readonly queues: QueuesResource;
  readonly typebots: TypebotsResource;
  readonly chatwoot: ChatwootResource;
  readonly chats: ChatsResource;
  readonly events: EventsResource;

  private readonly http: HttpClient;

  constructor(options: VZapsClientOptions) {
    this.http = new HttpClient(options);
    this.auth = new AuthResource(this.http);
    this.instances = new InstancesResource(this.http);
    this.sessions = new SessionsResource(this.http);
    this.messages = new MessagesResource(this.http);
    this.webhooks = new WebhooksResource(this.http);
    this.contacts = new ContactsResource(this.http);
    this.groups = new GroupsResource(this.http);
    this.users = new UsersResource(this.http);
    this.queues = new QueuesResource(this.http);
    this.typebots = new TypebotsResource(this.http);
    this.chatwoot = new ChatwootResource(this.http);
    this.chats = new ChatsResource(this.http);
    this.events = new EventsResource(this.http, options.webSocketFactory);
  }

  request<TResponse = unknown>(method: string, path: string, options: RequestOptions = {}): Promise<TResponse> {
    return this.http.request<TResponse>(method, path, options);
  }
}
