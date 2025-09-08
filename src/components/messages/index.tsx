"use client";

import React, { useState } from "react";
import "@sendbird/uikit-react/dist/index.css";
import GroupChannelList from "@sendbird/uikit-react/GroupChannelList";
import GroupChannel from "@sendbird/uikit-react/GroupChannel";

const Messages = () => {
  const [currentChannel, setCurrentChannel] = useState<unknown>(null);
  const handleSelectChannel = (channel: unknown) => {
    setCurrentChannel(channel);
  };

  return (
    <div className="channel-wrap flex h-full">
      <div className="channel-list float-left">
        <GroupChannelList
          onChannelSelect={handleSelectChannel}
          onChannelCreated={() => {}}
        />
      </div>
      <div className="channel-chat w-[76%]">
        <GroupChannel
          channelUrl={(currentChannel as { url?: string })?.url ?? ""}
        />
      </div>
    </div>
  );
};

export default Messages;
