
import { Message, Conversation } from "@/types";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex-1 flex flex-col h-full overflow-hidden relative bg-zinc-50 dark:bg-zinc-900"
    >
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
    </motion.div>
  );
}
