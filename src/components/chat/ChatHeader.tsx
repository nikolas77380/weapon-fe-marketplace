"use client";

import React from "react";
import { Chat } from "@/types/chat";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreVertical,
  CheckCircle,
  XCircle,
  Lock,
  Users,
  ArrowLeft,
} from "lucide-react";
import { useTranslations } from "next-intl";

interface ChatHeaderProps {
  chat: Chat;
  onFinishChat: (
    status: "successfully_completed" | "unsuccessfully_completed" | "closed"
  ) => void;
  loading?: boolean;
  onBack: () => void;
}

const getStatusColor = (status: Chat["status"]) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800";
    case "successfully_completed":
      return "bg-blue-100 text-blue-800";
    case "unsuccessfully_completed":
      return "bg-red-100 text-red-800";
    case "closed":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Функция для получения инициалов
const getInitials = (name: string | null | undefined) => {
  if (!name) return "??";
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  chat,
  onFinishChat,
  loading = false,
  onBack,
}) => {
  const t = useTranslations("Chat");
  const isActive = chat.status === "active";
  const canFinish = isActive;

  const handleFinishChat = (
    status: "successfully_completed" | "unsuccessfully_completed" | "closed"
  ) => {
    onFinishChat(status);
  };

  return (
    <div className="border-b bg-white p-4 border-gray-200">
      <div className="flex items-center flex-wrap justify-between gap-2 sm:gap-3">
        {/* Back button (mobile only) */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="md:hidden text-gray-500 hover:text-gold-main"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-start min-[380px]:items-center flex-col min-[380px]:flex-row space-x-3 mb-2">
            <h2 className="text-lg font-semibold truncate">{chat.topic}</h2>
            <Badge className={getStatusColor(chat.status)}>
              {t(`status.${chat.status}`)}
            </Badge>
          </div>

          <div className="flex items-start min-[380px]:items-center text-sm text-gray-500 flex-col min-[380px]:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>
                  {chat.participants.length} {t("participants")}
                </span>
              </div>

              {/* Аватары участников */}
              <div className="flex -space-x-1">
                {chat.participants.slice(0, 3).map((participant) => (
                  <Avatar
                    key={participant.id}
                    className="h-6 w-6 border border-white"
                  >
                    <AvatarImage
                      src={participant.metadata?.avatar?.url}
                      alt={participant.displayName || participant.username}
                    />
                    <AvatarFallback className="bg-gray-100 text-gray-600 text-xs">
                      {getInitials(
                        participant.displayName || participant.username
                      )}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {chat.participants.length > 3 && (
                  <div className="h-6 w-6 rounded-full bg-gray-100 border border-white flex items-center justify-center">
                    <span className="text-xs text-gray-600">
                      +{chat.participants.length - 3}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center">
              <span className="mx-2 hidden min-[380px]:block">•</span>
              <span>
                {chat.participants.map((p) => p.displayName).join(", ")}
              </span>
            </div>
          </div>
        </div>
        {canFinish && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                disabled={loading}
                className="border-gray-300"
              >
                <MoreVertical className="h-4 w-4 text-gold-main" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="border-gray-200">
              <DropdownMenuItem
                onClick={() => handleFinishChat("successfully_completed")}
                className="text-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {t("actions.finishSuccessfully")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleFinishChat("unsuccessfully_completed")}
                className="text-red-700"
              >
                <XCircle className="h-4 w-4 mr-2" />
                {t("actions.finishUnsuccessfully")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleFinishChat("closed")}
                className="text-gray-700"
              >
                <Lock className="h-4 w-4 mr-2" />
                {t("actions.closeChat")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};
