import React from 'react'
import { HashIcon } from "lucide-react";

const CustomChannelPreview = ({ channel, setActiveChannel, activeChannel }) => {
  const isActive = activeChannel?.id === channel?.id;
  const memberCount = channel?.data?.member_count ?? channel?.state?.members?.size;
  const channelIdStr = String(channel?.data?.id || channel?.id || "");
  const isDM = memberCount === 2 && channelIdStr.includes("user_");
  if (isDM) return null;

  const unreadCount = typeof channel?.countUnread === "function" ? channel.countUnread() : 0;
 return (
    <button
      onClick={() => setActiveChannel(channel)}
      className={`str-chat__channel-preview-messenger transition-colors flex items-center w-full text-left px-4 py-2 rounded-lg mb-1 font-medium hover:bg-blue-50/80 min-h-9 ${
        isActive
          ? "!bg-black/20 !hover:bg-black/20 border-l-8 border-purple-500 shadow-lg text-blue-900"
          : ""
      }`}
    >
      <HashIcon className="w-4 h-4 text-[#9b9b9b] mr-2" />
      <span className="str-chat__channel-preview-messenger-name flex-1">{channel?.data?.name || channelIdStr}</span>

      {unreadCount > 0 && (
        <span className="flex items-center justify-center ml-2 size-4 text-xs rounded-full bg-red-500 ">
          {unreadCount}
        </span>
      )}
    </button>
  );
};


export default CustomChannelPreview
