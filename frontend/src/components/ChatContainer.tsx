import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Message } from "./Chat/Message";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { MessageCircle } from "lucide-react";
import ImagePreview from "./ImagePreview";
import ChatHeader from "./ChatHeader";
import { useModal } from "../context/ModalContext";
import { toast } from "react-toastify";
const ChatContainer = () => {
  const { selectedUser, setSelectedUser, messages, isMessagesLoading, getMessages, subscribeToMessages, unsubscribeToMessages, typingStatus } = useChatStore();
  console.log("isMessagesLoading: ", isMessagesLoading);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null); // State for the image to preview

  const { openModal } = useModal();
  const { deleteMessages } = useChatStore();

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser?.id);
      subscribeToMessages();
    }
    return () => {
      // setSelectedUser(null);
      if (selectedUser) {
        unsubscribeToMessages(selectedUser.id);
      }
    };
  }, [selectedUser, getMessages, subscribeToMessages, unsubscribeToMessages, setSelectedUser]);

  useEffect(() => {
    messageContainerRef.current?.scrollTo({
      top: messageContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, typingStatus.isTyping]);

  const handleImageClick = (image: string) => {
    setPreviewImage(image);
  };

  function openDeleteModal(ids: Array<string> = []) {
    openModal({
      title: "Confirm Deletion",
      confirmLabel: ids.length > 2 ? "Clear chat" : "Delete message",
      description: `Are you sure you want to ${ids.length > 2 ? "clear this chat" : "delete this message"}? It won't be recoverable.`,
      onConfirm: () => handleDeleteMessage(ids),
    });
  }
  function handleDeleteMessage(ids: Array<string> = []) {
    if (!ids.length) {
      toast.error("Please select message first!");
      return;
    }
    deleteMessages(ids);
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto h-full">
      <ChatHeader onOpenModal={() => openDeleteModal(messages.map((i) => i.id))} />

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
            <Message user={selectedUser!} message={message} key={i} onImageClick={handleImageClick} onOpenModal={openDeleteModal} />
          ))}
          <div id="typing-status">{typingStatus.isTyping && typingStatus.senderId === selectedUser?.id && <Message user={selectedUser!} typingStatus={typingStatus} />}</div>

          {/* End message block  */}
        </div>
      </div>

      <MessageInput />

      {/* Image Preview Modal */}
      {previewImage && <ImagePreview image={previewImage} onClose={() => setPreviewImage(null)} />}
    </div>
  );
};

export default ChatContainer;
