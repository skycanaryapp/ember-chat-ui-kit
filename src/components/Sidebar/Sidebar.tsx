
import { User, Plus } from "lucide-react";
import { Conversation } from "@/types";
import { Button } from "@/components/ui/button";
import { ConversationList } from "./ConversationList";

interface SidebarProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onNewConversation: () => void;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onEditConversation: (id: string) => void;
  onOpenUserSettings: () => void;
}

export function Sidebar({
  conversations,
  currentConversationId,
  onNewConversation,
  onSelectConversation,
  onDeleteConversation,
  onEditConversation,
  onOpenUserSettings,
}: SidebarProps) {
  return (
    <aside className="border-r w-full max-w-[280px] h-full flex flex-col">
      <div className="p-4">
        <Button 
          onClick={onNewConversation}
          className="w-full justify-start gradient-button"
        >
          <Plus size={16} className="mr-2" />
          New Chat
        </Button>
      </div>
      
      <div className="flex-1 overflow-hidden px-3 pb-3">
        <ConversationList
          conversations={conversations}
          currentConversationId={currentConversationId}
          onSelectConversation={onSelectConversation}
          onDeleteConversation={onDeleteConversation}
          onEditConversation={onEditConversation}
        />
      </div>
      
      <div className="p-3 border-t">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={onOpenUserSettings}
        >
          <User size={16} className="mr-2" />
          <span>Profile & Settings</span>
        </Button>
      </div>
    </aside>
  );
}
