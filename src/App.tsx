import { AppRoutes } from "./routes/AppRoutes";
import Header from "./components/layout/header/Header";
import Footer from "./components/layout/footer/Footer";
import { ToastContainer } from "react-toastify";
import "./theme/index.scss";

function App() {
    return (
        <>
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
        </>
    );
}

export default App;
