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
  id: number | string; // Может быть number (старый формат) или string (UUID из message-service)
  topic: string;
  participants: User[];
  status:
    | "active"
    | "successfully_completed"
    | "unsuccessfully_completed"
    | "closed";
  messages?: Message[];
  hasUnreadMessages?: boolean; // Флаг наличия непрочитанных сообщений (deprecated, use unreadCount)
  unreadCount?: number; // Количество непрочитанных сообщений
  productId?: number; // ID продукта из контекста чата
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
  // Временные поля для загрузки данных пользователей на фронтенде
  buyer_id?: number;
  seller_id?: number;
  // Последнее сообщение в чате
  lastMessage?: {
    id: string | number;
    text: string;
    sender_id: number;
    createdAt: string;
  };
  // Пользовательские настройки чата
  isArchived?: boolean;
  isFavorite?: boolean;
}

export interface Message {
  id: number | string; // Может быть number или string (UUID)
  text: string;
  sender?: User; // Опционально для системных сообщений
  sender_id?: number; // ID отправителя для определения, является ли сообщение собственным
  chat: Chat;
  isRead?: boolean; // Прочитано ли сообщение текущим пользователем
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
