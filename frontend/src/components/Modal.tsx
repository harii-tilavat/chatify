import React from "react";
import { useModal } from "./ModalContext";

const Modal: React.FC = () => {
  const { modalOptions, closeModal } = useModal();

  if (!modalOptions) return null;

  const { id, title, description, confirmLabel = "Confirm", cancelLabel = "Cancel", onConfirm } = modalOptions;

  return (
    <dialog id={id} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="py-4">{description}</p>
        <div className="modal-action">
          <button className="btn btn-secondary" onClick={closeModal}>
            {cancelLabel}
          </button>
          {onConfirm && (
            <button
              className="btn btn-primary"
              onClick={() => {
                onConfirm();
                closeModal();
              }}
            >
              {confirmLabel}
            </button>
          )}
        </div>
      </div>
    </dialog>
  );
};

export default Modal;
