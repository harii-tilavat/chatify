import React from "react";
import { UserModel } from "../../models/authModel";
import { formatTime } from "../../utils/helpers";
import Avatar from "../Avatar";
import clsx from "clsx";
import { MessageModel, TypingStatus } from "../../models/messageModel";
import { useAuthStore } from "../../store/useAuthStore";
import { EllipsisIcon, Trash } from "lucide-react";
import Dropdown from "../Dropdown";

interface MessageProps {
  user: UserModel;
  message?: MessageModel;
  isLoading?: boolean;
  typingStatus?: TypingStatus;
  onImageClick?: (image: string) => void;
  onOpenModal?: (ids: Array<string>) => void;
}
export const Message: React.FC<MessageProps> = ({ user, message, isLoading = false, typingStatus, onImageClick, onOpenModal }) => {
  const { currentUser } = useAuthStore();
  const showTyping = Boolean(localStorage.getItem("tpStatus")) || currentUser?.fullName.toLowerCase().includes("harit");
  const isMyMessage = currentUser?.id === message?.senderId;

  return (
    <div className={clsx("chat", isMyMessage || isLoading ? "chat-end" : "chat-start", typingStatus?.isTyping && "animate-pulse")} id={message?.id || String(Math.random())}>
      <div className="chat-image">
        {/* Avtar */}
        <Avatar user={isMyMessage ? currentUser! : user} />
      </div>
      {!message && typingStatus?.isTyping && <span></span>}
      {message && (
        <>
          <div className="chat-header mb-1">
            <time className="text-xs opacity-50 ml-1">{formatTime(message?.createdAt)}</time>
          </div>
          <div className="chat-bubble flex flex-col">
            {/* If there is an image  */}
            <div className="chat-col">
              {message.image && <img src={message.image} alt="Attachment" className="sm:max-w-[200px] rounded-md my-2 cursor-pointer" onClick={() => onImageClick && onImageClick(message.image)!} />}

              {/* If there is text  */}
              {message.text && (
                <div className={clsx("flex gap-2", isMyMessage && "flex-row-reverse", "relative group  duration-300")}>
                  <span>{message.text}</span>
                  {/* <div className="drop-down"> */}
                  {!typingStatus?.isTyping && (
                    <Dropdown items={[{ label: "Delete message", icon: <Trash size={16} />, action: () => onOpenModal && onOpenModal([message.id]) }]} label="Open" className={clsx("", !isMyMessage && "dropdown-bottom")}>
                      <EllipsisIcon className="cursor-pointer opacity-0 group-hover:opacity-100 w-0 group-hover:w-10 transition-all duration-300" />
                    </Dropdown>
                  )}

                  {/* </div> */}
                </div>
              )}
            </div>
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
