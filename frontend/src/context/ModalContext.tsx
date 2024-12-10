import React, { createContext, useContext, useState } from "react";

interface ModalOptions {
  id?: string;
  title: string;
  description: string;
  onConfirm?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}

interface ModalContextProps {
  openModal: (options: ModalOptions) => void;
  closeModal: () => void;
  modalOptions: ModalOptions | null;
}

const ModalContext = createContext<ModalContextProps | null>(null);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [modalOptions, setModalOptions] = useState<ModalOptions | null>(null);

  const openModal = (options: ModalOptions) => {
    setModalOptions(options);
    (document.getElementById(options.id || "confirmation-modal") as HTMLDialogElement).showModal();
  };

  const closeModal = () => {
    if (modalOptions?.id) {
      (document.getElementById(modalOptions?.id || "confirmation-modal") as HTMLDialogElement)?.close();
    }
    setModalOptions(null);
  };

  return <ModalContext.Provider value={{ openModal, closeModal, modalOptions }}>{children}</ModalContext.Provider>;
};
