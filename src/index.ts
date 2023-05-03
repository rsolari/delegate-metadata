import { ethers } from 'ethers';

interface Delegate {
  delegateAddress: string;
  tokenAddress: string;
  tokenChainId: number;
}

class DelegateRegistry {
  private readonly contractAddress: string;
  private readonly abi: any;
  private readonly signerOrProvider: ethers.Signer | ethers.providers.Provider;
  private readonly contract: ethers.Contract;

  constructor(
    contractAddress: string,
    signerOrProvider: ethers.Signer | ethers.providers.Provider
  ) {
    this.contractAddress = contractAddress;
    this.abi = [
      'function delegates(address,address,uint256) view returns (address delegateAddress, address tokenAddress, uint256 tokenChainId)',
      'function registerDelegate(address,uint256,bytes)',
      'function deregisterDelegate()',
      'function updateDelegateMetadata(address,uint256,bytes)',
    ];
    this.signerOrProvider = signerOrProvider;
    this.contract = new ethers.Contract(this.contractAddress, this.abi, this.signerOrProvider);
  }

  async getDelegate(
    delegateAddress: string,
    tokenAddress: string,
    tokenChainId: number
  ): Promise<Delegate> {
    const [delegate] = await this.contract.delegates(delegateAddress, tokenAddress, tokenChainId);
    return delegate;
  }

  async registerDelegate(
    tokenAddress: string,
    tokenChainId: number,
    metadata: string
  ): Promise<void> {
    await this.contract.registerDelegate(tokenAddress, tokenChainId, metadata);
  }

  async deregisterDelegate(): Promise<void> {
    await this.contract.deregisterDelegate();
  }

  async updateDelegateMetadata(
    tokenAddress: string,
    tokenChainId: number,
    metadata: string
  ): Promise<void> {
    await this.contract.updateDelegateMetadata(tokenAddress, tokenChainId, metadata);
  }
}

export default DelegateRegistry;
