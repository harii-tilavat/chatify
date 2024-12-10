import { ToastContainer } from "react-toastify";
import "./App.css";
import AppRouter from "./routes/AppRouter";

function App() {
  return (
    <div className="app" data-theme={'black'}>
      {/* Main routing */}
      <AppRouter />

      {/* Manage notification or messages */}
      <ToastContainer />
    </div>
  );
}

export default App;
