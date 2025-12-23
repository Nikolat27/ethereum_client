import { isHexString } from "ethers";
import { Mnemonic } from "ethers";

export function validatePrivateKey(pvKey: string) {
    if (!pvKey.startsWith("0x")) {
        throw new Error("private key must start with 0x");
    }

    if (!isHexString(pvKey, 32)) {
        throw new Error("invalid private key");
    }
}

export function validateMnemonic(mnemonic: string) {
    if (!Mnemonic.isValidMnemonic(mnemonic)) {
        throw new Error("invalid mnemonic phrase");
    }
}
