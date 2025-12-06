import React, { useCallback, useState, useEffect, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface MessageComposerProps {
  message: string;
  placeholder: string;
  onChange: (value: string) => void;
  onSend: () => void;
  canSend: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
}

export const MessageComposer: React.FC<MessageComposerProps> = ({
  message,
  placeholder,
  onChange,
  onSend,
  canSend,
  onFocus,
  onBlur,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isSendingRef = useRef(false);

  // Определяем тип устройства
  useEffect(() => {
    const checkIfMobile = () => {
      // Проверяем ширину экрана (мобильные устройства обычно < 768px)
      const isMobileWidth = window.innerWidth < 768;
      // Проверяем touch support
      const isTouchDevice =
        "ontouchstart" in window || navigator.maxTouchPoints > 0;
      setIsMobile(isMobileWidth && isTouchDevice);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => window.removeEventListener("resize", checkIfMobile);
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

  const handleSendClick = useCallback(
    (
      e:
        | React.MouseEvent<HTMLButtonElement>
        | React.TouchEvent<HTMLButtonElement>
    ) => {
      e.preventDefault();
      e.stopPropagation();

      if (isSendingRef.current || !message.trim() || !canSend) {
        return;
      }

      isSendingRef.current = true;

      // Вызываем отправку сразу
      onSend();

      // Сбрасываем флаг после небольшой задержки
      setTimeout(() => {
        isSendingRef.current = false;
      }, 300);
    },
    [onSend, message, canSend]
  );

  const handleTextareaBlur = useCallback(
    (e: React.FocusEvent<HTMLTextAreaElement>) => {
      // Не вызываем blur, если отправка в процессе
      if (isSendingRef.current) {
        return;
      }

      // Небольшая задержка для blur, чтобы дать время onClick сработать
      setTimeout(() => {
        if (
          !isSendingRef.current &&
          document.activeElement !== textareaRef.current
        ) {
          onBlur?.();
        }
      }, 150);
    },
    [onBlur]
  );

  return (
    <div className="p-4 border-t border-gray-200 bg-white">
      <div className="flex gap-2 items-end">
        <Textarea
          ref={textareaRef}
          placeholder={placeholder}
          value={message}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={onFocus}
          onBlur={handleTextareaBlur}
          className="flex-1 min-h-[44px] max-h-40 resize-none"
          rows={1}
        />
        <Button
          onMouseDown={handleSendClick}
          onTouchStart={handleSendClick}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          disabled={!message.trim() || !canSend}
          type="button"
          className="bg-gold-main hover:bg-gold-dark disabled:opacity-60 self-stretch"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
