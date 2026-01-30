import { lazy, Suspense } from "react";

const NetworkConfiguration = lazy(() => import("../components/Main/Network"));
const WalletManagement = lazy(() => import("../components/Main/Wallet"));
const TransactionBuilder = lazy(() => import("../components/Main/Transaction"));
const ContractInteraction = lazy(() => import("../components/Main/Contract"));
const JsonRequest = lazy(() => import("../components/Main/JsonRequest"));
const BytecodeAnalyzer = lazy(() => import("../components/Main/BytecodeAnalyzer"));
const Utilities = lazy(() => import("../components/Main/Utilities"));

const LoadingFallback = () => (
    <div className="flex flex-col w-full p-5 gap-y-6 rounded-lg bg-[#1f2937] border border-gray-600 animate-pulse">
        <div className="h-8 bg-gray-700 rounded w-1/3"></div>
        <div className="space-y-3">
            <div className="h-4 bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-700 rounded w-5/6"></div>
        </div>
    </div>
);

export function Main() {
    return (
        <div
            className="flex flex-col items-center justify-center w-full
            px-6 py-12 gap-y-8 bg-[#111827]"
        >
            <Suspense fallback={<LoadingFallback /> }>
                <NetworkConfiguration />
            </Suspense>
            <Suspense fallback={<LoadingFallback /> }>
                <WalletManagement />
            </Suspense>
            <Suspense fallback={<LoadingFallback /> }>
                <TransactionBuilder />
            </Suspense>
            <Suspense fallback={<LoadingFallback /> }>
                <ContractInteraction />
            </Suspense>
            <Suspense fallback={<LoadingFallback /> }>
                <JsonRequest />
            </Suspense>
            <Suspense fallback={<LoadingFallback /> }>
                <BytecodeAnalyzer />
            </Suspense>
            <Suspense fallback={<LoadingFallback /> }>
                <Utilities />
            </Suspense>
        </div>
    );
}
