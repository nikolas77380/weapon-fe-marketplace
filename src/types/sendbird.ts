export interface SendbirdContextValue {
  sendbird: unknown | null;
  currentUser: {
    id: number;
    [key: string]: unknown;
  } | null;
  isConnected: boolean;
  connectionState: string | undefined;
  utils: unknown | null;
  isReady: boolean;
}

export interface ChannelCreationParams {
  name: string;
  userIds: string[];
  isDistinct?: boolean;
  customType?: string;
}

export interface MessageParams {
  channelUrl: string;
  message: string;
  customType?: string;
  data?: string;
}
