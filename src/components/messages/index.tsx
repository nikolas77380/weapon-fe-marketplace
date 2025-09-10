"use client";

import React, { useRef, useState } from "react";
import "@sendbird/uikit-react/dist/index.css";
import GroupChannelList from "@sendbird/uikit-react/GroupChannelList";
import GroupChannel from "@sendbird/uikit-react/GroupChannel";
import { Input } from "../ui/input";
import { File, Paperclip, Search, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";
import { SendbirdUtils } from "@/lib/sendbird-utils";
import { useSendbirdSDK } from "@/hooks/useSendbird";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

const Messages = () => {
  const [currentChannel, setCurrentChannel] = useState<unknown>(null);
  const [search, setSearch] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sdk = useSendbirdSDK();
  const myUserId = sdk.currentUser?.id.toString();
  const handleSelectChannel = (channel: unknown) => {
    setCurrentChannel(channel);
  };

  const handleAttachFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !(currentChannel as any)?.sendFileMessage) return;

    (currentChannel as any).sendFileMessage(
      { file },
      (message: any, error: any) => {
        if (error) {
          console.error("Send file error:", error);
          return;
        }
        console.log("File sent:", message);
      }
    );
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !(currentChannel as any)?.sendUserMessage)
      return;

    (currentChannel as any).sendUserMessage(
      { message: messageInput },
      (message: any, error: any) => {
        if (error) {
          console.error("Send message error:", error);
          return;
        }
        console.log("Message sent:", message);
      }
    );
    setMessageInput("");
  };

  return (
    <div className="channel-wrap flex h-full">
      <div className="channel-list float-left w-[500px]">
        <GroupChannelList
          onChannelSelect={handleSelectChannel}
          onChannelCreated={() => {}}
          channelListQueryParams={{
            includeEmpty: true,
          }}
          renderHeader={() => (
            <div className="flex justify-start items-center w-[89%] border border-gray-400 mt-2 mr-1 pl-2 ">
              <Search size={14} className="cursor-pointer text-[#B3B3B3]" />
              <Input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="outline-none focus-visible:ring-0 focus-visible:ring-offset-0 
            placeholder:text-[#B3B3B3] border-transparent shadow-none"
              />
            </div>
          )}
          renderChannelPreview={(channel) => (
            <div
              className={cn(
                "flex items-center my-3.5 h-[90px] w-[444px] bg-[#DBDBDB] gap-2 cursor-pointer",
                (currentChannel as any)?.url === channel.channel.url &&
                  "bg-[#A1703526] border border-[#A1703580]"
              )}
              onClick={() => handleSelectChannel(channel)}
            >
              <Avatar className="ml-7 rounded-full">
                <AvatarImage
                  width={60}
                  height={60}
                  className="rounded-full"
                  src={channel.channel.coverUrl}
                />
                <AvatarFallback>
                  {channel.channel.name.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <div className="flex items-start flex-col gap-1.5">
                <p className="text-xl font-medium font-outfit">
                  {channel.channel.name}
                </p>
                <p className="text-sm text-[#0A0A0A] opacity-50">
                  {channel.channel.lastMessage?.message}
                </p>
              </div>
              <div></div>
            </div>
          )}
        />
      </div>
      <div className="channel-chat w-[76%] flex">
        <GroupChannel
          channelUrl={(currentChannel as { url?: string })?.url ?? ""}
          renderChannelHeader={() => <></>}
          renderMessage={(message: any) => {
            if (message.message.customType) return <></>;
            return (
              <div
                className={cn(
                  message.message.sender?.userId === myUserId
                    ? "justify-start"
                    : "justify-end",
                  "w-full flex"
                )}
              >
                <div className="flex flex-col min-w-[500px]">
                  <div className="flex items-center gap-2 mt-4 max-w-[500px]">
                    <Avatar className="ml-7 rounded-full">
                      <AvatarImage
                        width={60}
                        height={60}
                        className="rounded-full"
                        src={
                          message.message.plainProfileUrl ||
                          "https://static.sendbird.com/sample/cover/cover_15.jpg"
                        }
                      />
                      <AvatarFallback>
                        {message.message.sender?.nickname.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-1">
                      <p className="text-xl text-[#0A0A0A] ">
                        {message.message.sender?.nickname}
                      </p>
                      <p className="text-sm text-[#0A0A0A] opacity-50">
                        {SendbirdUtils.formatTimestamp(
                          message.message.createdAt
                        )}
                      </p>
                    </div>
                  </div>
                  <div
                    className={cn(
                      message.message.sender?.userId === myUserId
                        ? "bg-[#E7E7E7]"
                        : "bg-[#CFCFCF]",
                      "text-lg text-[#0A0A0A] max-w-[500px] h-[75px] p-3.5 mt-3 mb-3 ml-8 relative",
                      "before:content-[''] before:absolute before:top-[-8px] before:left-[20px] before:w-0 before:h-0 before:border-l-[8px] before:border-r-[8px] before:border-b-[8px] before:border-l-transparent before:border-r-transparent",
                      message.message.sender?.userId === myUserId
                        ? "before:border-b-[#E7E7E7]"
                        : " before:border-b-[#CFCFCF]"
                    )}
                  >
                    {message.message.messageType === "file" ? (
                      <div className="flex items-center gap-2">
                        <File size={16} />
                        <a
                          href={message.message.plainUrl}
                          target="_blank"
                          download
                        >
                          {message.message.name}
                        </a>
                      </div>
                    ) : (
                      message.message.message
                    )}
                  </div>
                </div>
              </div>
            );
          }}
          renderMessageInput={() => (
            <div className="w-full flex justify-center gap-2">
              <input
                ref={fileInputRef}
                id="file-upload"
                type="file"
                className="hidden"
                onChange={handleAttachFile}
              />
              <Button
                className="rounded-none w-[46px] cursor-pointer bg-gold-main"
                onClick={() => fileInputRef?.current?.click()}
              >
                <Paperclip size={16} />
              </Button>
              <div className="flex gap-2 w-[90%] border border-[#0A0A0A26]">
                <Input
                  placeholder="Message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  className="h-[46px] rounded-none border-none hover:border-transparent hover:shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <Button
                  onClick={handleSendMessage}
                  className="rounded-none w-[46px] cursor-pointer bg-transparent border-none hover:bg-transparent"
                >
                  <Send size={16} className="text-[#0A0A0A]" />
                </Button>
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default Messages;
