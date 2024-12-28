import { ChangeEvent, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User } from "lucide-react";
import { convertToBase64, formateDate } from "../utils/helpers";

const ProfilePage = () => {
  const { currentUser, isLoading, updateProfile } = useAuthStore();
  const [fileContent, setFileContent] = useState<{ preview: string; file: File | undefined | null }>({ file: null, preview: "" });

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const preview = await convertToBase64(file);
    setFileContent({ file, preview });
    // await updateProfile({ profilePic: base64Image });
  };
  const handleSubmit = () => {
    if (fileContent.file && fileContent.preview) {
      const formData = new FormData();
      formData.append("file", fileContent.file);
      updateProfile(formData);
    }
  };
  const handleReset = () => {
    setFileContent({ file: null, preview: "" });
  };
  return (
    <div className="pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold ">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          {/* avatar upload section */}

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img src={fileContent.preview || currentUser?.profile} alt="Profile" className={`size-32 rounded-full object-cover border-4 ${!fileContent.preview && !currentUser?.profile && "hidden"}`} />
              {!fileContent.preview && !currentUser?.profile && (
                <div className="size-32 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-4xl">{currentUser?.fullName[0].toUpperCase()}</span>
                </div>
              )}
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${isLoading ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input type="file" id="avatar-upload" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isLoading} />
              </label>
            </div>
            <p className="text-sm text-zinc-400">Click the camera icon to update your photo</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{currentUser?.fullName}</p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{currentUser?.email}</p>
            </div>
          </div>

          <div className="mt-6 bg-base-300 rounded-xl p-6 flex flex-col gap-4">
            <h2 className="text-lg font-medium ">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{formateDate(currentUser?.createdAt || "")}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
            <div className="actions flex justify-end gap-3">
              <button type="button" className="btn " onClick={handleReset}>
                Cancle
              </button>
              <button type="submit" className="btn btn-primary" onClick={handleSubmit}>
                {isLoading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;
