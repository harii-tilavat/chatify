import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { ModalProvider } from "./context/ModalContext.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")!).render(
  <StrictMode >
    <BrowserRouter>
      <GoogleOAuthProvider clientId="">
        <ModalProvider>
          <App />
        </ModalProvider>
      </GoogleOAuthProvider>
    </BrowserRouter>
  </StrictMode>
);
