import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  ETH,
  USDC,
  WETH,
  DoubloonToken
} from "constants/tokens";
import { fetchHistoricalTokenMarketData } from "utils/coingeckoApi";

export interface TokenMarketDataValues {
  prices?: number[][];
  hourlyPrices?: number[][];
  marketcaps?: number[][];
  volumes?: number[][];
}

export interface TokenContext {
  eth?: TokenMarketDataValues;
  weth?: TokenMarketDataValues;
  usdc?: TokenMarketDataValues;
  dbl?: TokenMarketDataValues;

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
      fetchHistoricalTokenMarketData(ETH.coingeckoId),
      fetchHistoricalTokenMarketData(WETH.coingeckoId),
      fetchHistoricalTokenMarketData(USDC.coingeckoId),
      fetchHistoricalTokenMarketData(DoubloonToken.coingeckoId),
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
