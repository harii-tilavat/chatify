import { useChatStore } from "../store/useChatStore";
import { Message } from "./Chat/Message";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";

const ChatContainer = () => {
  const { selectedUser, messages } = useChatStore();
  return (
    <div className="flex-1 flex flex-col overflow-auto h-full">
      <ChatHeader />
      <div className="main-chat-container overflow-y-auto">
        {/* Skeliton */}
        <MessageSkeleton />
        {/* Chat Messages  */}
        <div className="flex-1 p-4 space-y-4">
          {/* Repeat this block for each message  */}
          {messages.map((message, i) => (
            <Message user={selectedUser!} isMyMessage={i % 2 === 0} message={message} key={i} />
          ))}
          {/* End message block  */}
        </div>
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
