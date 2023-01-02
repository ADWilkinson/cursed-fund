import doubloonLogo from "assets/brand/dbl.png";

export interface Token {
  name: string;
  symbol: string;
  address: string | undefined;
  polygonAddress: string | undefined;
  optimismAddress: string | undefined;
  arbitrumAddress: string | undefined;
  decimals: number;
  url: string;
  image: string;
  coingeckoId: string;
}

export const USDC: Token = {
  name: "USD Coin",
  symbol: "USDC",
  image:
    "https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png?1547042389",
  address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  polygonAddress: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
  optimismAddress: "0x7f5c764cbc14f9669b88837ca1490cca17c31607",
  arbitrumAddress: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
  decimals: 6,
  url: "",
  coingeckoId: "usd-coin",
};

export const ETH: Token = {
  name: "Ethereum",
  symbol: "ETH",
  image:
    "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
  address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
  polygonAddress: "",
  optimismAddress: "",
  arbitrumAddress: "",
  decimals: 18,
  url: "",
  coingeckoId: "ethereum",
};

export const WETH: Token = {
  name: "Wrapped Ether",
  symbol: "WETH",
  image:
    "https://assets.coingecko.com/coins/images/2518/small/weth.png?1628852295",
  address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  polygonAddress: "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
  optimismAddress: "0x4200000000000000000000000000000000000006",
  arbitrumAddress: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
  decimals: 18,
  url: "",
  coingeckoId: "weth",
};

export const DoubloonToken: Token = {
  name: "Doubloon",
  symbol: "DBL",
  address: "0x75c7A5Ee75B63792F074c698E1E2004676E8589e",
  polygonAddress: undefined,
  optimismAddress: undefined,
  arbitrumAddress: "0xd3f1Da62CAFB7E7BC6531FF1ceF6F414291F03D3",
  decimals: 18,
  url: "doubloon",
  image: doubloonLogo,
  coingeckoId: "doubloon",
};

export const tokens = [ETH, USDC, WETH, DoubloonToken];
