
import { User, Plus, LogOut } from "lucide-react";
import { Conversation } from "@/types";
import { Button } from "@/components/ui/button";
import { ConversationList } from "./ConversationList";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";

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
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", bounce: 0, duration: 0.6 }}
      className="w-full max-w-[300px] h-full flex flex-col bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800"
    >
      <div className="p-4">
        <Button 
          onClick={onNewConversation}
          className="w-full justify-start bg-gradient-to-r from-[#4776E6] to-[#8E54E9] hover:shadow-md transition-all duration-300 text-white font-medium"
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
      
      <div className="p-3 border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between mb-2 px-2 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-800">
          <div className="flex items-center overflow-hidden">
            <div className="bg-gradient-to-r from-[#4776E6] to-[#8E54E9] rounded-full p-2 mr-2 flex-shrink-0">
              <User size={16} className="text-white" />
            </div>
            <div className="text-sm font-medium truncate">
              {user?.email}
            </div>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full justify-start mt-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          onClick={onOpenUserSettings}
        >
          <LogOut size={16} className="mr-2" />
          <span>Sign Out</span>
        </Button>
      </div>
    </motion.aside>
  );
}
