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
  const pointerDownOnSendRef = useRef(false);
  const lastSendTapRef = useRef(0);

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

  const triggerSend = useCallback(() => {
    if (isSendingRef.current || !message.trim() || !canSend) {
      return;
    }

    isSendingRef.current = true;

    onSend();

    setTimeout(() => {
      isSendingRef.current = false;
    }, 300);
  }, [onSend, message, canSend]);

  const handleSendPress = useCallback(
    (
      e:
        | React.PointerEvent<HTMLElement>
        | React.MouseEvent<HTMLElement>
        | React.TouchEvent<HTMLElement>
    ) => {
      // Не даём кнопке перехватить фокус, чтобы клавиатура не закрывалась
      e.preventDefault();
      e.stopPropagation();
      pointerDownOnSendRef.current = true;
      lastSendTapRef.current = Date.now();
      textareaRef.current?.focus();
      triggerSend();
      // Дополнительно восстанавливаем фокус после возможного reflow/очистки textarea
      requestAnimationFrame(() =>
        textareaRef.current?.focus({ preventScroll: true })
      );
      setTimeout(() => textareaRef.current?.focus({ preventScroll: true }), 60);

      // Сбрасываем флаг чуть позже, чтобы blur, вызванный жестом, игнорировался
      setTimeout(() => {
        pointerDownOnSendRef.current = false;
      }, 500);
    },
    [triggerSend]
  );

  const handleTextareaBlur = useCallback(
    (e: React.FocusEvent<HTMLTextAreaElement>) => {
      // На мобильных не даём blur закрыть клавиатуру
      if (isMobile) {
        textareaRef.current?.focus({ preventScroll: true });
        return;
      }

      // Не вызываем blur, если отправка в процессе
      if (isSendingRef.current) {
        return;
      }

      // Игнорируем blur, спровоцированный нажатием на кнопку отправки
      if (
        pointerDownOnSendRef.current ||
        Date.now() - lastSendTapRef.current < 400
      ) {
        textareaRef.current?.focus({ preventScroll: true });
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
    [onBlur, isMobile]
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
          asChild
          disabled={!message.trim() || !canSend}
          type="button"
          tabIndex={-1} // не перехватываем фокус, чтобы не закрывать клавиатуру
          className="bg-gold-main hover:bg-gold-dark disabled:opacity-60 self-stretch"
        >
          <div
            role="button"
            tabIndex={-1}
            onPointerDown={handleSendPress}
            onMouseDown={handleSendPress}
            onTouchStart={handleSendPress}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <Send className="h-4 w-4" />
          </div>
        </Button>
      </div>
    </div>
  );
};
