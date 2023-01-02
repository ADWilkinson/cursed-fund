import { BigNumber } from "@ethersproject/bignumber";

import { useBalance } from "hooks/useBalance";
import {
  TokenMarketDataValues,
  useMarketData,
} from "providers/MarketData/MarketDataProvider";
import { displayFromWei } from "utils";

interface UserTokenBalance {
  symbol: string;
  balance: BigNumber;
  fiat: number;
  marketData: TokenMarketDataValues;
}

function getTokenMarketDataValuesOrNull(
  symbol: string,
  marketDataValues: TokenMarketDataValues | undefined,
  balance: BigNumber | undefined
): UserTokenBalance | undefined {
  if (
    marketDataValues === undefined ||
    marketDataValues.hourlyPrices === undefined
  ) {
    return undefined;
  }

  if (balance === undefined || balance.isZero() || balance.isNegative()) {
    balance = BigNumber.from(0);
  }

  const convertedBalance = displayFromWei(balance);
  const balanceNum = parseFloat(convertedBalance ?? "0");
  const hourlyData = marketDataValues.hourlyPrices.map(([date, price]) => [
    date,
    price * balanceNum,
  ]);
  const hourlyPricesLength = hourlyData ? hourlyData.length - 1 : 0;
  const fiat = hourlyData ? hourlyData[hourlyPricesLength][1] : 0;

  return { symbol, balance, fiat, marketData: { hourlyPrices: hourlyData } };
}

function getTotalHourlyPrices(marketData: UserTokenBalance[]) {
  const hourlyPricesOnly = marketData.map(
    (data) => data.marketData.hourlyPrices ?? []
  );
  let totalHourlyPrices: number[][] = [];
  if (hourlyPricesOnly.length > 0) {
    totalHourlyPrices = hourlyPricesOnly[0];
    const length = hourlyPricesOnly[0].length;
    for (let i = 1; i < hourlyPricesOnly.length; i += 1) {
      for (let k = 0; k < length; k += 1) {
        if (k >= hourlyPricesOnly[i].length) {
          continue;
        }
        totalHourlyPrices[k][1] += hourlyPricesOnly[i][k][1];
      }
    }
  }
  return totalHourlyPrices;
}

export const useUserMarketData = () => {
  const {
    balances: { ethBalance, wethBalance, usdcBalance, doubloonBalance },
  } = useBalance();
  const { eth, weth, usdc, dbl } = useMarketData();

  const balances = [
    { title: "ETH", value: ethBalance },
    { title: "WETH", value: wethBalance },
    { title: "USDC", value: usdcBalance },
    { title: "DBL", value: doubloonBalance },
  ];

  const userBalances: UserTokenBalance[] = balances
    .map((pos) => {
      switch (pos.title) {
        case "ETH":
          return getTokenMarketDataValuesOrNull(pos.title, eth, pos.value);
        case "WETH":
          return getTokenMarketDataValuesOrNull(pos.title, weth, pos.value);
        case "USDC":
          return getTokenMarketDataValuesOrNull(pos.title, usdc, pos.value);
        case "DBL":
          return getTokenMarketDataValuesOrNull(pos.title, dbl, pos.value);
        default:
          return undefined;
      }
    })
    // Remove undefined
    .filter((tokenData): tokenData is UserTokenBalance => !!tokenData);

  const totalHourlyPrices = getTotalHourlyPrices(userBalances);

  return { userBalances, totalHourlyPrices };
};
