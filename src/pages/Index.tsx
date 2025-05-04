
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import { ChatContainer } from "@/components/Chat/ChatContainer";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { Conversation, Message } from "@/types";
import { generateUUID, generateTitle } from "@/utils/helpers";
import { sendChatMessage } from "@/services/n8nService";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [showSidebar, setShowSidebar] = useState(!isMobile);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Create initial conversation
  useEffect(() => {
    // If no conversations exist, create a new one
    if (conversations.length === 0) {
      handleNewConversation();
    }
  }, []);

  // Load messages for current conversation
  useEffect(() => {
    if (currentConversationId) {
      const currentConversation = conversations.find(c => c.id === currentConversationId);
      if (currentConversation && currentConversation.messages) {
        setMessages(currentConversation.messages);
      } else {
        setMessages([]);
      }
    }
  }, [currentConversationId, conversations]);

  // Handle sidebar visibility on mobile
  useEffect(() => {
    setShowSidebar(!isMobile);
  }, [isMobile]);

  const handleNewConversation = () => {
    const newId = generateUUID();
    const newConversation: Conversation = {
      id: newId,
      userId: "user-1", // Placeholder user ID
      title: "New Conversation",
      createdAt: new Date(),
      messages: [],
    };
    
    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversationId(newId);
    setMessages([]);
    
    if (isMobile) {
      setShowSidebar(false);
    }
  };

  const handleSelectConversation = (id: string) => {
    setCurrentConversationId(id);
    if (isMobile) {
      setShowSidebar(false);
    }
  };

  const handleDeleteConversation = (id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    
    // If current conversation was deleted, select the first available one
    if (id === currentConversationId) {
      const remaining = conversations.filter(c => c.id !== id);
      setCurrentConversationId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const handleEditConversation = (id: string) => {
    const conversation = conversations.find(c => c.id === id);
    if (conversation) {
      // In a real app, this would show a modal to edit the title
      const newTitle = prompt("Enter new conversation title:", conversation.title);
      if (newTitle) {
        setConversations(prev => 
          prev.map(c => c.id === id ? { ...c, title: newTitle } : c)
        );
      }
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!currentConversationId || !content.trim()) return;
    
    // Create user message
    const userMessage: Message = {
      id: generateUUID(),
      conversationId: currentConversationId,
      role: 'user',
      content: content.trim(),
      createdAt: new Date(),
    };
    
    // Update UI immediately with user message
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    
    // Update conversation with new messages
    setConversations(prev => 
      prev.map(c => {
        if (c.id === currentConversationId) {
          // If this is the first message, generate a title from it
          const title = c.title === "New Conversation" ? generateTitle(content) : c.title;
          return { 
            ...c, 
            messages: [...updatedMessages],
            title
          };
        }
        return c;
      })
    );
    
    // Generate AI response
    setIsLoading(true);
    try {
      const aiResponse = await sendChatMessage(
        content, 
        currentConversationId,
        "user-1" // Placeholder user ID
      );
      
      // Create AI message
      const aiMessage: Message = {
        id: generateUUID(),
        conversationId: currentConversationId,
        role: 'ai',
        content: aiResponse,
        createdAt: new Date(),
      };
      
      // Update messages with AI response
      const withAiResponse = [...updatedMessages, aiMessage];
      setMessages(withAiResponse);
      
      // Update conversation with AI response
      setConversations(prev => 
        prev.map(c => {
          if (c.id === currentConversationId) {
            return { 
              ...c, 
              messages: withAiResponse
            };
          }
          return c;
        })
      );
    } catch (error) {
      console.error("Failed to get AI response:", error);
      toast({
        title: "Error",
        description: "Failed to get a response from AI. Please try again.",
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
    // In a real app, this would open user settings
    toast({
      title: "User Settings",
      description: "User settings functionality will be implemented soon.",
    });
  };

  const handleEditTitle = () => {
    if (!currentConversationId) return;
    
    const conversation = conversations.find(c => c.id === currentConversationId);
    if (conversation) {
      const newTitle = prompt("Enter new conversation title:", conversation.title);
      if (newTitle) {
        setConversations(prev => 
          prev.map(c => c.id === currentConversationId ? { ...c, title: newTitle } : c)
        );
      }
    }
  };

  // Find current conversation
  const currentConversation = currentConversationId 
    ? conversations.find(c => c.id === currentConversationId) || null 
    : null;

  return (
    <div className="h-full flex">
      {/* Sidebar for Desktop or when shown on mobile */}
      {showSidebar && (
        <div className={`${isMobile ? 'absolute z-10 h-full bg-background' : ''}`}>
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
