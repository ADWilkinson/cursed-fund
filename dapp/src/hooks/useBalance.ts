import { useCallback, useEffect, useState } from "react";

import { BigNumber, Contract, providers } from "ethers";

import { useEtherBalance, useTokenBalance } from "@usedapp/core";

import { DoubloonToken, ETH, Token, USDC, WETH } from "constants/tokens";
import { useAccount } from "hooks/useAccount";
import { useNetwork } from "hooks/useNetwork";
import { ERC20_ABI } from "utils/abi/ERC20";

import { useWaitForTransaction } from "./useWaitForTransaction";

type Balance = BigNumber;

export interface Balances {
  ethBalance?: BigNumber;
  usdcBalance?: BigNumber;
  wethBalance?: BigNumber;
}

/* Returns balance of ERC20 token */
async function balanceOf(
  token: Token,
  account: string,
  library: providers.JsonRpcProvider | undefined
): Promise<BigNumber> {
  try {
    const tokenAddress = token.arbitrumAddress;
    if (!tokenAddress) return BigNumber.from(0);
    const erc20 = new Contract(tokenAddress, ERC20_ABI, library);
    const balance = await erc20.balanceOf(account);
    return balance;
  } catch (error) {
    console.log("balance fetch issue: ", error);
  }
}

export const useBalance = () => {
  const { account, provider } = useAccount();
  const { pendingTxState } = useWaitForTransaction();
  const { chainId } = useNetwork();
  const ethBalance = useEtherBalance(account);

  const [doubloonBalance, setDoubloonBalance] = useState<Balance>(
    BigNumber.from(0)
  );
  const [usdcBalance, setUsdcBalance] = useState<Balance>(BigNumber.from(0));
  const [wethBalance, setWethBalance] = useState<Balance>(BigNumber.from(0));

  useEffect(() => {
    if (!account || !chainId) return;
    const web3Provider = provider as providers.JsonRpcProvider;
    const fetchAllBalances = async () => {
      const dbl = await balanceOf(DoubloonToken, account, web3Provider);
      const usdc = await balanceOf(USDC, account, web3Provider);
      const weth = await balanceOf(WETH, account, web3Provider);

      setDoubloonBalance(dbl);
      setUsdcBalance(usdc);
      setWethBalance(weth);
    };

    fetchAllBalances();
  }, [account, pendingTxState]);

  const getBalance = useCallback(
    (tokenSymbol: string): BigNumber | undefined => {
      switch (tokenSymbol) {
        case DoubloonToken.symbol:
          return doubloonBalance;
        case ETH.symbol:
          return ethBalance;
        case USDC.symbol:
          return usdcBalance;
        case WETH.symbol:
          return wethBalance;
        default:
          return undefined;
      }
    },
    [doubloonBalance, ethBalance, usdcBalance, wethBalance]
  );

  const balances = {
    ethBalance,
    usdcBalance,
    wethBalance,
    doubloonBalance,
  };

  return { balances, getBalance };
};
