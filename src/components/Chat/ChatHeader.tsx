
import { Conversation } from "@/types";
import { Button } from "@/components/ui/button";
import { Edit, X } from "lucide-react";

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
    <div className="border-b p-3 flex items-center justify-between">
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onMobileMenuToggle}
          className="mr-2"
        >
          <X size={20} />
        </Button>
      )}

      <h2 className="text-lg font-medium truncate flex-1">
        {conversation.title || "New Conversation"}
      </h2>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={onEditTitle}
        className="h-8 w-8"
      >
        <Edit size={16} />
      </Button>
    </div>
  );
}
