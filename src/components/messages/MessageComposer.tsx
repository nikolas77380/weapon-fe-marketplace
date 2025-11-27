import React, { useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface MessageComposerProps {
  message: string;
  placeholder: string;
  onChange: (value: string) => void;
  onSend: () => void;
  canSend: boolean;
}

export const MessageComposer: React.FC<MessageComposerProps> = ({
  message,
  placeholder,
  onChange,
  onSend,
  canSend,
}) => {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        onSend();
      }
    },
    [onSend]
  );

  return (
    <div className="p-4 border-t border-gray-200 bg-white">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder={placeholder}
          value={message}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1"
        />
        <Button
          onClick={onSend}
          disabled={!message.trim() || !canSend}
          className="bg-gold-main hover:bg-gold-dark disabled:opacity-60"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
