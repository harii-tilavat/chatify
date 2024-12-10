import { create } from 'zustand';

interface ThemeProps {
    theme: string,
    setTheme: (theme: string) => void
}

export const useThemeStore = create<ThemeProps>((set) => ({
    theme: localStorage.getItem("chat-theme") || "dark",
    setTheme: (theme: string) => {
        localStorage.setItem("chat-theme", theme);
        set({ theme });
    }
}));