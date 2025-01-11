import { RefreshCcw, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import Avatar from "./Avatar";
import clsx from "clsx";

const Sidebar = () => {
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const { users, getUsers, selectedUser, isUsersLoading, setSelectedUser } = useChatStore();
  const { onlineUsers, currentUser } = useAuthStore();

  const filteredUsers = showOnlineOnly ? users.filter((user) => onlineUsers.includes(user.id)) : users;
  useEffect(() => {
    getUsers();
  }, [getUsers]);
  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2 justify-center lg:justify-between">
          <div className="contacts-label hidden lg:flex gap-4">
            <Users className="size-6" />
            <span className="font-medium hidden lg:block">Contacts</span>
          </div>
          <div className="refresh-icon cursor-pointer " onClick={() => getUsers()}>
            <RefreshCcw className={clsx('size-6',isUsersLoading && 'animate-spin') } />
          </div>
        </div>
        {/* Todo Online filter toggle */}
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input type="checkbox" checked={showOnlineOnly} onChange={(e) => setShowOnlineOnly(e.target.checked)} className="checkbox checkbox-sm" />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">({onlineUsers.length - Number(currentUser?.isActive)} online)</span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {!isUsersLoading &&
          filteredUsers.map((user) => (
            <button
              key={user.id}
              onClick={() => setSelectedUser(user)}
              className={`
            w-full p-3 flex items-center gap-3
            hover:bg-base-300 transition-colors
            ${selectedUser && selectedUser.id === user.id ? "bg-base-300 ring-1 ring-base-300" : ""}
          `}
            >
              <div className="relative mx-auto lg:mx-0">
                {/* Avatar */}
                {<Avatar user={user} />}

                {/* <img src={user.profile || "/avatar.png"} alt={user.fullName} className="size-12 object-cover rounded-full" /> */}
                {onlineUsers.includes(user.id) && (
                  <span
                    className="absolute bottom-0 right-0 size-3 bg-green-500 
                rounded-full ring-2 ring-zinc-900"
                  />
                )}
              </div>

              {/* User info - only visible on larger screens */}
              <div className="hidden lg:block text-left min-w-0">
                <div className="font-medium truncate">{user.fullName}</div>
                <div className="text-sm text-zinc-400">{onlineUsers.includes(user.id) ? "Online" : "Offline"}</div>
              </div>
            </button>
          ))}

        {filteredUsers.length === 0 && !isUsersLoading && <div className="text-center text-zinc-500 py-4">No online users</div>}
        {isUsersLoading && (
          <div className="space-y-4 flex flex-col px-4">
            {[...Array(users.length || 10)].map((_, index) => (
              <div key={index} className="chat chat-start">
                <div className="chat-image avatar">
                  <div className="size-10 rounded-full">
                    <div className="skeleton w-full h-full rounded-full" />
                  </div>
                </div>

                <div className="chat-header mb-1 hidden lg:block">
                  <div className="skeleton h-4  w-[150px]" />
                </div>
                <div className="bg-transparent p-0 hidden lg:block">
                  <div className="skeleton h-4 w-16" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
