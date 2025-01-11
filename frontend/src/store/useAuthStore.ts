import { create } from "zustand";
import { LoginModel, LoginResponseModel, SignupModel, UserModel } from "../models/authModel";
import axiosInstance from "../lib/axios";
import { handleApiError } from "../utils/api";
import { GenericReponseModel } from "../models";
import { toast } from "react-toastify";
import { initilizeSocket } from "../lib/socket";
import { Socket } from "socket.io-client";
import { useChatStore } from "./useChatStore";
import { googleLogout } from '@react-oauth/google';
interface AuthStoreProps {
    isLoading: boolean;
    currentUser: UserModel | null;
    onlineUsers: Array<string>;
    socket: Socket | null;
    login: (user: LoginModel) => void;
    signup: (user: SignupModel) => void;
    checkAuth: () => void;
    updateProfile: (formData: FormData) => void;
    logout: () => void;
    connectSocket: () => void;
    googleLogin: (token: string) => void;
}

export const useAuthStore = create<AuthStoreProps>((set, get) => ({
    isLoading: false,
    socket: null,
    currentUser: JSON.parse(localStorage.getItem("user") || "null"),
    onlineUsers: [],
    checkAuth: async () => {
        try {
            const user = get().currentUser;
            if (user) {
                const { data } = await axiosInstance.post<GenericReponseModel<UserModel>>("/auth/check-auth");
                const currentUser = data.data;
                if (currentUser) {
                    set({ currentUser });
                    if (currentUser.isActive) {
                        get().connectSocket();
                    }
                }
            }
        } catch (error) {
            set({ currentUser: null });
            localStorage.removeItem("user");
            handleApiError(error);
            throw error;
        }
    },
    // Handle Google Login
    googleLogin: async (token: string) => {
        set({ isLoading: true });
        try {
            const { data } = await axiosInstance.post<GenericReponseModel<LoginResponseModel>>("/auth/google", { token });
            const { message, data: userData } = data;
            if (userData && userData.user) {
                set({ currentUser: userData.user });
                localStorage.setItem("user", JSON.stringify(userData.user));
                toast.success(message || "Login success.");
                get().connectSocket();
            }
        } catch (error) {
            handleApiError(error);
        } finally {
            set({ isLoading: false });
        }
    },
    // Handle user Login
    login: async (user: LoginModel) => {
        set({ isLoading: true });
        try {
            const { email, password } = user;
            const { data } = await axiosInstance.post<GenericReponseModel<LoginResponseModel>>("/auth/login", { email, password });
            const { message, data: userData } = data;
            if (userData && userData.user) {
                set({ currentUser: userData.user, });
                localStorage.setItem("user", JSON.stringify(userData.user));
                toast.success(message || "Login success.");
                get().connectSocket();
            }
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
            localStorage.setItem("user", JSON.stringify(userData?.user));
            toast.success(message || "Signup success.");
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
            // Clear Google login session
            googleLogout();
        } catch (error) {
            handleApiError(error);
        } finally {
            set({ isLoading: false });
        }
    },
    updateProfile: async (formData: FormData) => {
        set({ isLoading: true });
        try {
            const { data } = await axiosInstance.post<GenericReponseModel<UserModel>>("/auth/update-profile", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            const { message, data: currentUser } = data;
            localStorage.setItem("user", JSON.stringify(currentUser));
            if (currentUser?.isActive) {
                get().connectSocket();
            }
            set({ currentUser });
            toast.success(message || "Profile updated successfully.");
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
                const newSocket = initilizeSocket(currentUser);

                newSocket.on("getOnlineUsers", (onlineUsersList) => {
                    const previousOnlineUsers = new Set(get().onlineUsers);
                    const currentUserId = currentUser.id;
                    onlineUsersList.forEach((userId: string) => {
                        if (!previousOnlineUsers.has(userId) && userId !== currentUserId) {
                            const onlineUser = useChatStore
                                .getState()
                                .users.find((user) => user.id === userId);

                            if (onlineUser) {
                                if (!previousOnlineUsers.size) return;
                                toast.info(`${onlineUser.fullName} is online!`, { position: "top-center" });
                            }
                        }
                    });

                    set({ onlineUsers: onlineUsersList });
                });

                set({ socket: newSocket });
            }
        }
    },

}))