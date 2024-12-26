import { Ellipsis, X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import Avatar from "./Avatar";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar-header">{selectedUser && <Avatar user={selectedUser} />}</div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedUser?.fullName}</h3>
            <p className="text-sm text-base-content/70">{onlineUsers.includes(selectedUser?.id || "") ? "Online" : "Offline"}</p>
          </div>
        </div>

        {/* Button */}
        <div className="buttons">
          <details className="dropdown dropdown-end border-base-300">
            <summary className="btn m-1 bg-transparent border-transparent"><Ellipsis/></summary>
            <ul className="menu dropdown-content bg-base-100 rounded-box z-[1]  p-2 shadow-primary w-40 border-b border-base-300">
              <li>
                <a>Clear chat</a>
              </li>
              <li>
                <a>Close</a>
              </li>
            </ul>
          </details>
          <button onClick={() => setSelectedUser(null)}>
            <X />
          </button>
        </div>
      </div>
    </div>
  );
};
export default ChatHeader;
