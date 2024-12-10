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
      {/* Open the modal using document.getElementById('ID').showModal() method */}
      {/* <button className="btn" onClick={() => (document.getElementById("my_modal_2") as HTMLDialogElement).showModal()}>
        open modal
      </button>
      <dialog id="my_modal_2" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Hello!</h3>
          <p className="py-4">Press ESC key or click outside to close</p>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog> */}

      {/* Manage notification or messages */}
      <ToastContainer autoClose={1500} />
    </div>
  );
}

export default App;
