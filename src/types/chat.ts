export interface User {
  id: number;
  username: string;
  email: string;
  displayName: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
  metadata?: {
    avatar?: {
      id: number;
      documentId: string;
      name: string;
      url: string;
      ext: string;
      mime: string;
      size: number;
      width: number;
      height: number;
      hash: string;
      provider: string;
      createdAt: string;
      updatedAt: string;
      publishedAt: string;
      folderPath: string;
      alternativeText?: string;
      caption?: string;
      previewUrl?: string;
      provider_metadata?: any;
      locale?: string;
      formats?: any;
    };
    companyName?: string;
  };
}

export interface Chat {
  id: number;
  topic: string;
  participants: User[];
  status:
    | "active"
    | "successfully_completed"
    | "unsuccessfully_completed"
    | "closed";
  messages?: Message[];
  hasUnreadMessages?: boolean; // Флаг наличия непрочитанных сообщений
  product?: {
    id: number;
    title: string;
    slug: string;
    images?: Array<{
      id: number;
      url: string;
    }>;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: number;
  text: string;
  sender?: User; // Опционально для системных сообщений
  chat: Chat;
  isRead: boolean;
  readBy: User[];
  isSystem?: boolean;
  product?: {
    id: number;
    title: string;
    slug: string;
    images?: Array<{
      id: number;
      url: string;
    }>;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateChatRequest {
  topic?: string;
  participantIds: number[];
  productId?: number;
}

export interface SendMessageRequest {
  text: string;
  chatId: number;
}

export interface MarkAsReadRequest {
  messageIds: number[];
}

export interface FinishChatRequest {
  status: "successfully_completed" | "unsuccessfully_completed" | "closed";
}
