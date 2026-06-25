import type { HttpClient } from './http.js';
import type {
  ChatClearRequest,
  ChatDeleteRequest,
  ChatExpirationRequest,
  ChatListRequest,
  ChatMuteRequest,
  ChatRequest,
  ChatwootImportRequest,
  ChatwootRequest,
  ContactAddRequest,
  GroupInfoRequest,
  GroupInviteLinkRequest,
  GroupListRequest,
  GroupMutationRequest,
  InstanceCreateRequest,
  InstanceListRequest,
  InstanceRequestOptions,
  InstanceScopedRequest,
  MessageDeleteRequest,
  MessageDownloadRequest,
  MessageEditRequest,
  MessageMarkReadRequest,
  MessagePollVoteRequest,
  MessagePresenceRequest,
  MessageReactRemoveRequest,
  MessageReactRequest,
  MessageSendAudioRequest,
  MessageSendButtonsRequest,
  MessageSendContactRequest,
  MessageSendDocumentRequest,
  MessageSendGifRequest,
  MessageSendImageRequest,
  MessageSendLinkRequest,
  MessageSendListRequest,
  MessageSendLocationRequest,
  MessageSendPollRequest,
  MessageSendStickerRequest,
  MessageSendTextRequest,
  MessageSendVideoRequest,
  QueueMessageRequest,
  QueueRequest,
  TypebotMutationRequest,
  TypebotRequest,
  TypebotSessionRequest,
  TypebotStartSessionRequest,
  UserAvatarRequest,
  UserPhonesRequest,
  WebhookConfigRequest,
  WebhookLogRequest,
  WebhookLogSearchRequest,
} from './types.js';

type SignalOptions = { signal?: AbortSignal };
type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export class AuthResource {
  constructor(private readonly http: HttpClient) {}

  getAccessToken(signal?: AbortSignal): Promise<string> {
    return this.http.getAccessToken(signal);
  }
}

export class InstancesResource {
  constructor(private readonly http: HttpClient) {}

  create<TResponse = unknown>(data: InstanceCreateRequest, options: { signal?: AbortSignal } = {}): Promise<TResponse> {
    return this.http.request<TResponse>('PUT', '/instances/create', {
      body: data,
      signal: options.signal,
    });
  }

  list<TResponse = unknown>(data: InstanceListRequest = {}, options: { signal?: AbortSignal } = {}): Promise<TResponse> {
    const page = data.page ?? 1;
    const size = data.size ?? data.pageSize ?? 20;
    const filter =
      data.filter ??
      (typeof data.search === 'string' && data.search.trim() !== '' ? { query: data.search.trim() } : {});

    return this.http.request<TResponse>('POST', '/instances/list', {
      body: {
        page,
        size,
        filter,
        sort: data.sort,
        sortDesc: data.sortDesc,
      },
      signal: options.signal,
    });
  }

  get<TResponse = unknown>(instanceId: string, options: { signal?: AbortSignal } = {}): Promise<TResponse> {
    return this.http.request<TResponse>('POST', '/instances/get', {
      body: { id: instanceId },
      signal: options.signal,
    });
  }

  update<TResponse = unknown>(
    instanceId: string,
    data: Record<string, unknown>,
    options: InstanceRequestOptions = {},
  ): Promise<TResponse> {
    return this.http.request<TResponse>('PATCH', `/instances/${encodeURIComponent(instanceId)}`, {
      body: data,
      signal: options.signal,
      instanceToken: options.instanceToken,
    });
  }

  restart<TResponse = unknown>(instanceId: string, options: InstanceRequestOptions = {}): Promise<TResponse> {
    return this.http.request<TResponse>('POST', `/instances/${encodeURIComponent(instanceId)}/restart`, {
      signal: options.signal,
      instanceToken: options.instanceToken,
    });
  }

  delete<TResponse = unknown>(instanceId: string, options: InstanceRequestOptions = {}): Promise<TResponse> {
    return this.http.request<TResponse>('DELETE', `/instances/${encodeURIComponent(instanceId)}`, {
      signal: options.signal,
      instanceToken: options.instanceToken,
    });
  }

  provision<TResponse = unknown>(data: InstanceCreateRequest, options: SignalOptions = {}): Promise<TResponse> {
    return this.http.request<TResponse>('PUT', '/instances/provision', {
      body: data,
      signal: options.signal,
    });
  }

  search<TResponse = unknown>(data: Record<string, unknown>, options: SignalOptions = {}): Promise<TResponse> {
    return this.http.request<TResponse>('POST', '/instances/search', {
      body: data,
      signal: options.signal,
    });
  }

  subscribe<TResponse = unknown>(
    instanceId: string,
    data: Record<string, unknown> = {},
    options: InstanceRequestOptions = {},
  ): Promise<TResponse> {
    return this.http.request<TResponse>('POST', `/instances/${encodeURIComponent(instanceId)}/subscribe`, {
      body: data,
      signal: options.signal,
      instanceToken: options.instanceToken,
    });
  }

  resumeSubscription<TResponse = unknown>(instanceId: string, options: InstanceRequestOptions = {}): Promise<TResponse> {
    return this.http.request<TResponse>('POST', `/instances/${encodeURIComponent(instanceId)}/resume-subscription`, {
      signal: options.signal,
      instanceToken: options.instanceToken,
    });
  }

  cancel<TResponse = unknown>(instanceId: string, options: InstanceRequestOptions = {}): Promise<TResponse> {
    return this.http.request<TResponse>('PUT', `/instances/${encodeURIComponent(instanceId)}/cancel`, {
      signal: options.signal,
      instanceToken: options.instanceToken,
    });
  }
}

export class MessagesResource {
  constructor(private readonly http: HttpClient) {}

  sendText<TResponse = unknown>(request: MessageSendTextRequest, options: { signal?: AbortSignal } = {}): Promise<TResponse> {
    return this.post<TResponse>('/chat/send/text', request, options);
  }

  sendImage<TResponse = unknown>(request: MessageSendImageRequest, options: SignalOptions = {}): Promise<TResponse> {
    return this.post<TResponse>('/chat/send/image', request, options);
  }

  sendAudio<TResponse = unknown>(request: MessageSendAudioRequest, options: SignalOptions = {}): Promise<TResponse> {
    return this.post<TResponse>('/chat/send/audio', request, options);
  }

  sendDocument<TResponse = unknown>(request: MessageSendDocumentRequest, options: SignalOptions = {}): Promise<TResponse> {
    return this.post<TResponse>('/chat/send/document', request, options);
  }

  sendVideo<TResponse = unknown>(request: MessageSendVideoRequest, options: SignalOptions = {}): Promise<TResponse> {
    return this.post<TResponse>('/chat/send/video', request, options);
  }

  sendSticker<TResponse = unknown>(request: MessageSendStickerRequest, options: SignalOptions = {}): Promise<TResponse> {
    return this.post<TResponse>('/chat/send/sticker', request, options);
  }

  sendGif<TResponse = unknown>(request: MessageSendGifRequest, options: SignalOptions = {}): Promise<TResponse> {
    return this.post<TResponse>('/chat/send/gif', request, options);
  }

  sendLocation<TResponse = unknown>(request: MessageSendLocationRequest, options: SignalOptions = {}): Promise<TResponse> {
    return this.post<TResponse>('/chat/send/location', request, options);
  }

  sendContact<TResponse = unknown>(request: MessageSendContactRequest, options: SignalOptions = {}): Promise<TResponse> {
    return this.post<TResponse>('/chat/send/contact', request, options);
  }

  sendButtons<TResponse = unknown>(request: MessageSendButtonsRequest, options: SignalOptions = {}): Promise<TResponse> {
    return this.post<TResponse>('/chat/send/buttons', request, options);
  }

  sendList<TResponse = unknown>(request: MessageSendListRequest, options: SignalOptions = {}): Promise<TResponse> {
    return this.post<TResponse>('/chat/send/list', request, options);
  }

  sendLink<TResponse = unknown>(request: MessageSendLinkRequest, options: SignalOptions = {}): Promise<TResponse> {
    return this.post<TResponse>('/chat/send/link', request, options);
  }

  sendPoll<TResponse = unknown>(request: MessageSendPollRequest, options: SignalOptions = {}): Promise<TResponse> {
    return this.post<TResponse>('/chat/send/poll', request, options);
  }

  pollVote<TResponse = unknown>(request: MessagePollVoteRequest, options: SignalOptions = {}): Promise<TResponse> {
    return this.post<TResponse>('/chat/poll/vote', request, options);
  }

  react<TResponse = unknown>(request: MessageReactRequest, options: SignalOptions = {}): Promise<TResponse> {
    return this.post<TResponse>('/chat/react', request, options);
  }

  removeReaction<TResponse = unknown>(request: MessageReactRemoveRequest, options: SignalOptions = {}): Promise<TResponse> {
    return this.sendRequest<TResponse>('DELETE', '/chat/react', request, options);
  }

  presence<TResponse = unknown>(request: MessagePresenceRequest, options: SignalOptions = {}): Promise<TResponse> {
    return this.post<TResponse>('/chat/presence', request, options);
  }

  markRead<TResponse = unknown>(request: MessageMarkReadRequest, options: SignalOptions = {}): Promise<TResponse> {
    return this.post<TResponse>('/chat/markread', request, options);
  }

  downloadImage<TResponse = unknown>(request: MessageDownloadRequest, options: SignalOptions = {}): Promise<TResponse> {
    return this.post<TResponse>('/chat/downloadimage', request, options);
  }

  downloadVideo<TResponse = unknown>(request: MessageDownloadRequest, options: SignalOptions = {}): Promise<TResponse> {
    return this.post<TResponse>('/chat/downloadvideo', request, options);
  }

  downloadAudio<TResponse = unknown>(request: MessageDownloadRequest, options: SignalOptions = {}): Promise<TResponse> {
    return this.post<TResponse>('/chat/downloadaudio', request, options);
  }

  downloadDocument<TResponse = unknown>(request: MessageDownloadRequest, options: SignalOptions = {}): Promise<TResponse> {
    return this.post<TResponse>('/chat/downloaddocument', request, options);
  }

  edit<TResponse = unknown>(request: MessageEditRequest, options: SignalOptions = {}): Promise<TResponse> {
    const { messageId, ...rest } = request;
    return this.sendRequest<TResponse>('PATCH', `/chat/messages/${encodeURIComponent(messageId)}`, rest, options);
  }

  delete<TResponse = unknown>(request: MessageDeleteRequest, options: SignalOptions = {}): Promise<TResponse> {
    const { messageId, ...rest } = request;
    return this.sendRequest<TResponse>('DELETE', `/chat/messages/${encodeURIComponent(messageId)}`, rest, options);
  }

  send<TResponse = unknown>(
    instanceId: string,
    path: string,
    body: Record<string, unknown>,
    options: InstanceRequestOptions = {},
  ): Promise<TResponse> {
    return this.http.request<TResponse>('POST', `/instances/${encodeURIComponent(instanceId)}/chat/${path.replace(/^\/+/, '')}`, {
      body,
      signal: options.signal,
      instanceToken: options.instanceToken,
    });
  }

  private post<TResponse>(path: string, request: InstanceScopedRequest, options: SignalOptions): Promise<TResponse> {
    return this.sendRequest<TResponse>('POST', path, request, options);
  }

  private sendRequest<TResponse>(
    method: Method,
    path: string,
    request: InstanceScopedRequest,
    options: SignalOptions,
  ): Promise<TResponse> {
    const { instanceId, instanceToken, ...body } = request;
    return this.http.request<TResponse>(method, `/instances/${encodeURIComponent(instanceId)}${path}`, {
      body,
      signal: options.signal,
      instanceToken,
    });
  }
}

export class WebhooksResource {
  constructor(private readonly http: HttpClient) {}

  get<TResponse = unknown>(instanceId: string, options: InstanceRequestOptions = {}): Promise<TResponse> {
    return this.http.request<TResponse>('GET', `/instances/${encodeURIComponent(instanceId)}/webhook`, {
      signal: options.signal,
      instanceToken: options.instanceToken,
    });
  }

  set<TResponse = unknown>(request: WebhookConfigRequest, options: { signal?: AbortSignal } = {}): Promise<TResponse> {
    const { instanceId, instanceToken, ...body } = request;

    return this.http.request<TResponse>('POST', `/instances/${encodeURIComponent(instanceId)}/webhook`, {
      body,
      signal: options.signal,
      instanceToken,
    });
  }

  searchLogs<TResponse = unknown>(request: WebhookLogSearchRequest, options: SignalOptions = {}): Promise<TResponse> {
    const { instanceId, instanceToken, ...body } = request;
    return this.http.request<TResponse>('POST', `/instances/${encodeURIComponent(instanceId)}/webhook/logs/search`, {
      body,
      signal: options.signal,
      instanceToken,
    });
  }

  getLog<TResponse = unknown>(request: WebhookLogRequest, options: SignalOptions = {}): Promise<TResponse> {
    return this.http.request<TResponse>(
      'GET',
      `/instances/${encodeURIComponent(request.instanceId)}/webhook/logs/${encodeURIComponent(request.logId)}`,
      {
        signal: options.signal,
        instanceToken: request.instanceToken,
      },
    );
  }

  retryLog<TResponse = unknown>(request: WebhookLogRequest, options: SignalOptions = {}): Promise<TResponse> {
    return this.http.request<TResponse>(
      'POST',
      `/instances/${encodeURIComponent(request.instanceId)}/webhook/logs/${encodeURIComponent(request.logId)}/retry`,
      {
        signal: options.signal,
        instanceToken: request.instanceToken,
      },
    );
  }
}

export class ContactsResource {
  constructor(private readonly http: HttpClient) {}

  list<TResponse = unknown>(instanceId: string, options: InstanceRequestOptions = {}): Promise<TResponse> {
    return this.http.request<TResponse>('GET', `/instances/${encodeURIComponent(instanceId)}/contact/list`, {
      signal: options.signal,
      instanceToken: options.instanceToken,
    });
  }

  add<TResponse = unknown>(request: ContactAddRequest, options: { signal?: AbortSignal } = {}): Promise<TResponse> {
    const { instanceId, instanceToken, ...body } = request;

    return this.http.request<TResponse>('POST', `/instances/${encodeURIComponent(instanceId)}/contact/add`, {
      body,
      signal: options.signal,
      instanceToken,
    });
  }
}

export class GroupsResource {
  constructor(private readonly http: HttpClient) {}

  list<TResponse = unknown>(request: GroupListRequest, options: { signal?: AbortSignal } = {}): Promise<TResponse> {
    const { instanceId, instanceToken, page, pageSize } = request;

    return this.http.request<TResponse>('GET', `/instances/${encodeURIComponent(instanceId)}/group/list`, {
      query: { page, pageSize },
      signal: options.signal,
      instanceToken,
    });
  }

  get<TResponse = unknown>(request: GroupInfoRequest, options: { signal?: AbortSignal } = {}): Promise<TResponse> {
    return this.http.request<TResponse>('GET', `/instances/${encodeURIComponent(request.instanceId)}/group/info`, {
      query: { groupId: request.groupId },
      signal: options.signal,
      instanceToken: request.instanceToken,
    });
  }

  inviteLink<TResponse = unknown>(request: GroupInviteLinkRequest, options: SignalOptions = {}): Promise<TResponse> {
    return this.http.request<TResponse>('GET', `/instances/${encodeURIComponent(request.instanceId)}/group/invitelink`, {
      query: { groupId: request.groupId, reset: request.reset },
      signal: options.signal,
      instanceToken: request.instanceToken,
    });
  }

  setPhoto<TResponse = unknown>(request: GroupMutationRequest, options: SignalOptions = {}): Promise<TResponse> {
    return postInstancePath(this.http, request, '/group/photo', options);
  }

  setName<TResponse = unknown>(request: GroupMutationRequest, options: SignalOptions = {}): Promise<TResponse> {
    return postInstancePath(this.http, request, '/group/name', options);
  }

  setDescription<TResponse = unknown>(request: GroupMutationRequest, options: SignalOptions = {}): Promise<TResponse> {
    return postInstancePath(this.http, request, '/group/description', options);
  }

  setSettings<TResponse = unknown>(request: GroupMutationRequest, options: SignalOptions = {}): Promise<TResponse> {
    return postInstancePath(this.http, request, '/group/settings', options);
  }

  create<TResponse = unknown>(request: GroupMutationRequest, options: SignalOptions = {}): Promise<TResponse> {
    return postInstancePath(this.http, request, '/group/create', options);
  }

  addAdmin<TResponse = unknown>(request: GroupMutationRequest, options: SignalOptions = {}): Promise<TResponse> {
    return postInstancePath(this.http, request, '/group/add-admin', options);
  }

  removeAdmin<TResponse = unknown>(request: GroupMutationRequest, options: SignalOptions = {}): Promise<TResponse> {
    return postInstancePath(this.http, request, '/group/remove-admin', options);
  }
}

export class SessionsResource {
  constructor(private readonly http: HttpClient) {}

  status<TResponse = unknown>(instanceId: string, options: InstanceRequestOptions = {}): Promise<TResponse> {
    return this.http.request<TResponse>('GET', `/instances/${encodeURIComponent(instanceId)}/session/status`, {
      signal: options.signal,
      instanceToken: options.instanceToken,
    });
  }

  qr<TResponse = unknown>(instanceId: string, options: InstanceRequestOptions = {}): Promise<TResponse> {
    return this.http.request<TResponse>('GET', `/instances/${encodeURIComponent(instanceId)}/session/qr`, {
      signal: options.signal,
      instanceToken: options.instanceToken,
    });
  }

  pairCode<TResponse = unknown>(instanceId: string, phone: string, options: InstanceRequestOptions = {}): Promise<TResponse> {
    return this.http.request<TResponse>(
      'GET',
      `/instances/${encodeURIComponent(instanceId)}/session/paircode/${encodeURIComponent(phone)}`,
      {
        signal: options.signal,
        instanceToken: options.instanceToken,
      },
    );
  }

  disconnect<TResponse = unknown>(instanceId: string, options: InstanceRequestOptions = {}): Promise<TResponse> {
    return this.http.request<TResponse>('POST', `/instances/${encodeURIComponent(instanceId)}/session/disconnect`, {
      signal: options.signal,
      instanceToken: options.instanceToken,
    });
  }
}

export class UsersResource {
  constructor(private readonly http: HttpClient) {}

  info<TResponse = unknown>(request: UserPhonesRequest, options: SignalOptions = {}): Promise<TResponse> {
    return postInstancePath(this.http, request, '/user/info', options);
  }

  check<TResponse = unknown>(request: UserPhonesRequest, options: SignalOptions = {}): Promise<TResponse> {
    return postInstancePath(this.http, request, '/user/check', options);
  }

  avatar<TResponse = unknown>(request: UserAvatarRequest, options: SignalOptions = {}): Promise<TResponse> {
    return postInstancePath(this.http, request, '/user/avatar', options);
  }

  contacts<TResponse = unknown>(instanceId: string, options: InstanceRequestOptions = {}): Promise<TResponse> {
    return this.http.request<TResponse>('GET', `/instances/${encodeURIComponent(instanceId)}/user/contacts`, {
      signal: options.signal,
      instanceToken: options.instanceToken,
    });
  }
}

export class QueuesResource {
  constructor(private readonly http: HttpClient) {}

  listMessages<TResponse = unknown>(request: QueueRequest, options: SignalOptions = {}): Promise<TResponse> {
    return getInstancePath(this.http, request, '/queue/messages', options);
  }

  purgeMessages<TResponse = unknown>(request: QueueRequest, options: SignalOptions = {}): Promise<TResponse> {
    return deleteInstancePath(this.http, request, '/queue/messages', options);
  }

  removeMessage<TResponse = unknown>(request: QueueMessageRequest, options: SignalOptions = {}): Promise<TResponse> {
    const { messageId, ...rest } = request;
    return deleteInstancePath(this.http, rest, `/queue/messages/${encodeURIComponent(messageId)}`, options);
  }

  listOperations<TResponse = unknown>(request: QueueRequest, options: SignalOptions = {}): Promise<TResponse> {
    return getInstancePath(this.http, request, '/queue/operations', options);
  }

  purgeOperations<TResponse = unknown>(request: QueueRequest, options: SignalOptions = {}): Promise<TResponse> {
    return deleteInstancePath(this.http, request, '/queue/operations', options);
  }

  removeOperation<TResponse = unknown>(request: QueueMessageRequest, options: SignalOptions = {}): Promise<TResponse> {
    const { messageId, ...rest } = request;
    return deleteInstancePath(this.http, rest, `/queue/operations/${encodeURIComponent(messageId)}`, options);
  }
}

export class TypebotsResource {
  constructor(private readonly http: HttpClient) {}

  list<TResponse = unknown>(instanceId: string, options: InstanceRequestOptions = {}): Promise<TResponse> {
    return this.http.request<TResponse>('GET', `/instances/${encodeURIComponent(instanceId)}/typebots`, {
      signal: options.signal,
      instanceToken: options.instanceToken,
    });
  }

  create<TResponse = unknown>(request: TypebotRequest, options: SignalOptions = {}): Promise<TResponse> {
    return postInstancePath(this.http, request, '/typebots', options);
  }

  update<TResponse = unknown>(request: TypebotMutationRequest, options: SignalOptions = {}): Promise<TResponse> {
    const { typebotId, ...rest } = request;
    return requestInstancePath(this.http, 'PATCH', rest, `/typebots/${encodeURIComponent(typebotId)}`, options);
  }

  delete<TResponse = unknown>(request: TypebotMutationRequest, options: SignalOptions = {}): Promise<TResponse> {
    const { typebotId, ...rest } = request;
    return deleteInstancePath(this.http, rest, `/typebots/${encodeURIComponent(typebotId)}`, options);
  }

  listSessions<TResponse = unknown>(instanceId: string, options: InstanceRequestOptions = {}): Promise<TResponse> {
    return this.http.request<TResponse>('GET', `/instances/${encodeURIComponent(instanceId)}/typebots/sessions`, {
      signal: options.signal,
      instanceToken: options.instanceToken,
    });
  }

  startSession<TResponse = unknown>(request: TypebotStartSessionRequest, options: SignalOptions = {}): Promise<TResponse> {
    const { typebotId, ...rest } = request;
    const path = typebotId ? `/typebots/${encodeURIComponent(typebotId)}/sessions/start` : '/typebots/sessions/start';
    return postInstancePath(this.http, rest, path, options);
  }

  closeSession<TResponse = unknown>(request: TypebotSessionRequest, options: SignalOptions = {}): Promise<TResponse> {
    const { session, ...rest } = request;
    return postInstancePath(this.http, rest, `/typebots/sessions/${encodeURIComponent(session)}/close`, options);
  }

  pauseSession<TResponse = unknown>(request: TypebotSessionRequest, options: SignalOptions = {}): Promise<TResponse> {
    const { session, ...rest } = request;
    return postInstancePath(this.http, rest, `/typebots/sessions/${encodeURIComponent(session)}/pause`, options);
  }
}

export class ChatwootResource {
  constructor(private readonly http: HttpClient) {}

  get<TResponse = unknown>(instanceId: string, options: InstanceRequestOptions = {}): Promise<TResponse> {
    return this.http.request<TResponse>('GET', `/instances/${encodeURIComponent(instanceId)}/chatwoot`, {
      signal: options.signal,
      instanceToken: options.instanceToken,
    });
  }

  set<TResponse = unknown>(request: ChatwootRequest, options: SignalOptions = {}): Promise<TResponse> {
    return postInstancePath(this.http, request, '/chatwoot', options);
  }

  delete<TResponse = unknown>(instanceId: string, options: InstanceRequestOptions = {}): Promise<TResponse> {
    return this.http.request<TResponse>('DELETE', `/instances/${encodeURIComponent(instanceId)}/chatwoot`, {
      signal: options.signal,
      instanceToken: options.instanceToken,
    });
  }

  triggerImport<TResponse = unknown>(request: ChatwootImportRequest, options: SignalOptions = {}): Promise<TResponse> {
    const { what, ...rest } = request;
    return postInstancePath(this.http, rest, `/chatwoot/import/${encodeURIComponent(what)}`, options);
  }
}

export class ChatsResource {
  constructor(private readonly http: HttpClient) {}

  list<TResponse = unknown>(request: ChatListRequest, options: SignalOptions = {}): Promise<TResponse> {
    const { instanceId, instanceToken, page, pageSize } = request;
    return this.http.request<TResponse>('GET', `/instances/${encodeURIComponent(instanceId)}/chats`, {
      query: { page, pageSize },
      signal: options.signal,
      instanceToken,
    });
  }

  get<TResponse = unknown>(request: ChatRequest, options: SignalOptions = {}): Promise<TResponse> {
    return this.chatAction<TResponse>('GET', request, '', options);
  }

  archive<TResponse = unknown>(request: ChatRequest, options: SignalOptions = {}): Promise<TResponse> {
    return this.chatAction<TResponse>('POST', request, '/archive', options);
  }

  unarchive<TResponse = unknown>(request: ChatRequest, options: SignalOptions = {}): Promise<TResponse> {
    return this.chatAction<TResponse>('POST', request, '/unarchive', options);
  }

  mute<TResponse = unknown>(request: ChatMuteRequest, options: SignalOptions = {}): Promise<TResponse> {
    return this.chatAction<TResponse>('POST', request, '/mute', options);
  }

  unmute<TResponse = unknown>(request: ChatRequest, options: SignalOptions = {}): Promise<TResponse> {
    return this.chatAction<TResponse>('POST', request, '/unmute', options);
  }

  pin<TResponse = unknown>(request: ChatRequest, options: SignalOptions = {}): Promise<TResponse> {
    return this.chatAction<TResponse>('POST', request, '/pin', options);
  }

  unpin<TResponse = unknown>(request: ChatRequest, options: SignalOptions = {}): Promise<TResponse> {
    return this.chatAction<TResponse>('POST', request, '/unpin', options);
  }

  read<TResponse = unknown>(request: ChatRequest, options: SignalOptions = {}): Promise<TResponse> {
    return this.chatAction<TResponse>('POST', request, '/read', options);
  }

  unread<TResponse = unknown>(request: ChatRequest, options: SignalOptions = {}): Promise<TResponse> {
    return this.chatAction<TResponse>('POST', request, '/unread', options);
  }

  clear<TResponse = unknown>(request: ChatClearRequest, options: SignalOptions = {}): Promise<TResponse> {
    return this.chatAction<TResponse>('POST', request, '/clear', options);
  }

  delete<TResponse = unknown>(request: ChatDeleteRequest, options: SignalOptions = {}): Promise<TResponse> {
    return this.chatAction<TResponse>('DELETE', request, '', options);
  }

  setExpiration<TResponse = unknown>(request: ChatExpirationRequest, options: SignalOptions = {}): Promise<TResponse> {
    return this.chatAction<TResponse>('PUT', request, '/expiration', options);
  }

  private chatAction<TResponse>(method: Method, request: ChatRequest, suffix: string, options: SignalOptions): Promise<TResponse> {
    const { instanceId, instanceToken, phone, ...body } = request;
    return this.http.request<TResponse>(method, `/instances/${encodeURIComponent(instanceId)}/chats/${encodeURIComponent(phone)}${suffix}`, {
      body: Object.keys(body).length > 0 ? body : undefined,
      signal: options.signal,
      instanceToken,
    });
  }
}

function getInstancePath<TResponse>(
  http: HttpClient,
  request: InstanceScopedRequest,
  path: string,
  options: SignalOptions,
): Promise<TResponse> {
  return requestInstancePath(http, 'GET', request, path, options);
}

function postInstancePath<TResponse>(
  http: HttpClient,
  request: InstanceScopedRequest,
  path: string,
  options: SignalOptions,
): Promise<TResponse> {
  return requestInstancePath(http, 'POST', request, path, options);
}

function deleteInstancePath<TResponse>(
  http: HttpClient,
  request: InstanceScopedRequest,
  path: string,
  options: SignalOptions,
): Promise<TResponse> {
  return requestInstancePath(http, 'DELETE', request, path, options);
}

function requestInstancePath<TResponse>(
  http: HttpClient,
  method: Method,
  request: InstanceScopedRequest,
  path: string,
  options: SignalOptions,
): Promise<TResponse> {
  const { instanceId, instanceToken, ...body } = request;
  return http.request<TResponse>(method, `/instances/${encodeURIComponent(instanceId)}${path}`, {
    body: Object.keys(body).length > 0 ? body : undefined,
    signal: options.signal,
    instanceToken,
  });
}
