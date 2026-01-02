import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Main as MainLayout } from "./layouts/Main";
import { Main as MainPage } from "./pages/Main";
import { WalletProvider } from "./contexts/WalletContext";

function App() {
    return (
        <WalletProvider>
            <BrowserRouter>
                <Routes>
                    <Route element={<MainLayout />}>
                        <Route index path="/" element={<MainPage />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </WalletProvider>
    );
}

export default App;
