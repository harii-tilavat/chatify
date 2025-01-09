import { ChevronDown, ChevronUp, Ellipsis, LogOut, Settings, Trash, X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import Avatar from "./Avatar";
import Dropdown from "./Dropdown";
import { useEffect, useState } from "react";
import useDebounce from "../hooks/useDebounce";

interface ChatHeaderProps {
  onOpenModal: () => void;
  onSearchChat: (message: string) => void;
  onClearSearch: () => void;
  onSearchUp: () => void;
  onSearchDown: () => void;
}
const ChatHeader: React.FC<ChatHeaderProps> = ({ onOpenModal, onSearchChat, onClearSearch, onSearchUp, onSearchDown }) => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");

  const debouncedSearch = useDebounce(searchQuery, 400);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    if (debouncedSearch) {
      onSearchChat(debouncedSearch);
    } else {
      setSearchQuery("");
    }
  }, [debouncedSearch, onSearchChat, setSearchQuery]);

  useEffect(() => {
    setSearchQuery("");
  }, [selectedUser]);

  function handleClearSearch() {
    setSearchQuery("");
    onClearSearch();
  }
  return (
    <div className="p-2.5 border-b border-base-300 relative">
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

        {/* Middle section: Search bar */}
        <div className="hidden sm:flex items-center gap-2 h-10 absolute left-1/2 transform -translate-x-1/2">
          <div className="search-input relative">
            <input type="text" value={searchQuery} onChange={handleSearchChange} className=" w-full input input-bordered rounded-lg input-sm sm:input-md !h-9" placeholder="Search chat..." />
            {searchQuery && (
              <button onClick={handleClearSearch} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-base-content/70 hover:text-base-content">
                <X size={16} />
              </button>
            )}
          </div>
          {/* Search Navigation Buttons */}
          {searchQuery && (
            <div className=" transform flex ">
              <button onClick={onSearchUp} className="btn btn-circle btn-xs btn-ghost hover:bg-base-300" title="Search up">
                <ChevronUp size={16} />
              </button>
              <button onClick={onSearchDown} className="btn btn-circle btn-xs btn-ghost hover:bg-base-300" title="Search down">
                <ChevronDown size={16} />
              </button>
            </div>
          )}
        </div>
        {/* Button */}
        <div className="buttons">
          <Dropdown
            label="Options"
            items={[
              { label: "Clear chat", icon: <Trash size={16} />, action: onOpenModal },
              { label: "Settings", icon: <Settings size={16} />, action: () => () => {} },
              { label: "Close", icon: <LogOut size={16} />, action: () => {} },
            ]}
          >
            <button className="me-4">
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
