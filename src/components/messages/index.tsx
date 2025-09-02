"use client";

import React, { useState } from "react";
import "@sendbird/uikit-react/dist/index.css";
import GroupChannelList from "@sendbird/uikit-react/GroupChannelList";
import GroupChannel from "@sendbird/uikit-react/GroupChannel";

const Messages = () => {
  const [currentChannel, setCurrentChannel] = useState<any>(null);
  const handleSelectChannel = (channel: any) => {
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
        <GroupChannel channelUrl={currentChannel?.url ?? ""} />
      </div>
    </div>
  );
};

export default Messages;
