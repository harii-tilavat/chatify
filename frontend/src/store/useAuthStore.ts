import { create } from "zustand";
import { LoginModel, LoginResponseModel, SignupModel, UserModel } from "../models/authModel";
import axiosInstance from "../utils/axios";
import { handleApiError } from "../utils/api";
import { GenericReponseModel } from "../models";
import { toast } from "react-toastify";
import { initilizeSocket } from "../lib/socket";
import { Socket } from "socket.io-client";
interface AuthStoreProps {
    isLoading: boolean;
    currentUser: UserModel | null;
    onlineUsersId: Array<string>;
    login: (user: LoginModel) => void;
    signup: (user: SignupModel) => void;
    checkAuth: () => void;
    logout: () => void;
    socket: Socket | null;
    connectSocket: () => void;
}

export const useAuthStore = create<AuthStoreProps>((set, get) => ({
    isLoading: false,
    socket: null,
    currentUser: JSON.parse(localStorage.getItem("user") || "null"),
    onlineUsersId: [],
    checkAuth: async () => {
        try {
            const user = get().currentUser;
            if (user) {
                await axiosInstance.post<GenericReponseModel<LoginResponseModel>>("/auth/check-auth");
                get().connectSocket();
            }
        } catch (error) {
            set({ currentUser: null });
            localStorage.removeItem("user");
            handleApiError(error);
            throw error;
        }
    },
    // Handle user Login
    login: async (user: LoginModel) => {
        set({ isLoading: true });
        try {
            const { email, password } = user;
            const { data } = await axiosInstance.post<GenericReponseModel<LoginResponseModel>>("/auth/login", { email, password });
            const { message, data: userData } = data;
            set({ currentUser: userData?.user, });
            localStorage.setItem("user", JSON.stringify(userData?.user));
            toast.success(message || "Login success.");
            get().connectSocket();
        } catch (error) {
            handleApiError(error);
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    // Handle user Signup
    signup: async (user: SignupModel) => {
        set({ isLoading: true });
        try {
            const { fullName, email, password } = user;
            const { data } = await axiosInstance.post<GenericReponseModel<LoginResponseModel>>("/auth/register", { fullName, email, password });
            const { message, data: userData } = data;
            set({ currentUser: userData?.user, });
            toast.success(message || "Sign success.");
            get().connectSocket();
        } catch (error) {
            handleApiError(error);
        } finally {
            set({ isLoading: false });
        }
    },
    logout: async () => {
        try {
            const { data } = await axiosInstance.post<GenericReponseModel>("/auth/logout");
            const { message } = data;
            set({ currentUser: null });
            localStorage.removeItem("user");
            toast.success(message || "Logout success.");
            const currentSocket = get().socket;
            if (currentSocket) {
                currentSocket.disconnect();
            }
        } catch (error) {
            handleApiError(error);
        } finally {
            set({ isLoading: false });
        }
    },
    connectSocket: async () => {
        const currentSocket = get().socket;
        if (!currentSocket || !currentSocket.connected) {
            const currentUser = get().currentUser;
            if (currentUser) {
                const socket = initilizeSocket(currentUser);
                set({ socket });
            }
        }
    },
}))