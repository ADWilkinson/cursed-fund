import { ARBITRUM, OPTIMISM, POLYGON } from "constants/chains";
import { ETH } from "constants/tokens";

const baseURL = "https://pro-api.coingecko.com/api/v3";
const key = `&x_cg_pro_api_key=${
  process.env.REACT_APP_COINGECKO_PRO_API_KEY ?? ""
}`;
export const fetchHistoricalTokenMarketData = async (
  id: string,
  baseCurrency = "usd"
) => {
  const coingeckoMaxTokenDataUrl =
    baseURL +
    `/coins/${id}/market_chart?vs_currency=${baseCurrency}&days=max&interval=daily${key}`;
  const coingeckoHourlyTokenDataUrl =
    baseURL +
    `/coins/${id}/market_chart?vs_currency=${baseCurrency}&days=90${key}`;

  return Promise.all([
    fetch(coingeckoMaxTokenDataUrl),
    fetch(coingeckoHourlyTokenDataUrl),
  ])
    .then((responses) =>
      Promise.all(responses.map((response) => response.json()))
    )
    .then((data) => {
      const hourlyPrices = data[1].prices,
        marketcaps = data[0].market_caps,
        volumes = data[0].total_volumes;

      return { hourlyPrices, marketcaps, volumes };
    })
    .catch((error) => {
      console.log(error);
      return { hourly: [], marketcaps: [], volumes: [] };
    });
};

const getAssetPlatform = (chainId: number) => {
  if (chainId === POLYGON.chainId) return "polygon-pos";
  if (chainId === OPTIMISM.chainId) return "optimistic-ethereum";
  if (chainId === ARBITRUM.chainId) return "arbitrum-one";
  return "ethereum";
};

export const fetchCoingeckoTokenPrice = async (
  address: string,
  chainId: number,
  baseCurrency = "usd"
): Promise<number> => {
  if (address === ETH.address) {
    const getPriceUrl =
      baseURL +
      `/simple/price/?ids=ethereum&vs_currencies=${baseCurrency}${key}`;

    const resp = await fetch(getPriceUrl);

    const data = await resp.json().catch((err) => {
      return 0;
    });

    if (data === 0 || !data["ethereum"]) return 0;

    return data["ethereum"][baseCurrency];
  }

  const getPriceUrl =
    baseURL +
    `/simple/token_price/${getAssetPlatform(
      chainId
    )}/?contract_addresses=${address}&vs_currencies=${baseCurrency}${key}`;

  const resp = await fetch(getPriceUrl);

  const data = await resp.json().catch((err) => {
    return 0;
  });

  if (data === 0 || !data[address.toLowerCase()]) return 0;

  return data[address.toLowerCase()][baseCurrency];
};
