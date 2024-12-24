import React from "react";
import { UserModel } from "../../models/authModel";
import { formatTime } from "../../utils/helpers";
import Avatar from "../Avatar";
import clsx from "clsx";
import { MessageModel } from "../../models/messageModel";
import { useAuthStore } from "../../store/useAuthStore";

interface MessageProps {
  user: UserModel;
  message: MessageModel;
}
export const Message: React.FC<MessageProps> = ({ user, message }) => {
  const { currentUser } = useAuthStore();
  const isMyMessage = currentUser?.id === message.senderId;
  return (
    <div className={clsx("chat", isMyMessage ? "chat-end" : "chat-start")} id={message.id}>
      <div className="chat-image avatar">
        {/* Avtar */}
        <Avatar user={user} />
      </div>
      <div className="chat-header mb-1">
        <time className="text-xs opacity-50 ml-1">{formatTime(message.createdAt)}</time>
      </div>
      <div className="chat-bubble flex flex-col">
        {/* If there is an image  */}
        {message.image && <img src={message.image} alt="Attachment" className="sm:max-w-[200px] rounded-md my-2" />}

        {/* If there is text  */}
        {message.text && <p>{message.text}</p>}
      </div>
    </div>
  );
};
