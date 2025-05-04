
import { useState } from "react";
import { Message } from "@/types";
import { formatDate } from "@/utils/helpers";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isUserMessage = message.role === 'user';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "group mb-4 flex",
        isUserMessage ? "justify-end" : "justify-start"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={cn(
          "relative max-w-[80%] rounded-2xl p-4 shadow-md",
          isUserMessage 
            ? "bg-gradient-to-r from-[#4776E6] to-[#8E54E9] text-white" 
            : "bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
        )}
      >
        <div className="whitespace-pre-wrap">{message.content}</div>
        <div 
          className={cn(
            "text-xs mt-2 text-right transition-opacity duration-300", 
            isHovered ? "opacity-100" : "opacity-40",
            isUserMessage ? "text-white/70" : "text-zinc-400"
          )}
        >
          {formatDate(message.createdAt)}
        </div>
        
        {/* Decorative design element */}
        <div className={cn(
          "absolute -bottom-1 h-4 w-4 rotate-45",
          isUserMessage 
            ? "-right-1 bg-[#8E54E9]" 
            : "-left-1 bg-white dark:bg-zinc-800 border-b border-r border-zinc-200 dark:border-zinc-700"
        )} />
      </div>
    </motion.div>
  );
}
