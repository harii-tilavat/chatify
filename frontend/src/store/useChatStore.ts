import { create } from "zustand";
import { UserModel } from "../models/authModel";
import axiosInstance from "../lib/axios";
import { handleApiError } from "../utils/api";
import { GenericReponseModel } from "../models";
import { MessageModel } from "../models/messageModel";
import { useAuthStore } from "./useAuthStore";
import { toast } from "react-toastify";

interface ChatStoreProps {
    users: Array<UserModel>;
    selectedUser: UserModel | null;
    isUsersLoading: boolean;
    isMessagesLoading: boolean;
    isMessageSending: boolean;
    typingStatus: TypingStatus;
    messages: Array<MessageModel>;
    getUsers: () => void;
    sendMessage: (userId: string, message: FormData) => void;
    getMessages: (userId: string) => void;
    subscribeToMessages: () => void;
    unsubscribeToMessages: (receiverId: string) => void;
    setSelectedUser: (user: UserModel | null) => void;
}
interface TypingStatus {
    senderId: string | null;
    receiverId: string | null;
    isTyping: boolean;
}
export const useChatStore = create<ChatStoreProps>((set, get) => ({
    users: [],
    messages: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    isMessageSending: false,
    typingStatus: { isTyping: false, senderId: null, receiverId: null },
    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const { data } = await axiosInstance.get<GenericReponseModel<Array<UserModel>>>("/messages/users");
            const { data: users } = data;
            set({ users });
        } catch (error) {
            handleApiError(error, false);
        } finally {
            set({ isUsersLoading: false });
        }
    },
    sendMessage: async (receiverId: string, message: FormData) => {
        set({ isMessageSending: true });
        try {
            const { data } = await axiosInstance.post<GenericReponseModel<MessageModel>>("/messages/send/" + receiverId, message, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            const newMessage = data.data;
            if (newMessage) {
                set({ messages: [...get().messages, newMessage] });
                const socket = useAuthStore.getState().socket;
                if (socket) {
                    socket.emit("typing", { isTyping: false, senderId: useAuthStore.getState().currentUser?.id, receiverId });
                }
            }
        } catch (error) {
            handleApiError(error);
        }
        finally {
            set({ isMessageSending: false });
        }
    },
    subscribeToMessages: async () => {
        const selectedUser = get().selectedUser;
        if (!selectedUser) return;
        const socket = useAuthStore.getState().socket;

        if (socket) {
            const handleNewMessage = (newMessage: MessageModel) => {
                if (selectedUser.id === newMessage.senderId) {
                    set({ messages: [...get().messages, newMessage] });
                } else {
                    const messageUser = get().users.find(i => i.id === newMessage.senderId);
                    toast.info(`${messageUser?.fullName || "Unknown"}: ${newMessage.text || "New message received!"}`);
                }

            }
            const handleTypingStatus = (status: TypingStatus) => {
                const { isTyping, receiverId, senderId } = status;
                if (get().typingStatus.isTyping !== isTyping || get().typingStatus.senderId !== senderId) {
                    set({
                        typingStatus: {
                            isTyping, receiverId, senderId
                        }
                    });
                }
            }
            socket.on("newMessage", handleNewMessage);
            socket.on("typing", handleTypingStatus);
        }
    },
    unsubscribeToMessages: async (receiverId: string) => {
        const socket = useAuthStore.getState().socket;
        if (socket) {
            socket.off("newMessage");
            socket.emit("typing", { isTyping: false, senderId: null, receiverId });
            // socket.off("typing");
            set({ typingStatus: { isTyping: false, senderId: null, receiverId: null } });
        }
    },
    getMessages: async (userId: string) => {
        set({ isMessagesLoading: true, messages: [] });
        try {
            const { data } = await axiosInstance.get<GenericReponseModel<Array<MessageModel>>>("/messages/" + userId);
            const messages = data.data;
            set({ messages });
        } catch (error) {
            handleApiError(error);
        } finally {
            set({ isMessagesLoading: false });
        }
    },
    setSelectedUser: async (selectedUser: UserModel | null) => {
        set({ selectedUser });
    }
}));