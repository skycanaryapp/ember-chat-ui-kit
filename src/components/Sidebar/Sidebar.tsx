
import { User, Plus, LogOut } from "lucide-react";
import { Conversation } from "@/types";
import { Button } from "@/components/ui/button";
import { ConversationList } from "./ConversationList";
import { useAuth } from "@/context/AuthContext";

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
  const { user } = useAuth();
  
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
        <div className="flex items-center justify-between mb-2 px-2">
          <div className="flex items-center">
            <div className="bg-sidebar-accent rounded-full p-1 mr-2">
              <User size={16} />
            </div>
            <div className="text-sm font-medium truncate">
              {user?.email}
            </div>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={onOpenUserSettings}
        >
          <LogOut size={16} className="mr-2" />
          <span>Sign Out</span>
        </Button>
      </div>
    </aside>
  );
}
