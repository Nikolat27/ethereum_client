import { lazy } from "react";

const NetworkConfiguration = lazy(() => import("../components/Main/Network"));
const WalletManagement = lazy(() => import("../components/Main/Wallet"));
const TransactionBuilder = lazy(() => import("../components/Main/Transaction"));
const ContractInteraction = lazy(() => import("../components/Main/Contract"));
const JsonRequest = lazy(() => import("../components/Main/JsonRequest"));

export function Main() {
    return (
        <div className="flex flex-col items-center justify-center w-full h-full px-6 py-12 gap-y-8 bg-[#111827]">
            <NetworkConfiguration />
            <WalletManagement />
            <TransactionBuilder />
            <ContractInteraction />
            <JsonRequest />
        </div>
    );
}
