import { Image, Send, X } from "lucide-react";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { convertToBase64 } from "../utils/helpers";

const MessageInput = () => {
  const [imagePreview, setImagePreview] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleSendMessage(e: FormEvent) {
    e.preventDefault();
    if (text.trim() || file) {
      console.log("DATA", { text, file });
    }
  }

  async function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const currentFile = e.target.files?.length ? e.target.files[0] : null;
    if (currentFile) {
      const base64Image = await convertToBase64(currentFile);
      setImagePreview(base64Image);
      setFile(currentFile);
    }
  }

  function removeImage() {
    setImagePreview("");
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }
  return (
    <div className="p-4 w-full">
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
          <input type="text" className="w-full input input-bordered rounded-lg input-sm sm:input-md" placeholder="Type a message..." value={text} onChange={(e) => setText(e.target.value)} />
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
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;