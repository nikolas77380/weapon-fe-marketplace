export interface User {
  id: number;
  username: string;
  email: string;
  displayName: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: number;
  text: string;
  sender: User;
  chat: Chat;
  isRead: boolean;
  readBy: User[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateChatRequest {
  topic: string;
  participantIds: number[];
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
