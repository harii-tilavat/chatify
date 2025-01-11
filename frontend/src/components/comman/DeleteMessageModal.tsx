import React, { useState } from "react";
import { DeletedStatus } from "../../models/messageModel";

interface DeleteMessageModalProps {
  onCancle: () => void;
  onConfirm: (deletedStatus: DeletedStatus) => void;
}

const DeleteMessageModal: React.FC<DeleteMessageModalProps> = ({ onCancle, onConfirm }) => {
  const [isOpen, setIsOpen] = useState(true); // State to manage modal visibility

  const deletedStatus: DeletedStatus = {
    isDeletedBySender: true,
  };

  const handleDeleteForMe = () => {
    setIsOpen(false); // Close the modal
    onConfirm(deletedStatus);
  };

  const handleDeleteForEveryone = () => {
    setIsOpen(false); // Close the modal
    onConfirm({ ...deletedStatus, isDeletedByReceiver: true });
  };

  const handleCancel = () => {
    onCancle(); // Close the modal
  };

  if (!isOpen) return null; // Don't render modal if it's closed

  return (
    // <div className="modal-container">
    //   <div className="modal-content">
    //     <h2>Delete Message</h2>
    //     <p>Do you want to delete this message?</p>
    //     <div className="modal-actions">
    //       <button onClick={handleDeleteForMe}>Delete for Me</button>
    //       <button onClick={handleDeleteForEveryone}>Delete for Everyone</button>
    //       <button onClick={handleCancel}>Cancel</button>
    //     </div>
    //   </div>
    // </div>
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Delete</h3>
        <div className="modal-action">
          <button className="btn" onClick={handleCancel}>
            Cancel
          </button>
          <button className="btn btn-error" onClick={handleDeleteForEveryone}>
            Delete for Everyone
          </button>
          <button className="btn btn-primary" onClick={handleDeleteForMe}>
            Delete for Me
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteMessageModal;
