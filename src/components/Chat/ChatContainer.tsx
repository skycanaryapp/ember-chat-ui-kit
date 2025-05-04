
import { useState } from "react";
import { Conversation, Message } from "@/types";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { useIsMobile } from "@/hooks/use-mobile";

interface ChatContainerProps {
  conversation: Conversation | null;
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  onEditTitle: () => void;
  onToggleSidebar: () => void;
}

export function ChatContainer({
  conversation,
  messages,
  isLoading,
  onSendMessage,
  onEditTitle,
  onToggleSidebar
}: ChatContainerProps) {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <ChatHeader
        conversation={conversation}
        onEditTitle={onEditTitle}
        onMobileMenuToggle={onToggleSidebar}
        isMobile={isMobile}
      />
      
      <MessageList messages={messages} isLoading={isLoading} />
      
      <MessageInput
        onSendMessage={onSendMessage}
        isDisabled={isLoading || !conversation}
      />
    </div>
  );
}
