
import { useState, useRef, useEffect, FormEvent, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isDisabled: boolean;
}

export function MessageInput({ onSendMessage, isDisabled }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "60px";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = scrollHeight + "px";
    }
  }, [message]);
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isDisabled) {
      onSendMessage(message);
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "60px";
      }
    }
  };
  
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="sticky bottom-0 bg-background/80 backdrop-blur-md"
    >
      <form onSubmit={handleSubmit} className="px-4 py-4">
        <div className={cn(
          "relative rounded-xl overflow-hidden transition-all border shadow-lg focus-within:shadow-xl",
          isDisabled ? "opacity-60" : "",
          "border-zinc-300 dark:border-zinc-700"
        )}>
          <div className="flex items-end bg-white dark:bg-zinc-800 rounded-xl">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isDisabled ? "Please wait..." : "Type your message..."}
              className="resize-none py-4 px-4 w-full focus:outline-none bg-transparent min-h-[60px] max-h-[160px] text-sm"
              rows={1}
              disabled={isDisabled}
            />
            <div className="p-2">
              <Button
                type="submit"
                size="sm"
                disabled={!message.trim() || isDisabled}
                className={cn(
                  "h-10 w-10 rounded-full bg-gradient-to-r from-[#4776E6] to-[#8E54E9] text-white transition-all",
                  (!message.trim() || isDisabled) ? "opacity-50" : "hover:shadow-md"
                )}
              >
                <Send size={18} />
              </Button>
            </div>
          </div>
        </div>
        <div className="text-xs text-center mt-2 text-zinc-400 dark:text-zinc-500">
          Press Enter to send, Shift+Enter for new line
        </div>
      </form>
    </motion.div>
  );
}
