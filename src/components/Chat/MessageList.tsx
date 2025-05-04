
import { useEffect, useRef } from "react";
import { Message } from "@/types";
import { MessageBubble } from "./MessageBubble";

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
    <div className="flex-1 overflow-y-auto py-4 px-4">
      {messages.length === 0 && !isLoading ? (
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Start a conversation</h3>
            <p className="text-muted-foreground text-sm max-w-md">
              Send a message to start chatting with the AI assistant.
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
              <div className="chat-bubble-ai">
                <div className="typing-indicator">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
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
