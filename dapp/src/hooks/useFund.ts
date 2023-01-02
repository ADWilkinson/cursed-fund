import { useCallback, useEffect, useState } from "react";

import { BigNumber, Contract, providers } from "ethers";

import { useEtherBalance } from "@usedapp/core";

import {  ETH, Token, USDC, WETH } from "constants/tokens";
import { useAccount } from "hooks/useAccount";
import { useNetwork } from "hooks/useNetwork";
import { ERC20_ABI } from "utils/abi/ERC20";

import { useWaitForTransaction } from "./useWaitForTransaction";
import { cursedFundAddress } from "constants/index";
import { displayFromWei } from "utils";

type Balance = BigNumber;

export interface Balances {
  ethBalance?: BigNumber;
  fundUsdc?: BigNumber;
  fundWeth?: BigNumber;
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
    const balance = await erc20.balanceOf(cursedFundAddress);
    console.log(displayFromWei(balance));
    
    return balance;
  } catch (error) {
    console.log("balance fetch issue: ", error);
  }
}

export const useFund = () => {
  const { account, provider } = useAccount();
  const { pendingTxState } = useWaitForTransaction();
  const { chainId } = useNetwork();
  const ethBalance = useEtherBalance(cursedFundAddress);

  const [fundWeth, setFundWeth] = useState<Balance>(BigNumber.from(0));
  const [fundUsdc, setFundUsdc] = useState<Balance>(BigNumber.from(0));

  useEffect(() => {
    if (!account || !chainId) return;
    const web3Provider = provider as providers.JsonRpcProvider;
    const fetchAllBalances = async () => {
      const fundUsdc = await balanceOf(USDC, cursedFundAddress, web3Provider);
      const fundWeth = await balanceOf(WETH, cursedFundAddress, web3Provider);

      setFundUsdc(fundUsdc);
      setFundWeth(fundWeth);
    };

    fetchAllBalances();
  }, [account, chainId, pendingTxState]);

  const getBalance = useCallback(
    (tokenSymbol: string): BigNumber | undefined => {
      switch (tokenSymbol) {
        case ETH.symbol:
          return ethBalance;
        case USDC.symbol:
          return fundUsdc;
        case WETH.symbol:
          return fundWeth;
        default:
          return undefined;
      }
    },
    [ethBalance, fundUsdc, fundWeth]
  );

  const balances = {
    ethBalance,
    fundUsdc,
    fundWeth,
  };

  return { balances, getBalance };
};
