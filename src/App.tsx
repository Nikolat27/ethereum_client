import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Main as MainLayout } from "./layouts/Main";
import { Main as MainPage } from "./pages/Main";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route index path="/" element={<MainPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
