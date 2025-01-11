import React, { useState } from "react";
import { UserModel } from "../models/authModel";
import clsx from "clsx";

interface AvtarProps {
  user: UserModel;
  className?: string;
  profile?: string;
}
const Avatar: React.FC<AvtarProps> = ({ user, className }) => {
  const [isImageError, setIsImageError] = useState(false); // Track image error

  const handleError = () => {
    setIsImageError(true); // Set state to true when image fails to load
  };
  if (!user) return null;
  return (
    <div>
      {user.profile && !isImageError ? (
        <img src={user.profile} alt="Profile" className={clsx(`size-12 rounded-full object-cover`, className)} onError={handleError} />
      ) : (
        <div className={clsx("size-12 bg-primary/30 rounded-full flex items-center justify-center", className)}>
          <span>{user?.fullName[0].toUpperCase()}</span>
        </div>
      )}
    </div>
  );
};

export default Avatar;
