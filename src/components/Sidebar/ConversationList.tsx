
import { useState } from "react";
import { Conversation } from "@/types";
import { ConversationItem } from "./ConversationItem";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ConversationListProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onEditConversation: (id: string) => void;
}

export function ConversationList({
  conversations,
  currentConversationId,
  onSelectConversation,
  onDeleteConversation,
  onEditConversation,
}: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = conversations.filter((conversation) =>
    conversation.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      <div className="relative mb-2">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>
      <div className="flex-1 overflow-y-auto pr-1">
        {filteredConversations.length > 0 ? (
          filteredConversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              isActive={conversation.id === currentConversationId}
              onSelect={onSelectConversation}
              onDelete={onDeleteConversation}
              onEdit={onEditConversation}
            />
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground text-sm">
            {searchQuery ? "No conversations found" : "No conversations yet"}
          </div>
        )}
      </div>
    </div>
  );
}
