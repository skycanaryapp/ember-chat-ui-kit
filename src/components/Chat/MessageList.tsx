
import { useEffect, useRef } from "react";
import { Message } from "@/types";
import { MessageBubble } from "./MessageBubble";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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
    <div className="flex-1 overflow-y-auto py-6 px-4 md:px-6 scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700 scrollbar-track-transparent">
      {messages.length === 0 && !isLoading ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="h-full flex items-center justify-center"
        >
          <div className="text-center max-w-md mx-auto p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 backdrop-blur-sm border border-zinc-200 dark:border-zinc-700">
            <h3 className="text-2xl font-semibold mb-3 bg-gradient-to-r from-[#4776E6] to-[#8E54E9] bg-clip-text text-transparent">Start a conversation</h3>
            <p className="text-muted-foreground text-sm">
              Send a message to start chatting with the AI assistant. Your conversation will be saved automatically.
            </p>
          </div>
        </motion.div>
      ) : (
        <>
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          
          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="relative max-w-[80%] rounded-2xl p-5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-md">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-[#4776E6] animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-3 h-3 rounded-full bg-[#6E8EF2] animate-bounce" style={{ animationDelay: "200ms" }}></div>
                  <div className="w-3 h-3 rounded-full bg-[#8E54E9] animate-bounce" style={{ animationDelay: "400ms" }}></div>
                </div>
                <div className="absolute -bottom-1 -left-1 h-4 w-4 rotate-45 bg-white dark:bg-zinc-800 border-b border-l border-zinc-200 dark:border-zinc-700"></div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
}
