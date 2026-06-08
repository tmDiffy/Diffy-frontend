import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import axios from "axios";
import i18n from "./i18n";
import { AuthProvider } from "./context/AuthContext.tsx";
import "./theme/index.scss";
import { CompareProvider } from "./context/CompareContext.tsx";
import { BrowserRouter } from "react-router-dom";

axios.interceptors.request.use((config) => {
    config.headers["Accept-Language"] = i18n.language;
    return config;
});

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Suspense fallback="<div>Loading...</div>">
            <BrowserRouter>
                <AuthProvider>
                    <CompareProvider>
                        <App />
                    </CompareProvider>
                </AuthProvider>
            </BrowserRouter>
        </Suspense>
    </StrictMode>,
);
