import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { ETH, USDC, WETH, DoubloonToken } from "constants/tokens";
import { fetchCoingeckoTokenPrice } from "utils/coingeckoApi";
import { ARBITRUM, MAINNET } from "constants/chains";

export interface TokenContext {
  eth?: number;
  weth?: number;
  usdc?: number;
  dbl?: number;

  selectLatestMarketData: (...args: any) => number;
}

export type TokenContextKeys = keyof TokenContext;

export const MarketDataContext = createContext<TokenContext>({
  selectLatestMarketData: () => 0,
});

export const useMarketData = () => useContext(MarketDataContext);

export const MarketDataProvider = (props: { children: any }) => {
  const [ethMarketData, setEthMarketData] = useState<any>({});
  const [wethMarketData, setWethMarketData] = useState<any>({});
  const [usdcMarketData, setUsdcMarketData] = useState<any>({});
  const [dblMarketData, setDblMarketData] = useState<any>({});

  const selectLatestMarketData = (marketData?: number[][]) =>
    marketData?.[marketData.length - 1]?.[1] || 0;

  const fetchMarketData = useCallback(async () => {
    const marketData = await Promise.all([
      fetchCoingeckoTokenPrice(ETH.address, MAINNET.chainId, "usd"),
      fetchCoingeckoTokenPrice(WETH.address, MAINNET.chainId, "usd"),
      fetchCoingeckoTokenPrice(USDC.address, MAINNET.chainId, "usd"),
      fetchCoingeckoTokenPrice(DoubloonToken.address, ARBITRUM.chainId, "usd"),
    ]);

    setEthMarketData(marketData[0]);
    setWethMarketData(marketData[1]);
    setUsdcMarketData(marketData[2]);
    setDblMarketData(marketData[3]);
  }, []);

  useEffect(() => {
    fetchMarketData();
  }, [fetchMarketData]);

  return (
    <MarketDataContext.Provider
      value={{
        selectLatestMarketData,
        eth: ethMarketData,
        weth: wethMarketData,
        usdc: usdcMarketData,
        dbl: dblMarketData,
      }}
    >
      {props.children}
    </MarketDataContext.Provider>
  );
};
