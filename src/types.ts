export type FetchLike = typeof fetch;

export type JsonObject = Record<string, unknown>;

export interface WebSocketLike {
  close(code?: number, reason?: string): void;
  send(data: string): void;
  addEventListener?: (type: string, listener: (event: unknown) => void, options?: unknown) => void;
  removeEventListener?: (type: string, listener: (event: unknown) => void, options?: unknown) => void;
  on?: (type: string, listener: (...args: unknown[]) => void) => void;
  off?: (type: string, listener: (...args: unknown[]) => void) => void;
}

export type WebSocketFactory = (url: string, headers: Record<string, string>) => WebSocketLike;

export interface VZapsClientOptions {
  clientToken: string;
  clientSecret: string;
  /** @internal SDK development and tests only. Defaults to https://api.vzaps.com */
  baseUrl?: string;
  /** @internal SDK development and tests only. Defaults to wss://realtime.vzaps.com */
  realtimeUrl?: string;
  timeoutMs?: number;
  tokenSkewMs?: number;
  fetch?: FetchLike;
  webSocketFactory?: WebSocketFactory;
  userAgent?: string;
}

export interface AuthTokenResponse {
  accessToken: string;
  expiresIn: number;
}

export interface RequestOptions {
  query?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
  headers?: Record<string, string | undefined>;
  signal?: AbortSignal;
  auth?: boolean;
  instanceToken?: string;
}

export interface InstanceRequestOptions {
  instanceToken?: string;
  signal?: AbortSignal;
}

export interface PaginatedQuery {
  page?: number;
  pageSize?: number;
}

export interface InstanceScopedRequest extends JsonObject {
  instanceId: string;
  instanceToken: string;
}

export interface InstanceCreateRequest extends JsonObject {
  name: string;
  webhook?: string;
  eventsSubscribe?: string[] | string;
}

export interface InstanceListRequest extends JsonObject {
  page?: number;
  /** Page size for POST /instances/list (wire field: `size`). */
  size?: number;
  /** Alias for `size` in SDK requests. */
  pageSize?: number;
  filter?: JsonObject;
  /** Shorthand for `filter.query`. */
  search?: string;
  sort?: string;
  sortDesc?: boolean;
}

export interface MessageSendBaseRequest extends InstanceScopedRequest {
  phone: string;
}

export interface MessageSendTextRequest extends MessageSendBaseRequest {
  message: string;
}

export interface MessageSendImageRequest extends MessageSendBaseRequest {
  image: string;
  caption?: string;
}

export interface MessageSendAudioRequest extends MessageSendBaseRequest {
  audio: string;
  ptt?: boolean;
}

export interface MessageSendDocumentRequest extends MessageSendBaseRequest {
  document: string;
  fileName?: string;
  caption?: string;
}

export interface MessageSendVideoRequest extends MessageSendBaseRequest {
  video: string;
  caption?: string;
}

export interface MessageSendStickerRequest extends MessageSendBaseRequest {
  sticker: string;
}

export interface MessageSendGifRequest extends MessageSendBaseRequest {
  gif: string;
  caption?: string;
}

export interface MessageSendLocationRequest extends MessageSendBaseRequest {
  latitude: number;
  longitude: number;
  name?: string;
  address?: string;
}

export interface MessageSendContactRequest extends MessageSendBaseRequest {}

export interface MessageButton extends JsonObject {
  id: string;
  text: string;
}

export interface MessageSendButtonsRequest extends MessageSendBaseRequest {
  message: string;
  buttons: MessageButton[];
  footer?: string;
}

export interface MessageListRow extends JsonObject {
  id: string;
  title: string;
  description?: string;
}

export interface MessageListSection extends JsonObject {
  title: string;
  rows: MessageListRow[];
}

export interface MessageSendListRequest extends MessageSendBaseRequest {
  title: string;
  description: string;
  buttonText: string;
  sections: MessageListSection[];
  footer?: string;
}

export interface MessageSendLinkRequest extends MessageSendBaseRequest {
  message: string;
  linkUrl: string;
  title: string;
  linkDescription: string;
  jpegThumbnail?: string;
}

export interface MessageSendPollRequest extends MessageSendBaseRequest {
  name: string;
  options: string[];
  selectableOptionsCount?: number;
  hideParticipantNames?: boolean;
  endTime?: string;
  allowAddOption?: boolean;
}

export interface MessagePollVoteRequest extends MessageSendBaseRequest {
  messageId: string;
  vote?: string | string[];
  selectedOptions?: string[];
  pollSender?: string;
  fromMe?: boolean;
}

export interface MessageReactRequest extends MessageSendBaseRequest {
  messageId: string;
  reaction: string;
}

export interface MessageReactRemoveRequest extends MessageSendBaseRequest {
  messageId: string;
}

export interface MessagePresenceRequest extends MessageSendBaseRequest {
  state: string;
  media?: string;
}

export interface MessageMarkReadRequest extends InstanceScopedRequest {
  id: string[];
  chat: string;
  sender?: string;
}

export interface MessageDownloadRequest extends InstanceScopedRequest {}

export interface MessageEditRequest extends InstanceScopedRequest {
  messageId: string;
  message: string;
}

export interface MessageDeleteRequest extends InstanceScopedRequest {
  messageId: string;
}

export interface WebhookConfigRequest extends InstanceScopedRequest {
  webhookURL: string;
  events?: string[] | string;
}

export interface WebhookLogSearchRequest extends InstanceScopedRequest {}

export interface WebhookLogRequest extends InstanceScopedRequest {
  logId: string;
}

export interface ContactAddRequest extends InstanceScopedRequest {
  phone: string;
  firstName: string;
  fullName: string;
}

export interface UserPhonesRequest extends InstanceScopedRequest {
  phone?: string;
}

export interface UserAvatarRequest extends InstanceScopedRequest {
  phone?: string;
}

export interface GroupListRequest extends InstanceScopedRequest, PaginatedQuery {}

export interface GroupInfoRequest extends InstanceScopedRequest {
  groupId: string;
}

export interface GroupInviteLinkRequest extends GroupInfoRequest {
  reset?: boolean;
}

export interface GroupMutationRequest extends InstanceScopedRequest {
  groupId?: string;
  image?: string;
  name?: string;
  description?: string;
  adminOnlyMessage?: boolean;
  adminOnlySettings?: boolean;
  delayMessage?: number;
  groupName?: string;
  groupDescription?: string;
  groupImage?: string;
  participants?: string[];
}

export interface QueueRequest extends InstanceScopedRequest {}

export interface QueueMessageRequest extends InstanceScopedRequest {
  messageId: string;
}

export interface TypebotRequest extends InstanceScopedRequest {
  enabled?: boolean;
  description?: string;
  typebotUrl?: string;
  publicId?: string;
  triggerType?: string;
  triggerOperator?: string;
  triggerValue?: string;
  priority?: number;
  expireInMinutes?: number;
  keywordFinish?: string;
  defaultDelayMs?: number;
  unknownMessage?: string;
  listenFromMe?: boolean;
  stopBotFromMe?: boolean;
  keepOpen?: boolean;
  debounceMs?: number;
  ignoreGroups?: boolean;
  transcribeAudio?: boolean;
}

export interface TypebotMutationRequest extends TypebotRequest {
  typebotId: string;
}

export interface TypebotSessionRequest extends InstanceScopedRequest {
  session: string;
}

export interface TypebotStartSessionRequest extends InstanceScopedRequest {
  typebotId?: string;
  publicId?: string;
  phone: string;
  pushName?: string;
  message: string;
}

export interface ChatwootRequest extends InstanceScopedRequest {
  enabled?: boolean;
  url?: string;
  accountId?: string;
  token?: string;
  nameInbox?: string;
  signMsg?: boolean;
  signDelimiter?: string;
  number?: string;
  reopenConversation?: boolean;
  conversationPending?: boolean;
  importContacts?: boolean;
  importMessages?: boolean;
  daysLimitImportMessages?: number;
  autoCreate?: boolean;
  organization?: string;
  logo?: string;
  ignoreJids?: unknown;
  ignoreGroups?: boolean;
}

export type ChatwootImportScope = 'contacts' | 'messages' | 'all';

export interface ChatwootImportRequest extends InstanceScopedRequest {
  what: ChatwootImportScope;
}

export interface ChatRequest extends InstanceScopedRequest {
  phone: string;
}

export interface ChatListRequest extends InstanceScopedRequest, PaginatedQuery {}

export interface ChatDeleteRequest extends ChatRequest {
  deleteMedia?: boolean;
}

export interface ChatMuteRequest extends ChatRequest {
  durationSeconds?: number;
}

export interface ChatClearRequest extends ChatRequest {
  deleteMedia?: boolean;
}

export interface ChatExpirationRequest extends ChatRequest {
  expiration: '24_HOURS' | '7_DAYS' | '90_DAYS' | 'OFF' | (string & {});
}

export interface SessionBusinessCategory {
  id: string;
  name: string;
}

export interface SessionBusinessProfile {
  businessHoursTimezone?: string;
  categories?: SessionBusinessCategory[];
  profileOptions?: Record<string, string>;
  address?: string;
  email?: string;
}

/** `data` payload for `GET /instances/{id}/session/status`. Profile fields are present only when `connected` is true. */
export interface SessionStatusData {
  connected: boolean;
  phone?: string;
  whatsappJid?: string;
  pushName?: string;
  businessName?: string;
  businessProfile?: SessionBusinessProfile;
  profilePictureId?: string;
  profilePictureUrl?: string;
  profileUrl?: string;
  verifiedName?: string;
  about?: string;
  website?: string;
}

export interface SessionStatusResponse {
  code: number;
  success: boolean;
  data: SessionStatusData;
}

export type VZapsEventType =
  | 'Message'
  | 'ReadReceipt'
  | 'Presence'
  | 'HistorySync'
  | 'ChatPresence'
  | 'Connected'
  | 'Disconnected'
  | 'GroupParticipantsAdd'
  | 'GroupParticipantsRemove'
  | 'All'
  | (string & {});

export interface VZapsEvent<TData = unknown> {
  id: string;
  type: VZapsEventType;
  instance_id: string;
  created_at: string;
  data: TData;
}

export interface EventSubscribeRequest {
  instanceId: string;
  events?: VZapsEventType[];
  instanceToken: string;
  signal?: AbortSignal;
  reconnect?: boolean;
  maxRetries?: number;
  retryDelayMs?: number;
  lastEventId?: string;
}

export type EventHandler<TEvent = VZapsEvent> = (event: TEvent) => void | Promise<void>;
export type ErrorHandler = (error: unknown) => void;
