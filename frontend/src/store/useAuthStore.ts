import { create } from "zustand";
import { LoginModel, LoginResponseModel, SignupModel, UserModel } from "../models/authModel";
import axiosInstance from "../utils/axios";
import { handleApiError } from "../utils/api";
import { GenericReponseModel } from "../models";
import { toast } from "react-toastify";

interface AuthProps {
    isLoading: boolean;
    currentUser: UserModel | null;
    login: (user: LoginModel) => void,
    signup: (user: SignupModel) => void,
    checkAuth: () => void,
    logout: () => void,
}

export const useAuthStore = create<AuthProps>((set, get) => ({
    isLoading: false,
    currentUser: JSON.parse(localStorage.getItem("user") || "null"),
    checkAuth: async () => {
        try {
            if (get().currentUser) {
                await axiosInstance.post<GenericReponseModel<LoginResponseModel>>("/auth/check-auth");
            }
        } catch (error) {
            set({ currentUser: null });
            localStorage.removeItem("user");
            handleApiError(error, true);
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
        } catch (error) {
            handleApiError(error);
        } finally {
            set({ isLoading: false });
        }
    }
}))