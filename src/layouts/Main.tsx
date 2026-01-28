import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer"

export function Main() {
    return (
        <main className="h-screen grid grid-rows-[2.5rem_1fr]">
            <Header />
            <div className="flex w-full h-full overflow-hidden">
                <Sidebar />
                <div className="flex-1 h-full overflow-y-auto scroll-smooth">
                    <Outlet />
                    <Footer />
                </div>
            </div>
        </main>
    );
}
