import { createContext, useContext, useState, type ReactNode } from "react";
import type { Signer } from "ethers";

interface WalletContextType {
    wallet: Signer | null;
    walletAddress: string;
    balance: string;
    setWallet: (wallet: Signer | null) => void;
    setWalletAddress: (address: string) => void;
    setBalance: (balance: string) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
    const [wallet, setWallet] = useState<Signer | null>(null);
    const [walletAddress, setWalletAddress] = useState<string>("");
    const [balance, setBalance] = useState<string>("0.0");

    return (
        <WalletContext.Provider
            value={{
                wallet,
                walletAddress,
                balance,
                setWallet,
                setWalletAddress,
                setBalance,
            }}
        >
            {children}
        </WalletContext.Provider>
    );
}

export function useWallet() {
    const context = useContext(WalletContext);
    if (context === undefined) {
        throw new Error("useWallet must be used within a WalletProvider");
    }
    return context;
}
