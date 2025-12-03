import React, { useCallback, useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
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
  const [isMobile, setIsMobile] = useState(false);

  // Определяем тип устройства
  useEffect(() => {
    const checkIfMobile = () => {
      // Проверяем ширину экрана (мобильные устройства обычно < 768px)
      const isMobileWidth = window.innerWidth < 768;
      // Проверяем touch support
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsMobile(isMobileWidth && isTouchDevice);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // На мобильных устройствах Enter всегда создает новую строку
      if (isMobile) {
        return; // Не блокируем Enter на мобильных
      }

      // На десктопе: Enter отправляет, Shift+Enter создает новую строку
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        onSend();
      }
    },
    [onSend, isMobile]
  );

  return (
    <div className="p-4 border-t border-gray-200 bg-white">
      <div className="flex gap-2 items-end">
        <Textarea
          placeholder={placeholder}
          value={message}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 min-h-[44px] max-h-40 resize-none"
          rows={1}
        />
        <Button
          onClick={onSend}
          disabled={!message.trim() || !canSend}
          className="bg-gold-main hover:bg-gold-dark disabled:opacity-60 self-stretch"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
