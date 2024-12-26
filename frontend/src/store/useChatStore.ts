import { create } from "zustand";
import { UserModel } from "../models/authModel";
import axiosInstance from "../lib/axios";
import { handleApiError } from "../utils/api";
import { GenericReponseModel } from "../models";
import { MessageModel } from "../models/messageModel";
import { useAuthStore } from "./useAuthStore";

interface ChatStoreProps {
    users: Array<UserModel>;
    selectedUser: UserModel | null;
    isUsersLoading: boolean;
    isMessagesLoading: boolean;
    messages: Array<MessageModel>;
    getUsers: () => void;
    sendMessage: (userId: string, message: FormData) => void;
    getMessages: (userId: string) => void;
    subscribeToMessages: () => void;
    unsubscribeToMessages: () => void;
    setSelectedUser: (user: UserModel | null) => void;
}

export const useChatStore = create<ChatStoreProps>((set, get) => ({
    users: [],
    messages: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
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
    sendMessage: async (userId: string, message: FormData) => {
        try {
            const { data } = await axiosInstance.post<GenericReponseModel<MessageModel>>("/messages/send/" + userId, message, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            const newMessage = data.data;
            if (newMessage) {
                set({ messages: [...get().messages, newMessage] });
            }
        } catch (error) {
            handleApiError(error);
        }
    },
    subscribeToMessages: async () => {
        const selectedUser = get().selectedUser;
        if (!selectedUser) return;
        const socket = useAuthStore.getState().socket;
        if (socket) {
            socket.on("newMessage", (newMessage: MessageModel) => {
                set({ messages: [...get().messages, newMessage] });
                // debugger;
            })
        }
    },
    unsubscribeToMessages: async () => {
        const socket = useAuthStore.getState().socket;
        if (socket) {
            socket.off("newMessage");
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