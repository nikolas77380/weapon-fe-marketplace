"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, Search, ArrowLeft, Info, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

const mockChats = [
  {
    id: 1,
    name: "John Smith",
    lastMessage: "Thanks for the quick response!",
    time: "2 min ago",
    unread: 2,
    avatar: "/avatars/john.jpg",
    isOnline: true,
  },
  {
    id: 2,
    name: "Sarah Johnson",
    lastMessage: "When can we meet?",
    time: "1 hour ago",
    unread: 0,
    avatar: "/avatars/sarah.jpg",
    isOnline: false,
  },
];

const mockMessages = [
  {
    id: 1,
    text: "Hello! I'm interested in your product",
    sender: "user",
    time: "10:30 AM",
  },
  {
    id: 2,
    text: "Hi! Great to hear from you. What would you like to know?",
    sender: "other",
    time: "10:32 AM",
  },
];

const StylePageChat = () => {
  const [selectedChat, setSelectedChat] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState("");

  const filteredChats = mockChats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!message.trim()) return;
    console.log("Send:", message);
    setMessage("");
  };

  const handleBack = () => setSelectedChat(null);

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div
        className={cn(
          "w-full md:w-80 bg-white border-r border-gray-200 flex flex-col transition-all duration-300",
          selectedChat ? "hidden md:flex" : "flex"
        )}
      >
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900 mb-3">Messages</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-50 border-gray-200 focus:border-gold-main focus:ring-gold-main"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className={cn(
                "p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors",
                selectedChat?.id === chat.id &&
                  "bg-gold-main/10 border-l-4 border-l-gold-main"
              )}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={chat.avatar} alt={chat.name} />
                    <AvatarFallback className="bg-gold-main/20 text-gold-main font-semibold">
                      {chat.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {chat.isOnline && (
                    <div className="absolute -bottom-1 -right-1 h-3.5 w-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">
                      {chat.name}
                    </h3>
                    <span className="text-xs text-gray-500">{chat.time}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-gray-600 truncate">
                      {chat.lastMessage}
                    </p>
                    {chat.unread > 0 && (
                      <Badge className="bg-gold-main text-white text-xs px-2 py-1">
                        {chat.unread}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div
        className={cn(
          "flex-1 flex flex-col bg-white transition-all duration-300",
          !selectedChat && "hidden md:flex"
        )}
      >
        {selectedChat ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBack}
                  className="md:hidden text-gray-500 hover:text-gold-main"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>

                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={selectedChat.avatar}
                    alt={selectedChat.name}
                  />
                  <AvatarFallback className="bg-gold-main/20 text-gold-main font-semibold">
                    {selectedChat.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <h2 className="text-base font-semibold text-gray-900">
                    {selectedChat.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {selectedChat.isOnline ? "Online" : "Last seen recently"}
                  </p>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="text-gray-500 hover:text-gold-main"
              >
                <Info className="h-5 w-5" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {mockMessages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex",
                    message.sender === "user"
                      ? "justify-end"
                      : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-xs sm:max-w-sm md:max-w-md px-4 py-2 rounded-lg",
                      message.sender === "user"
                        ? "bg-gold-main text-white"
                        : "bg-white border border-gray-200 text-gray-900"
                    )}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p
                      className={cn(
                        "text-xs mt-1",
                        message.sender === "user"
                          ? "text-gold-main/80"
                          : "text-gray-500"
                      )}
                    >
                      {message.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-center space-x-2">
                <div className="flex-1 relative">
                  <Input
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="pr-12 border-gray-200 focus:border-gold-main focus:ring-gold-main"
                  />
                  <Button
                    size="icon"
                    disabled={!message.trim()}
                    onClick={handleSendMessage}
                    className={cn(
                      "absolute right-1 top-1/2 -translate-y-1/2 text-white",
                      message.trim()
                        ? "bg-gold-main hover:bg-gold-main/90"
                        : "bg-gray-300 cursor-not-allowed"
                    )}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 text-gray-400 bg-gradient-to-b from-gray-50 to-gray-100 animate-fadeIn">
            <div className="p-6 rounded-full bg-gold-main/10 mb-4">
              <MessageSquare className="h-10 w-10 text-gold-main" />
            </div>
            <h2 className="text-lg font-semibold text-gray-700">
              No chat selected
            </h2>
            <p className="text-sm text-gray-500 mt-1 text-center px-8">
              Select a conversation from the list to start chatting
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StylePageChat;
