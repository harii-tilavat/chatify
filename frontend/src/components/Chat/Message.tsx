import React from "react";
import { UserModel } from "../../models/authModel";
import { formateDate } from "../../utils/helpers";
import Avatar from "../Avatar";
import reactSvg from "../../assets/react.svg";
import clsx from "clsx";
import { MessageModel } from "../../models/messageModel";
import { useAuthStore } from "../../store/useAuthStore";

interface MessageProps {
  user: UserModel;
  isMyMessage: boolean;
  message: MessageModel;
}
export const Message: React.FC<MessageProps> = ({ user, message, isMyMessage = false }) => {
  const { currentUser } = useAuthStore();
  return (
    <>
      {message.image && (
        <div className={clsx("chat", isMyMessage ? "chat-end" : "chat-start")}>
          <div className="chat-image avatar">
            {/* Avtar */}
            <Avatar user={user} />
          </div>
          <div className="chat-header mb-1">
            <time className="text-xs opacity-50 ml-1">{formateDate(new Date())}</time>
          </div>
          <div className="chat-bubble flex flex-col">
            {/* If there is an image  */}

            <img src={reactSvg} alt="Attachment" className="sm:max-w-[200px] rounded-md mb-2" />
            {/* If there is text  */}
            {message.text && <p>{message.text}</p>}
          </div>
        </div>
      )}
      {!message.image && (
        <div className={clsx("chat", isMyMessage ? "chat-end" : "chat-start")}>
          <div className="chat-image avatar">
            {/* Avtar */}
            <Avatar user={isMyMessage ? currentUser! : user} />
          </div>
          <div className="chat-header mb-1">
            <time className="text-xs opacity-50 ml-1">{formateDate(new Date())}</time>
          </div>
          <div className="chat-bubble flex flex-col">
            {/* If there is text  */}
            {message.text && <p>{message.text}</p>}
          </div>
        </div>
      )}
    </>
  );
};
