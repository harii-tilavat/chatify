import { ToastContainer } from "react-toastify";
import "./App.css";
import AppRouter from "./routes/AppRouter";
import { useThemeStore } from "./store/useThemeStore";

function App() {
  const { theme } = useThemeStore();
  return (
    <div className="app" data-theme={theme}>
      {/* Main routing */}
      <AppRouter />

      {/* Manage notification or messages */}
      <ToastContainer />
    </div>
  );
}

export default App;
