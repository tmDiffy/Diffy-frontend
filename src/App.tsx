import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes/AppRoutes";
import Header from "./components/layout/header/Header";
import Footer from "./components/layout/footer/Footer";
import { ToastContainer } from "react-toastify";

function App() {
    return (
        <BrowserRouter>
            <Header />
            <main>
                <ToastContainer
                    position="top-center"
                    autoClose={3000}
                    hideProgressBar={true}
                    theme="colored"
                />
                <AppRoutes />
            </main>
            <Footer />
        </BrowserRouter>
    );
}

export default App;
