import { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import { Message } from "./Chat/Message";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { MessageCircle } from "lucide-react";

const ChatContainer = () => {
  const { selectedUser, messages, isMessagesLoading, getMessages } = useChatStore();
  const messageContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser?.id);
    }
  }, [selectedUser, getMessages]);

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      const lastElement = document.getElementById(lastMessage.id);
      lastElement?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  return (
    <div className="flex-1 flex flex-col overflow-auto h-full">
      <ChatHeader />
      <div className="main-chat-container overflow-y-auto relative mb-14" ref={messageContainerRef}>
        {/* Skeliton */}
        {isMessagesLoading && <MessageSkeleton />}

        {/* Chat Messages  */}
        <div className="flex-1 p-4 space-y-4">
          {/* Repeat this block for each message  */}

          {!messages.length && !isMessagesLoading && (
            <div className="flex flex-col items-center justify-center text-gray-500 mt-9">
              <MessageCircle className="w-12 h-12 mb-2 animate-bounce" />
              <p className="text-lg">Start conversation</p>
            </div>
          )}

          {messages.map((message, i) => (
            <Message user={selectedUser!} message={message} key={i} />
          ))}

          {/* End message block  */}
        </div>
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
