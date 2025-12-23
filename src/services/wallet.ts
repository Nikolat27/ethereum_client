import type {
    Signer,
    TransactionRequest,
    TransactionResponse,
    TransactionLike,
    Provider,
} from "ethers";

export class WalletService {
    private readonly signer: Signer;

    constructor(signer: Signer) {
        this.signer = signer;
    }

    private withProvider(provider: Provider): Signer {
        return this.signer.connect(provider);
    }

    public getAddress(): Promise<string> {
        return this.signer.getAddress();
    }

    public populateTransaction(
        tx: TransactionRequest,
        provider: Provider,
    ): Promise<TransactionLike<string>> {
        return this.withProvider(provider).populateTransaction(tx);
    }

    public estimateGas(
        tx: TransactionRequest,
        provider: Provider,
    ): Promise<bigint> {
        return this.withProvider(provider).estimateGas(tx);
    }

    public signTransaction(tx: TransactionRequest): Promise<string> {
        return this.signer.signTransaction(tx);
    }

    public sendTransaction(
        tx: TransactionRequest,
        provider: Provider,
    ): Promise<TransactionResponse> {
        return this.withProvider(provider).sendTransaction(tx);
    }
}
