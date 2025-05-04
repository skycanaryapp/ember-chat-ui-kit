
import { Message } from "@/types";
import { formatDate } from "@/utils/helpers";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";
  
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4 animate-slide-in`}>
      <div className={`max-w-[85%] ${isUser ? "chat-bubble-user" : "chat-bubble-ai"}`}>
        <div className="prose prose-sm max-w-none">
          {message.content}
        </div>
        <div className={`text-xs text-muted-foreground mt-1 ${isUser ? "text-right" : "text-left"}`}>
          {formatDate(message.createdAt)}
        </div>
      </div>
    </div>
  );
}
