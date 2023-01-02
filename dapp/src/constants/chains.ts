export type ChainData = {
  name: string;
  alias?: string;
  chainId: number;
  chainId0x: string;
  rpcUrl: string;
  icon: string;
  coingeckoId: string;
  blockExplorerUrl: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
};

export const MAINNET: ChainData = {
  name: "Ethereum",
  alias: "Mainnet",
  chainId: 1,
  chainId0x: "0x1",
  rpcUrl: "https://mainnet.eth.aragon.network/",
  icon: "https://raw.githubusercontent.com/sushiswap/icons/master/network/mainnet.jpg",
  coingeckoId: "ethereum",
  blockExplorerUrl: "https://etherscan.io/",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
};

export const POLYGON: ChainData = {
  name: "Polygon",
  chainId: 137,
  chainId0x: "0x89",
  rpcUrl: "https://rpc-mainnet.maticvigil.com/",
  icon: "https://raw.githubusercontent.com/sushiswap/icons/master/network/polygon.jpg",
  coingeckoId: "polygon-pos",
  blockExplorerUrl: "https://polygonscan.com/",
  nativeCurrency: {
    name: "Matic",
    symbol: "MATIC",
    decimals: 18,
  },
};

export const OPTIMISM: ChainData = {
  name: "Optimism",
  chainId: 10,
  chainId0x: "0xA",
  rpcUrl: "https://mainnet.optimism.io/",
  icon: "https://raw.githubusercontent.com/ethereum-optimism/brand-kit/main/assets/images/Profile-Logo.png",
  coingeckoId: "optimistic-ethereum",
  blockExplorerUrl: "https://optimistic.etherscan.io/",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
};

export const ARBITRUM: ChainData = {
  name: "Arbitrum",
  chainId: 42161,
  chainId0x: "0xA4B1",
  rpcUrl: "https://arb1.arbitrum.io/rpc",
  icon: "https://raw.githubusercontent.com/OffchainLabs/arbitrum/master/docs/assets/arbitrum_logo.svg",
  coingeckoId: "arbitrum-one",
  blockExplorerUrl: "https://arbiscan.io/",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
};

export const SUPPORTED_CHAINS = [MAINNET, ARBITRUM, OPTIMISM];
