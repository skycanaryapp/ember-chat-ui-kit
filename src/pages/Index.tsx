
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import { ChatContainer } from "@/components/Chat/ChatContainer";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { Conversation, Message } from "@/types";
import { generateUUID, generateTitle } from "@/utils/helpers";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { 
  getConversations, 
  getMessages, 
  createConversation, 
  updateConversationTitle,
  deleteConversation, 
  createMessage,
  subscribeToConversations,
  subscribeToMessages
} from "@/services/supabaseService";
import { sendChatMessage } from "@/services/n8nService";

const Index = () => {
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const isMobile = useIsMobile();
  const [showSidebar, setShowSidebar] = useState(!isMobile);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Load conversations
  useEffect(() => {
    const loadConversations = async () => {
      try {
        const conversationsData = await getConversations();
        setConversations(conversationsData);
        
        // If there are conversations, select the first one
        if (conversationsData.length > 0 && !currentConversationId) {
          setCurrentConversationId(conversationsData[0].id);
        } else if (conversationsData.length === 0) {
          // If no conversations exist, create a new one
          handleNewConversation();
        }
        
        setIsInitialLoad(false);
      } catch (error) {
        console.error("Failed to load conversations:", error);
        toast({
          title: "Error",
          description: "Failed to load conversations. Please try again.",
          variant: "destructive"
        });
        setIsInitialLoad(false);
      }
    };

    if (user) {
      loadConversations();
    }
  }, [user]);

  // Subscribe to conversations changes
  useEffect(() => {
    if (!user) return;

    const subscription = subscribeToConversations((payload) => {
      const { eventType, new: newRecord, old: oldRecord } = payload;

      if (eventType === 'INSERT') {
        setConversations(prev => [newRecord, ...prev]);
      } else if (eventType === 'UPDATE') {
        setConversations(prev => 
          prev.map(c => c.id === newRecord.id ? { ...c, ...newRecord } : c)
        );
      } else if (eventType === 'DELETE') {
        setConversations(prev => prev.filter(c => c.id !== oldRecord.id));
        
        if (currentConversationId === oldRecord.id) {
          const remaining = conversations.filter(c => c.id !== oldRecord.id);
          setCurrentConversationId(remaining.length > 0 ? remaining[0].id : null);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [user, conversations, currentConversationId]);

  // Load messages for current conversation
  useEffect(() => {
    const loadMessages = async () => {
      if (!currentConversationId) return;

      try {
        const messagesData = await getMessages(currentConversationId);
        setMessages(messagesData);
      } catch (error) {
        console.error("Failed to load messages:", error);
        toast({
          title: "Error",
          description: "Failed to load messages. Please try again.",
          variant: "destructive"
        });
      }
    };

    loadMessages();

    // Subscribe to messages changes
    if (!currentConversationId) return;

    const subscription = subscribeToMessages(currentConversationId, (payload) => {
      const { eventType, new: newRecord } = payload;

      if (eventType === 'INSERT') {
        setMessages(prev => [...prev, {
          ...newRecord,
          createdAt: new Date(newRecord.created_at)
        }]);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [currentConversationId]);

  // Handle sidebar visibility on mobile
  useEffect(() => {
    setShowSidebar(!isMobile);
  }, [isMobile]);

  const handleNewConversation = async () => {
    try {
      const newConversation = await createConversation("New Conversation");
      setConversations(prev => [newConversation, ...prev]);
      setCurrentConversationId(newConversation.id);
      setMessages([]);
      
      if (isMobile) {
        setShowSidebar(false);
      }
    } catch (error) {
      console.error("Failed to create conversation:", error);
      toast({
        title: "Error",
        description: "Failed to create new conversation. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSelectConversation = (id: string) => {
    setCurrentConversationId(id);
    if (isMobile) {
      setShowSidebar(false);
    }
  };

  const handleDeleteConversation = async (id: string) => {
    try {
      await deleteConversation(id);
      // State will be updated by the subscription
    } catch (error) {
      console.error("Failed to delete conversation:", error);
      toast({
        title: "Error",
        description: "Failed to delete conversation. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleEditConversation = async (id: string) => {
    const conversation = conversations.find(c => c.id === id);
    if (conversation) {
      const newTitle = prompt("Enter new conversation title:", conversation.title);
      if (newTitle && newTitle !== conversation.title) {
        try {
          await updateConversationTitle(id, newTitle);
          // State will be updated by the subscription
        } catch (error) {
          console.error("Failed to update conversation title:", error);
          toast({
            title: "Error",
            description: "Failed to update conversation title. Please try again.",
            variant: "destructive"
          });
        }
      }
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!currentConversationId || !content.trim()) return;

    try {
      // Create user message
      const userMessage = await createMessage(
        currentConversationId,
        content.trim(),
        "user"
      );

      // If this is the first message, update the conversation title
      const currentConversation = conversations.find(c => c.id === currentConversationId);
      if (currentConversation && currentConversation.title === "New Conversation") {
        const title = generateTitle(content);
        await updateConversationTitle(currentConversationId, title);
      }

      // Generate AI response
      setIsLoading(true);
      const aiResponse = await sendChatMessage(
        content,
        currentConversationId,
        user?.id
      );

      // Create AI message
      await createMessage(
        currentConversationId,
        aiResponse,
        "ai"
      );
    } catch (error: any) {
      console.error("Failed to process message:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to process message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const handleOpenUserSettings = () => {
    // You can implement user settings or use this for sign out
    const confirmSignOut = window.confirm("Are you sure you want to sign out?");
    if (confirmSignOut) {
      signOut();
    }
  };

  const handleEditTitle = async () => {
    if (!currentConversationId) return;
    handleEditConversation(currentConversationId);
  };

  // Find current conversation
  const currentConversation = currentConversationId 
    ? conversations.find(c => c.id === currentConversationId) || null 
    : null;

  if (isInitialLoad) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex">
      {/* Sidebar for Desktop or when shown on mobile */}
      {showSidebar && (
        <div className={`${isMobile ? 'absolute z-10 h-full bg-background' : ''} h-full`}>
          <Sidebar
            conversations={conversations}
            currentConversationId={currentConversationId}
            onNewConversation={handleNewConversation}
            onSelectConversation={handleSelectConversation}
            onDeleteConversation={handleDeleteConversation}
            onEditConversation={handleEditConversation}
            onOpenUserSettings={handleOpenUserSettings}
          />
        </div>
      )}
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full">
        {/* Show menu button on mobile when sidebar is hidden */}
        {isMobile && !showSidebar && (
          <div className="p-3 border-b">
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleSidebar}
              className="flex items-center"
            >
              <MessageSquare size={16} className="mr-2" />
              <span>Conversations</span>
            </Button>
          </div>
        )}
        
        <ChatContainer
          conversation={currentConversation}
          messages={messages}
          isLoading={isLoading}
          onSendMessage={handleSendMessage}
          onEditTitle={handleEditTitle}
          onToggleSidebar={handleToggleSidebar}
        />
      </div>
    </div>
  );
};

export default Index;
