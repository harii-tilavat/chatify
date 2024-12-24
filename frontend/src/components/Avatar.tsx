import React from "react";
import { UserModel } from "../models/authModel";
import clsx from "clsx";

interface AvtarProps {
  user: UserModel;
  className?: string;
}
const Avatar: React.FC<AvtarProps> = ({ user, className }) => {
  return (
    <div>
      {user.profile && <img src={user.profile} alt="Profile" className={clsx(`size-12 rounded-full object-cover`, className)} />}
      {!user.profile && (
        <div className={clsx("size-12 bg-primary/20 rounded-full flex items-center justify-center", className)}>
          <span className="text-base">{user.fullName[0].toUpperCase()}</span>
        </div>
      )}
    </div>
  );
};

export default Avatar;
