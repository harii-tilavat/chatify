import React, { useState } from "react";
import { BaseProps } from "../utils/types";

interface DropdownProps extends BaseProps {
  label: string; // Button label
  items: Array<{ label: string; icon: React.ReactNode; action: () => void }>; // Dropdown items
  className?: string;
}

const Dropdown: React.FC<DropdownProps> = ({ items, className, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev); // Toggle dropdown state
  };

  const handleItemClick = (action: () => void) => {
    action(); // Execute the action
    setIsOpen(false); // Close dropdown
  };

  return (
    <div className={`dropdown ${className ? className : "dropdown-end"} ${isOpen ? "dropdown-open" : ""}`}>
      {/* Button */}
      <div
        tabIndex={0}
        role="button"
        className="m-1"
        onClick={toggleDropdown}
        onBlur={() => setTimeout(() => setIsOpen(false), 150)} // Delay to prevent immediate close
      >
        {children}
      </div>

      {/* Dropdown Items */}
      {isOpen && (
        <ul className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
          {items.map((item, index) => (
            <li key={index}>
              <a onClick={() => handleItemClick(item.action)} className="flex items-center">
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
