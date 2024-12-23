import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar-header">
            {selectedUser?.profile && <img src={selectedUser.profile} alt="Profile" className={`size-12 rounded-full object-cover`} />}
            {!selectedUser?.profile && (
              <div className="size-12 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-base">{selectedUser?.fullName[0].toUpperCase()}</span>
              </div>
            )}

          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedUser?.fullName}</h3>
            <p className="text-sm text-base-content/70">{onlineUsers.includes(selectedUser?.id || "") ? "Online" : "Offline"}</p>
          </div>
        </div>

        {/* Close button */}
        <button onClick={() => setSelectedUser(null)}>
          <X />
        </button>
      </div>
    </div>
  );
};
export default ChatHeader;
