import { Wallet, isHexString, Mnemonic } from "ethers";
import type { Signer } from "ethers";

class SignerService {
    // This contains both private key and mnemonic wallet
    public newWallet(): Signer {
        return Wallet.createRandom();
    }

    public importWallet(
        input: string,
        walletType: "private-key" | "mnemonic",
    ): Signer {
        return walletType === "private-key"
            ? this.importWalletFromPrivateKey(input)
            : this.importWalletFromMnemonic(input);
    }

    private importWalletFromPrivateKey(privateKey: string): Signer {
        if (!privateKey.startsWith("0x")) {
            throw new Error("private key must start with 0x");
        }

        if (!isHexString(privateKey, 32)) {
            throw new Error("invalid private key");
        }

        return new Wallet(privateKey);
    }

    private importWalletFromMnemonic(mnemonic: string): Signer {
        if (!Mnemonic.isValidMnemonic(mnemonic)) {
            throw new Error("invalid mnemonic phrase");
        }

        return Wallet.fromPhrase(mnemonic);
    }
}

export const signerService = new SignerService();
