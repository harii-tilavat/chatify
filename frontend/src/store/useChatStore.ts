import { create } from "zustand";
import { UserModel } from "../models/authModel";
import axiosInstance from "../lib/axios";
import { handleApiError } from "../utils/api";
import { GenericReponseModel } from "../models";
import { DeletedStatus, MessageModel, TypingStatus } from "../models/messageModel";
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
    filteredMessages: Array<MessageModel>;
    getUsers: () => void;
    sendMessage: (userId: string, message: FormData) => void;
    getMessages: (userId: string) => void;
    subscribeToMessages: () => void;
    unsubscribeToMessages: (receiverId: string) => void;
    deleteMessages: (messagesIds: Array<string>, deletedStatus?: DeletedStatus) => void;
    setSelectedUser: (user: UserModel | null) => void;
    setFilteredMessages: (messages: Array<MessageModel>) => void;
}

export const useChatStore = create<ChatStoreProps>((set, get) => ({
    users: [],
    messages: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    isMessageSending: false,
    filteredMessages: [],
    typingStatus: { isTyping: false, senderId: null, receiverId: null, text: "" },
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
                    socket.emit("typing", { isTyping: false, senderId: useAuthStore.getState().currentUser?.id, receiverId, text: "" });
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
                const { isTyping, receiverId, senderId, text } = status;
                // const isTypingChange = get().typingStatus.isTyping !== isTyping || get().typingStatus.senderId !== senderId; // For managing multiple status
                set({
                    typingStatus: {
                        isTyping, receiverId, senderId, text
                    }
                });
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
            set({ typingStatus: { isTyping: false, senderId: null, receiverId: null, text: "" } });
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
    deleteMessages: async (messageIds: Array<string> = [], deletedStatus: DeletedStatus = { isDeletedBySender: true }) => {
        set({ isMessagesLoading: true });
        try {
            await axiosInstance.delete<GenericReponseModel<Array<MessageModel>>>("/messages/delete", { data: { ...deletedStatus, messageIds } });
            const updatedMessages = get().messages.filter(i => !messageIds.includes(i.id));
            set({ messages: updatedMessages });
            if (messageIds.length > 1) {
                toast.success("Messages deleted successfully!");
            }
        } catch (error) {
            handleApiError(error);
        } finally {
            set({ isMessagesLoading: false });
        }
    },
    setSelectedUser: async (selectedUser: UserModel | null) => {
        set({ selectedUser });
    },
    setFilteredMessages: (messages: Array<MessageModel> = []) => {
        set({ filteredMessages: messages });
    }
}));