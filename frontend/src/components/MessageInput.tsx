import { Image, Loader2, Send, X } from "lucide-react";
import { ChangeEvent, FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { convertToBase64 } from "../utils/helpers";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { toast } from "react-toastify";

const MessageInput = () => {
  const [imagePreview, setImagePreview] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState<string>("");

  const { socket } = useAuthStore();
  const { selectedUser, sendMessage, isMessageSending } = useChatStore();
  const { currentUser } = useAuthStore();

  useEffect(() => {
    removeImage();
    setText("");
  }, [selectedUser]);

  async function handleSendMessage(e: FormEvent) {
    e.preventDefault();

    if (text.trim() || file) {
      const formData = new FormData();
      if (text) formData.append("text", text);
      if (file) formData.append("file", file);
      if (socket && selectedUser) {
        await sendMessage(selectedUser.id, formData);
        removeImage();
        setText("");
      }
    }
  }
  const emitTypingStatus = useCallback(
    (typing: boolean) => {
      if (socket) {
        socket.emit("typing", {
          senderId: currentUser?.id,
          receiverId: selectedUser?.id,
          isTyping: typing,
        });
      }
    },
    [currentUser, selectedUser, socket]
  );

  async function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const currentFile = e.target.files?.length ? e.target.files[0] : null;
    if (currentFile) {
      // Validation: Check if file is an image and size is <= 10 MB
      const validImageTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
      const maxFileSize = 10 * 1024 * 1024; // 10 MB

      if (!validImageTypes.includes(currentFile.type)) {
        toast.error("Only image files (JPEG, PNG, GIF, WebP) are allowed.");
        return;
      }

      if (currentFile.size > maxFileSize) {
        toast.error("File size must be less than or equal to 10 MB. Your size is " + (currentFile.size / 1024 / 1024).toFixed(2) + " MB");
        return;
      }
      const base64Image = await convertToBase64(currentFile);
      setImagePreview(base64Image);
      setFile(currentFile);
    }
  }
  function handleInputChange(value: string) {
    // if (value !== "") {
    //   if (!isTyping) {
    //     setIsTyping(true);
    //     emitTypingStatus(true); // Emit typing status as true when typing starts
    //   }
    //   clearTimeout(typingTimeout);
    //   typingTimeout = setTimeout(() => {
    //     setIsTyping(false);
    //     emitTypingStatus(true); // Emit typing status as false after a delay
    //   }, typingDelay);
    // } else {
    //   clearTimeout(typingTimeout);
    //   if (isTyping) {
    //     setIsTyping(false);
    //     emitTypingStatus(false); // Emit typing status as false if input is cleared
    //   }
    // }

    emitTypingStatus(value !== ""); // Emit typing status as true when typing starts

    setText(value);
  }
  function removeImage() {
    setImagePreview("");
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }
  return (
    <div className="p-4 w-full absolute bottom-0">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img src={imagePreview} alt="Preview" className="w-20 h-20 object-cover rounded-lg border border-zinc-700" />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
                  flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input type="text" className="w-full input input-bordered rounded-lg input-sm sm:input-md" placeholder="Type a message..." value={text} onChange={(e) => handleInputChange(e.target.value)} />
          <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageChange} />

          <button
            type="button"
            className={`hidden sm:flex btn btn-circle
                         ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>
        <button type="submit" className="btn btn-sm btn-circle" disabled={!text.trim() && !imagePreview}>
          {isMessageSending && <Loader2 size={22} className="animate-spin" />}
          {!isMessageSending && <Send size={22} />}
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
