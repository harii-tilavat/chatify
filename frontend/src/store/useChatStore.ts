import { create } from "zustand";
import { UserModel } from "../models/authModel";
import axiosInstance from "../lib/axios";
import { handleApiError } from "../utils/api";
import { GenericReponseModel } from "../models";

interface ChatStoreProps {
    users: Array<UserModel>;
    selectedUser: UserModel | null;
    isUsersLoading: boolean;
    isMessagesLoading: boolean;
    getUsers: () => void;
    sendMessage: (userId: string, message: FormData) => void;
    setSelectedUser: (user: UserModel | null) => void;
}

export const useChatStore = create<ChatStoreProps>((set) => ({
    users: [],
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
            const { data } = await axiosInstance.post<GenericReponseModel>("/messages/send/" + userId,message);
            console.log("DATA : ", data);
        } catch (error) {
            handleApiError(error);
        }
    },
    setSelectedUser: async (selectedUser: UserModel | null) => {
        set({ selectedUser });
    }
}));