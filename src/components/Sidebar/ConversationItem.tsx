
import { MessageSquare, Edit, Trash2 } from "lucide-react";
import { Conversation } from "@/types";
import { truncateText, formatDate } from "@/utils/helpers";
import { Button } from "@/components/ui/button";

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
    <div
      className={`flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors mb-1 ${
        isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "hover:bg-sidebar-accent/50"
      }`}
      onClick={() => onSelect(conversation.id)}
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <div className={`p-2 rounded-md ${isActive ? "bg-sidebar-primary text-primary-foreground" : "bg-muted"}`}>
          <MessageSquare size={16} />
        </div>
        <div className="overflow-hidden">
          <p className="font-medium text-sm">{truncateText(conversation.title, 25)}</p>
          <p className="text-xs text-muted-foreground">
            {formatDate(conversation.createdAt)}
          </p>
        </div>
      </div>
      {isActive && (
        <div className="flex gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7" 
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
            className="h-7 w-7 text-destructive hover:text-destructive" 
            onClick={(e) => {
              e.stopPropagation();
              onDelete(conversation.id);
            }}
          >
            <Trash2 size={14} />
          </Button>
        </div>
      )}
    </div>
  );
}
