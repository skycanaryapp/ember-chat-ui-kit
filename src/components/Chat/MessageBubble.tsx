
import { useState } from "react";
import { Message } from "@/types";
import { formatDate } from "@/utils/helpers";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isUserMessage = message.role === 'user';
  
  return (
    <div
      className={cn(
        "group mb-4 flex",
        isUserMessage ? "justify-end" : "justify-start"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-xl p-4 shadow-sm animate-slide-in",
          isUserMessage 
            ? "chat-bubble-user text-white" 
            : "chat-bubble-ai border border-gray-200"
        )}
      >
        <div className="whitespace-pre-wrap">{message.content}</div>
        <div 
          className={cn(
            "text-xs mt-1 text-right opacity-0 group-hover:opacity-100 transition-opacity", 
            isUserMessage ? "text-white/70" : "text-gray-400"
          )}
        >
          {formatDate(message.createdAt)}
        </div>
      </div>
    </div>
  );
}
