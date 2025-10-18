"use client";

import React from "react";
import { Chat } from "@/types/chat";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, CheckCircle, XCircle, Lock, Users } from "lucide-react";
import { useTranslations } from "next-intl";

interface ChatHeaderProps {
  chat: Chat;
  onFinishChat: (
    status: "successfully_completed" | "unsuccessfully_completed" | "closed"
  ) => void;
  loading?: boolean;
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

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  chat,
  onFinishChat,
  loading = false,
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
    <div className="border-b bg-white p-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h2 className="text-lg font-semibold truncate">{chat.topic}</h2>
            <Badge className={getStatusColor(chat.status)}>
              {t(`status.${chat.status}`)}
            </Badge>
          </div>

          <div className="flex items-center text-sm text-gray-500">
            <Users className="h-4 w-4 mr-1" />
            <span>
              {chat.participants.length} {t("participants")}
            </span>
            <span className="mx-2">•</span>
            <span>
              {chat.participants.map((p) => p.displayName).join(", ")}
            </span>
          </div>
        </div>

        {canFinish && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" disabled={loading}>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
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
