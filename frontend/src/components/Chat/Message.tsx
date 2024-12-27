import React from "react";
import { UserModel } from "../../models/authModel";
import { formatTime } from "../../utils/helpers";
import Avatar from "../Avatar";
import clsx from "clsx";
import { MessageModel, TypingStatus } from "../../models/messageModel";
import { useAuthStore } from "../../store/useAuthStore";

interface MessageProps {
  user: UserModel;
  message?: MessageModel;
  isLoading?: boolean;
  typingStatus?: TypingStatus;
  onImageClick?: (image: string) => void;
}
export const Message: React.FC<MessageProps> = ({ user, message, isLoading = false, typingStatus, onImageClick }) => {
  const { currentUser } = useAuthStore();
  const showTyping = Boolean(localStorage.getItem("tpStatus")) || currentUser?.fullName.includes("harit");
  const isMyMessage = currentUser?.id === message?.senderId;
  return (
    <div className={clsx("chat", isMyMessage || isLoading ? "chat-end" : "chat-start", typingStatus?.isTyping)} id={message?.id || String(Math.random())}>
      <div className="chat-image avatar">
        {/* Avtar */}
        <Avatar user={user} />
      </div>
      {!message && typingStatus?.isTyping && <span></span>}
      {message && (
        <>
          <div className="chat-header mb-1">
            <time className="text-xs opacity-50 ml-1">{formatTime(message?.createdAt)}</time>
          </div>
          <div className="chat-bubble flex flex-col">
            {/* If there is an image  */}

            {message.image && <img src={message.image} alt="Attachment" className="sm:max-w-[200px] rounded-md my-2 cursor-pointer" onClick={() => onImageClick && onImageClick(message.image)!} />}

            {/* If there is text  */}
            {message.text && <p>{message.text}</p>}
          </div>
        </>
      )}
      {!message && isLoading && (
        <div className="flex justify-center items-center h-10">
          <span className="loading loading-spinner loading-lg text-primary/55"></span>
        </div>
      )}
      {!message && typingStatus?.isTyping && (
        <div className="flex items-center space-x-2">
          {showTyping && <span className="animate-pulse">{typingStatus.text}...</span>}
          {!showTyping && (
            <>
              <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce delay-100"></div>
              <div className="w-2.5 h-2.5 bg-primary rounded-full animate-typing-bounce delay-200"></div>
              <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce delay-300"></div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
