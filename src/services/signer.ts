import { Wallet } from "ethers";
import type { Signer } from "ethers";
import { validatePrivateKey } from "../utils/services";
import type { WalletType } from "../types/types";

class SignerService {
    // This contains both private key and mnemonic wallet
    public newWallet(): Signer {
        return Wallet.createRandom();
    }

    public importWallet(
        input: string,
        walletType: WalletType,
    ): Signer {
        return walletType === "private-key"
            ? this.importWalletFromPrivateKey(input)
            : this.importWalletFromMnemonic(input);
    }

    private importWalletFromPrivateKey(privateKey: string): Signer {
        validatePrivateKey(privateKey);

        return new Wallet(privateKey);
    }

    private importWalletFromMnemonic(mnemonic: string): Signer {
        return Wallet.fromPhrase(mnemonic);
    }
}

export const signerService = new SignerService();
