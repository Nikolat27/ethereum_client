import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./assets/css/main.css"

// Polyfill for global object in browser environments
if (typeof global === 'undefined') {
    (window as any).global = window;
}

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
