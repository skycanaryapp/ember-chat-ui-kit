
import { useState, FormEvent, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isDisabled: boolean;
}

export function MessageInput({ onSendMessage, isDisabled }: MessageInputProps) {
  const [message, setMessage] = useState("");
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isDisabled) {
      onSendMessage(message);
      setMessage("");
    }
  };
  
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="px-4 py-3 border-t">
      <div className={cn("chat-gradient-border", isDisabled && "opacity-60")}>
        <div className="flex items-end bg-background rounded-lg p-2">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isDisabled ? "Please wait..." : "Type a message..."}
            className="resize-none border-0 focus-visible:ring-0 flex-1 min-h-[60px] max-h-[120px] transition-all"
            rows={1}
            disabled={isDisabled}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!message.trim() || isDisabled}
            className={cn(
              "ml-2 gradient-button h-9 w-9 transition-all hover:opacity-90 active:scale-95", 
              (!message.trim() || isDisabled) && "opacity-50"
            )}
          >
            <Send size={18} className="text-white" />
          </Button>
        </div>
      </div>
      <div className="text-xs text-center mt-2 text-muted-foreground">
        Press Enter to send, Shift+Enter for new line
      </div>
    </form>
  );
}
