
import { Conversation } from "@/types";
import { Button } from "@/components/ui/button";
import { Edit, Menu, X } from "lucide-react";
import { motion } from "framer-motion";

interface ChatHeaderProps {
  conversation: Conversation | null;
  onEditTitle: () => void;
  onMobileMenuToggle: () => void;
  isMobile: boolean;
}

export function ChatHeader({ conversation, onEditTitle, onMobileMenuToggle, isMobile }: ChatHeaderProps) {
  if (!conversation) {
    return null;
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-10 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md"
    >
      <div className="px-4 py-3 flex items-center justify-between">
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onMobileMenuToggle}
            className="mr-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <Menu size={20} />
          </Button>
        )}

        <motion.h2 
          layoutId={`conversation-title-${conversation.id}`}
          className="text-lg font-medium truncate flex-1 px-1"
        >
          {conversation.title || "New Conversation"}
        </motion.h2>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onEditTitle}
          className="h-8 w-8 hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          <Edit size={16} />
        </Button>
      </div>
    </motion.div>
  );
}
