
// Message Types
export type MessageRole = 'user' | 'ai';

export interface Message {
  id: string;
  conversation_id?: string;
  conversationId?: string;
  role: MessageRole;
  content: string;
  created_at?: string;
  createdAt: Date;
}

// Conversation Types
export interface Conversation {
  id: string;
  user_id?: string;
  userId?: string;
  title: string;
  created_at?: string;
  createdAt?: Date;
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
