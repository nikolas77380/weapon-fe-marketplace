export interface SendbirdContextValue {
  sendbird: any | null;
  currentUser: {
    id: number;
    [key: string]: any;
  } | null;
  isConnected: boolean;
  connectionState: string | undefined;
  utils: any | null;
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
