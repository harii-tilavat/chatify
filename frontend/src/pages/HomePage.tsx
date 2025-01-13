import ChatContainer from "../components/Chat/ChatContainer";
import NoChatSelected from "../components/Chat/NoChatSelected";
import Sidebar from "../components/Sidebar";
import { useChatStore } from "../store/useChatStore";

const HomePage = () => {
  const { selectedUser } = useChatStore();
  return (
    <div className="min-h-screen">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />
            <div className="chat-dashboard flex-1 relative">{selectedUser ? <ChatContainer /> : <NoChatSelected />}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
