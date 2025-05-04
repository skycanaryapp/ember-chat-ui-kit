
// Message Types
export type MessageRole = 'user' | 'ai';

export interface Message {
  id: string;
  conversationId: string;
  role: MessageRole;
  content: string;
  createdAt: Date;
}

// Conversation Types
export interface Conversation {
  id: string;
  userId: string;
  title: string;
  createdAt: Date;
  messages?: Message[];
}

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

// AI Response Types
export interface AIResponse {
  message: string;
  error?: string;
}

// UI State Types
export interface ChatState {
  conversations: Conversation[];
  currentConversationId: string | null;
  isLoading: boolean;
  error: string | null;
}
