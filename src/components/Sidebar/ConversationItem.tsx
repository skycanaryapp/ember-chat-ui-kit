
import { MessageSquare, Edit, Trash2 } from "lucide-react";
import { Conversation } from "@/types";
import { truncateText, formatDate } from "@/utils/helpers";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

export function ConversationItem({
  conversation,
  isActive,
  onSelect,
  onDelete,
  onEdit,
}: ConversationItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 mb-1 ${
        isActive 
          ? "bg-zinc-100 dark:bg-zinc-800" 
          : "hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50"
      }`}
      onClick={() => onSelect(conversation.id)}
      layoutId={`conversation-${conversation.id}`}
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <div className={`p-2 rounded-full transition-colors ${isActive 
          ? "bg-gradient-to-r from-[#4776E6] to-[#8E54E9] text-white" 
          : "bg-zinc-200 dark:bg-zinc-700"
        }`}>
          <MessageSquare size={16} />
        </div>
        <div className="overflow-hidden">
          <motion.p 
            className="font-medium text-sm truncate"
            layoutId={`conversation-title-${conversation.id}`}
          >
            {truncateText(conversation.title, 25)}
          </motion.p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {formatDate(conversation.createdAt)}
          </p>
        </div>
      </div>
      
      {isActive && (
        <div className="flex gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700" 
            onClick={(e) => {
              e.stopPropagation();
              onEdit(conversation.id);
            }}
          >
            <Edit size={14} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30" 
            onClick={(e) => {
              e.stopPropagation();
              onDelete(conversation.id);
            }}
          >
            <Trash2 size={14} />
          </Button>
        </div>
      )}
    </motion.div>
  );
}
