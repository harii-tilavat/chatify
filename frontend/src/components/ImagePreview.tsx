import { X } from "lucide-react";

interface ImagePreviewProps {
  image: string | null; // The image URL to preview
  onClose: () => void; // Function to close the preview
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ image, onClose }) => {
  if (!image) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm select-none">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 btn btn-circle bg-white/20 hover:bg-white/40 transition duration-200"
      >
        <X className="text-white" />
      </button>

      {/* Image preview box */}
      <div className="relative max-w-4xl w-full p-4">
        <img
          src={image}
          alt="Preview"
          className="w-full max-h-[80vh] object-contain rounded-lg shadow-lg transform transition duration-300 hover:scale-105"
        />
      </div>
    </div>
  );
};

export default ImagePreview;
