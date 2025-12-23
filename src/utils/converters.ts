import { Wallet, parseEther, formatEther, type BigNumberish } from "ethers";
import { validatePrivateKey } from "./validators";

export function privateKeyToAddress(pvKey: string): string {
    validatePrivateKey(pvKey);

    return new Wallet(pvKey).address;
}

// 0.0001 ===> 100000000000000n
export function etherToWei(ethAmount: string): bigint {
    return parseEther(ethAmount);
}

// 100000000000000n ===> 0.0001
export function weiToEther(weiAmount: BigNumberish): string {
    return formatEther(weiAmount);
}
