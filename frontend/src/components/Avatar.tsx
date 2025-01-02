import React from "react";
import { UserModel } from "../models/authModel";
import clsx from "clsx";

interface AvtarProps {
  user: UserModel;
  className?: string;
  profile?: string;
}
const Avatar: React.FC<AvtarProps> = ({ user, className }) => {
  // const [imgSrc, setImgSrc] = useState<string | undefined>(user.profile);
  const handleError = () => {
    // Set a fallback placeholder image
    // setImgSrc(undefined);
  };
  return (
    <div>
      {user.profile && <img src={user.profile} alt="Profile" className={clsx(`size-12 rounded-full object-cover`, className)} onError={handleError} />}
      {!user.profile && (
        <div className={clsx("size-12 bg-primary/30 rounded-full flex items-center justify-center", className)}>
          <span>{user.fullName[0].toUpperCase()}</span>
        </div>
      )}
    </div>
  );
};

export default Avatar;
