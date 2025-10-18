"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface MessageInputProps {
  onSendMessage: (text: string) => Promise<void>;
  disabled?: boolean;
  loading?: boolean;
  placeholder?: string;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  disabled = false,
  loading = false,
  placeholder,
}) => {
  const t = useTranslations("Chat");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Автоматическое изменение высоты textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim() || isSending || disabled || loading) {
      return;
    }

    const messageText = message.trim();
    setMessage("");
    setIsSending(true);

    try {
      await onSendMessage(messageText);
    } catch (error) {
      console.error("Failed to send message:", error);
      // Восстанавливаем сообщение в случае ошибки
      setMessage(messageText);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const canSend =
    message.trim().length > 0 && !isSending && !disabled && !loading;

  return (
    <form onSubmit={handleSubmit} className="border-t bg-white p-4">
      <div className="flex items-end space-x-2">
        <div className="flex-1">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder || t("messageInput.placeholder")}
            disabled={disabled || loading || isSending}
            className="min-h-[40px] max-h-[120px] resize-none"
            rows={1}
          />
        </div>
        <Button
          type="submit"
          size="sm"
          disabled={!canSend}
          className="h-10 w-10 p-0"
        >
          {isSending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>

      {disabled && (
        <p className="text-sm text-gray-500 mt-2">
          {t("messageInput.disabledMessage")}
        </p>
      )}
    </form>
  );
};
