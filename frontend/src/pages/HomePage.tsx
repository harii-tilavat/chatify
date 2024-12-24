import ChatContainer from "../components/ChatContainer";
import NoChatSelected from "../components/NoChatSelected";
import Sidebar from "../components/Sidebar";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const HomePage = () => {
  const { selectedUser } = useChatStore();
  const { socket } = useAuthStore();
  if (socket) {
    socket.on("getOnlineUsers", (res) => {
      // console.log("RESPONSE : ", res);
    });
  }
  console.log("SOCKET : ", socket);
  return (
    <div className="min-h-screen bg-base-200">
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
