import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.min.css";
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
      <ToastContainer autoClose={1500} />

      {/* Modal */}
      <div id="confirmation-modal"></div>
    </div>
  );
}

export default App;
