import {
    JsonRpcApiProvider,
    JsonRpcProvider,
    type TransactionResponse,
    type TransactionReceipt,
    type Block,
    type FeeData,
    type TransactionRequest,
} from "ethers";

const RPC_URL = import.meta.env.VITE_RPC_URL;
if (!RPC_URL) {
    throw new Error("VITE_RPC_URL is not defined");
}

class EthService {
    private client: JsonRpcApiProvider;

    constructor(rpcUrl: string) {
        this.client = new JsonRpcProvider(rpcUrl);
    }

    public setProvider(rpcUrl: string): void {
        this.client = new JsonRpcProvider(rpcUrl);
    }

    public getTx(hash: string): Promise<null | TransactionResponse> {
        return this.client.getTransaction(hash);
    }

    public getTxReceipt(hash: string): Promise<null | TransactionReceipt> {
        return this.client.getTransactionReceipt(hash);
    }

    public getBlockNumber(): Promise<number> {
        return this.client.getBlockNumber();
    }

    public getBalance(address: string): Promise<bigint> {
        return this.client.getBalance(address);
    }

    public getBlock(blockNumber: number | "latest"): Promise<null | Block> {
        return this.client.getBlock(blockNumber);
    }

    public getFeeData(): Promise<FeeData> {
        return this.client.getFeeData();
    }

    public estimateGas(tx: TransactionRequest): Promise<bigint> {
        return this.client.estimateGas(tx);
    }
}

export const ethService = new EthService(RPC_URL);
