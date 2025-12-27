import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

export function Main() {
    return (
        <main className="min-h-screen grid grid-rows-[2.5rem_1fr]">
            <Header />
            <div className="flex flex-1 h-full w-full">
                <Sidebar />
                <Outlet />
            </div>
        </main>
    );
}
