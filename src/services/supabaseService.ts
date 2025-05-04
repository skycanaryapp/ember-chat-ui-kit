
import { supabase } from "@/integrations/supabase/client";
import { Conversation, Message, MessageRole } from "@/types";

// Conversations
export async function getConversations(): Promise<Conversation[]> {
  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching conversations:", error);
    throw error;
  }

  // Transform the data to match our application types
  return (data || []).map(conv => ({
    id: conv.id,
    userId: conv.user_id,
    title: conv.title,
    createdAt: new Date(conv.created_at)
  }));
}

export async function getConversation(id: string): Promise<Conversation | null> {
  const { data, error } = await supabase
    .from("conversations")
    .select(`
      *,
      messages:messages(*)
    `)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching conversation:", error);
    if (error.code === 'PGRST116') {
      return null; // No match found
    }
    throw error;
  }

  // Transform data to match our types
  const conversation: Conversation = {
    id: data.id,
    userId: data.user_id,
    title: data.title,
    createdAt: new Date(data.created_at),
    messages: data.messages ? data.messages.map((msg: any) => ({
      id: msg.id,
      conversationId: msg.conversation_id,
      role: msg.role as MessageRole,
      content: msg.content,
      createdAt: new Date(msg.created_at)
    })) : []
  };
  
  return conversation;
}

export async function createConversation(title: string): Promise<Conversation> {
  // Get current user ID
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");
  
  const { data, error } = await supabase
    .from("conversations")
    .insert([{ 
      title, 
      user_id: user.id 
    }])
    .select()
    .single();

  if (error) {
    console.error("Error creating conversation:", error);
    throw error;
  }

  return {
    id: data.id,
    userId: data.user_id,
    title: data.title,
    createdAt: new Date(data.created_at)
  };
}

export async function updateConversationTitle(id: string, title: string): Promise<void> {
  const { error } = await supabase
    .from("conversations")
    .update({ title })
    .eq("id", id);

  if (error) {
    console.error("Error updating conversation:", error);
    throw error;
  }
}

export async function deleteConversation(id: string): Promise<void> {
  const { error } = await supabase
    .from("conversations")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting conversation:", error);
    throw error;
  }
}

// Messages
export async function getMessages(conversationId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }

  // Transform data to match our types
  return (data || []).map(msg => ({
    id: msg.id,
    conversationId: msg.conversation_id,
    role: msg.role as MessageRole,
    content: msg.content,
    createdAt: new Date(msg.created_at)
  }));
}

export async function createMessage(
  conversationId: string,
  content: string,
  role: MessageRole
): Promise<Message> {
  const { data, error } = await supabase
    .from("messages")
    .insert([
      {
        conversation_id: conversationId,
        content,
        role
      }
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating message:", error);
    throw error;
  }

  return {
    id: data.id,
    conversationId: data.conversation_id,
    role: data.role as MessageRole,
    content: data.content,
    createdAt: new Date(data.created_at)
  };
}

// Realtime subscriptions
export function subscribeToConversations(
  onUpdate: (payload: any) => void
) {
  return supabase
    .channel("conversations-changes")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "conversations"
      },
      onUpdate
    )
    .subscribe();
}

export function subscribeToMessages(
  conversationId: string,
  onUpdate: (payload: any) => void
) {
  return supabase
    .channel(`messages-changes-${conversationId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "messages",
        filter: `conversation_id=eq.${conversationId}`
      },
      onUpdate
    )
    .subscribe();
}
