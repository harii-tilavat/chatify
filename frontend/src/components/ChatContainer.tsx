import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";

const ChatContainer = () => {
  return (
    <div className="flex-1 flex flex-col overflow-auto h-full">
      <ChatHeader />
      <MessageSkeleton />
      <MessageInput />
    </div>
  );
};

export default ChatContainer;
