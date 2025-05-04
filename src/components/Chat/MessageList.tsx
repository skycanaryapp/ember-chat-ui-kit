
import { useEffect, useRef } from "react";
import { Message } from "@/types";
import { MessageBubble } from "./MessageBubble";
import { cn } from "@/lib/utils";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  return (
    <div className="flex-1 overflow-y-auto py-6 px-4 md:px-6">
      {messages.length === 0 && !isLoading ? (
        <div className="h-full flex items-center justify-center">
          <div className="text-center max-w-md mx-auto">
            <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-[#FF7E5F] to-[#FEB47B] bg-clip-text text-transparent">Start a conversation</h3>
            <p className="text-muted-foreground text-sm">
              Send a message to start chatting with the AI assistant. Your conversation will be saved automatically.
            </p>
          </div>
        </div>
      ) : (
        <>
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          
          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="chat-bubble-ai rounded-xl p-4 border border-gray-200 shadow-sm">
                <div className="typing-indicator">
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
}
