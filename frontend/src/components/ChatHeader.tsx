import { Delete, Ellipsis, LogOut, Settings, Trash, User, X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import Avatar from "./Avatar";
import Dropdown from "./Dropdown";

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
          <Dropdown
            label="Options"
            items={[
              { label: "Clear chat", icon: <Trash size={16} />, action: () => () => {} },
              { label: "Settings", icon: <Settings size={16} />, action: () => () => {} },
              { label: "Close", icon: <LogOut size={16} />, action: () => {} },
            ]}
          >
            <button className="btn btn-sm">
              <Ellipsis />
            </button>
          </Dropdown>
          <button onClick={() => setSelectedUser(null)}>
            <X />
          </button>
        </div>
      </div>
    </div>
  );
};
export default ChatHeader;
