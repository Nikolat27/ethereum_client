import NetworkConfiguration from "../components/Main/Network";
import WalletManagement from "../components/Main/Wallet";
import TransactionBuilder from "../components/Main/Transaction";

export function Main() {
    return (
        <div className="flex flex-col items-center justify-center w-full h-full px-6 py-12 gap-y-8 bg-[#111827]">
            <NetworkConfiguration />
            <WalletManagement />
            <TransactionBuilder />
        </div>
    );
}
