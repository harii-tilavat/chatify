import React from "react";
import { useModal } from "../context/ModalContext";

const Modal: React.FC = () => {
  const { modalOptions, closeModal } = useModal();

  if (!modalOptions) return null;

  const {  title, description, confirmLabel = "Confirm", cancelLabel = "Cancel", onConfirm } = modalOptions;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="py-4">{description}</p>
        <div className="modal-action">
          <button className="btn" onClick={closeModal}>
            {cancelLabel}
          </button>
          {onConfirm && (
            <button
              className="btn btn-primary"
              onClick={() => {
                onConfirm();
                closeModal(); // Close modal after confirm
              }}
            >
              {confirmLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
