import {
    JsonRpcApiProvider,
    JsonRpcProvider,
    type TransactionResponse,
    type TransactionReceipt,
    type Block,
    type FeeData,
    type TransactionRequest,
    type Network,
} from "ethers";

// Initialize RPC URL
const getInitialRpcUrl = (): string => {
    const savedUrl = localStorage.getItem("rpcUrl");

    if (savedUrl) return savedUrl;

    // No RPC URL configured - user must set one manually
    return "http://localhost:8545";
};

class EthService {
    private client: JsonRpcApiProvider;
    private currentRpcUrl: string;
    private currentNetwork: Network | null = null;

    constructor(rpcUrl: string) {
        this.currentRpcUrl = rpcUrl;
        this.client = new JsonRpcProvider(rpcUrl);
        this.detectNetwork();
    }

    // Detect network information
    private async detectNetwork(): Promise<void> {
        console.log('EthService: Attempting to detect network for URL:', this.currentRpcUrl);
        try {
            this.currentNetwork = await this.client.getNetwork();
            console.log('EthService: Network detected successfully');
        } catch (error) {
            console.warn("Could not detect network:", error);
            this.currentNetwork = { name: "unknown", chainId: 0n } as Network;
        }
    }

    // Set new RPC provider
    public setProvider(rpcUrl: string): void {
        this.currentRpcUrl = rpcUrl;
        this.client = new JsonRpcProvider(rpcUrl);
        localStorage.setItem("rpcUrl", rpcUrl);
        this.detectNetwork();
    }

    // Get current RPC URL
    public getCurrentRpcUrl(): string {
        return this.currentRpcUrl;
    }

    // Get current network
    public getCurrentNetwork(): Network | null {
        return this.currentNetwork;
    }

    // Get human-readable network name
    public getNetworkName(): string {
        if (!this.currentNetwork) return "Unknown Network";

        const chainId = Number(this.currentNetwork.chainId);
        const networkNames: Record<number, string> = {
            1: "Ethereum Mainnet",
            11155111: "Sepolia Testnet",
            5: "Goerli Testnet",
            137: "Polygon",
            80001: "Polygon Mumbai",
            42161: "Arbitrum",
            421613: "Arbitrum Goerli",
            10: "Optimism",
            420: "Optimism Goerli",
            56: "Binance Smart Chain",
            97: "BSC Testnet"
        };

        return networkNames[chainId] || `Chain ${chainId}`;
    }

    // Test RPC connection
    public async testConnection(rpcUrl?: string): Promise<boolean> {
        const urlToTest = rpcUrl || this.currentRpcUrl;

        // Don't test connection to localhost unless explicitly requested
        if (urlToTest === "http://localhost:8545") {
            console.log("Skipping connection test for localhost - no node configured");
            return false;
        }

        try {
            const testProvider = new JsonRpcProvider(urlToTest);
            await Promise.race([
                testProvider.getBlockNumber(),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error("Connection timeout")), 5000)
                )
            ]);
            return true;
        } catch (error) {
            console.error("RPC connection test failed:", error);
            return false;
        }
    }

    // Blockchain methods
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
        // Don't make requests to localhost
        if (this.currentRpcUrl === "http://localhost:8545") {
            console.log("Skipping balance request - no node configured");
            return Promise.resolve(0n);
        }

        console.log('EthService: getBalance called for address:', address);
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

export const ethService = new EthService(getInitialRpcUrl());
