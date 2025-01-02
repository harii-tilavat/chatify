import React, { createContext, useContext, useState } from "react";
import Modal from "../components/Modal";
import { useThemeStore } from "../store/useThemeStore";

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
  const [isOpen, setIsOpen] = useState(false); // State to control modal visibility
  const { theme } = useThemeStore();
  const openModal = (options: ModalOptions) => {
    setModalOptions(options);
    setIsOpen(true); // Open the modal by setting state
  };

  const closeModal = () => {
    setIsOpen(false); // Close the modal
    setModalOptions(null); // Reset modal options
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal, modalOptions }}>
      <div className="root-container" data-theme={theme}>
        {children}
        {isOpen && <Modal />}
      </div>
    </ModalContext.Provider>
  );
};
