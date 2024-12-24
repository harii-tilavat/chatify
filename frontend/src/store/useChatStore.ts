import { create } from "zustand";
import { UserModel } from "../models/authModel";
import axiosInstance from "../lib/axios";
import { handleApiError } from "../utils/api";
import { GenericReponseModel } from "../models";
import { MessageModel } from "../models/messageModel";

interface ChatStoreProps {
    users: Array<UserModel>;
    selectedUser: UserModel | null;
    isUsersLoading: boolean;
    isMessagesLoading: boolean;
    messages: Array<MessageModel>;
    getUsers: () => void;
    sendMessage: (userId: string, message: FormData) => void;
    getMessages: (userId: string) => void;
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
            // Pending...
        } catch (error) {
            handleApiError(error);
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