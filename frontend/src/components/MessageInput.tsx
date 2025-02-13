import { Image, Loader2, Send, X } from "lucide-react";
import { ChangeEvent, FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { convertToBase64 } from "../utils/helpers";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import ImagePreview from "./ImagePreview";
import useDebounce from "../hooks/useDebounce";
import { checkFileValidation } from "../utils/validators";
import { toast } from "react-toastify";
import { useModal } from "../context/ModalContext";
import { AxiosError } from "axios";

const MessageInput = () => {
  const [imagePreview, setImagePreview] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState<string>("");
  const debouncedText = useDebounce(text, 300);

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

      if (!currentUser?.isActive) {
        toast.error("Please activate your profile first.");
        return;
      }

      if (socket && selectedUser) {
        if (!selectedUser.isActive) {
          toast.error(selectedUser.fullName + " is currently Inactive!");
          return;
        }
        await sendMessage(selectedUser.id, formData);
        removeImage();
        setText("");
      }
    }
  }
  const emitTypingStatus = useCallback(
    (typing: boolean, text: string) => {
      if (socket) {
        socket.emit("typing", {
          senderId: currentUser?.id,
          receiverId: selectedUser?.id,
          isTyping: typing,
          text,
        });
      }
    },
    [currentUser, selectedUser, socket]
  );
  useEffect(() => {
    emitTypingStatus(debouncedText !== "", debouncedText);
  }, [debouncedText, emitTypingStatus]);

  async function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    try {
      const currentFile = e.target.files?.length ? e.target.files[0] : null;
      if (currentFile) {
        checkFileValidation(currentFile);
        const base64Image = await convertToBase64(currentFile);
        setImagePreview(base64Image);
        setFile(currentFile);
      }
    } catch (error: any) {
      toast.error(error?.message || "Invalid file selected.");
    }
  }
  function handleInputChange(value: string) {
    if (value.length === 1) emitTypingStatus(true, value); // Emit typing status as true when typing starts

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
            <img src={imagePreview} alt="Preview" className="w-20 h-20 object-cover rounded-lg border border-zinc-700 cursor-pointer" onClick={() => setIsPreviewOpen(true)} />
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
        <div className="flex-1 flex gap-2 items-center">
          <input type="text" className="w-full input input-bordered rounded-lg input-sm sm:input-md" placeholder="Type a message..." value={text} onChange={(e) => handleInputChange(e.target.value)} />
          <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageChange} />

          <button
            type="button"
            className={`flex btn btn-circle
                         ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>
        <button type="submit" className="btn btn-sm btn-circle" disabled={!text.trim() && !imagePreview}>
          {isMessageSending && <Loader2 size={20} className="animate-spin" />}
          {!isMessageSending && <Send size={20} />}
        </button>
      </form>
      {/* Image Preview Modal */}
      {isPreviewOpen && <ImagePreview image={imagePreview} onClose={() => setIsPreviewOpen(false)} />}
    </div>
  );
};

export default MessageInput;
