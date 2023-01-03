import { useEffect, useState } from "react";
import { Box, Image } from "@chakra-ui/react";
import Page from "components/Page";
import PageTitle from "components/PageTitle";
import { ARBITRUM } from "constants/chains";
import { displayFromWei } from "utils";
import { useNetwork } from "hooks/useNetwork";
import { useAccount } from "hooks/useAccount";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "index";
import { useBalance } from "hooks/useBalance";
import { DoubloonToken, ETH, USDC, WETH } from "constants/tokens";
import { useEthers, useSendTransaction, useTokenBalance } from "@usedapp/core";
import dbl from "assets/brand/dbl.png";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import {
  BEARISH,
  BULLISH,
  CONTROL_COLLECTION,
  CONTROL_ARBISCAN,
  CONTROL_ADDRESS,
  ETH_MINIMUM,
} from "constants/index";
import ConnectButton from "components/header/ConnectButton";
import { utils } from "ethers";

const ControlExperiment = () => {
  const { balances } = useBalance();
  const { account } = useAccount();
  const { chainId, changeNetwork } = useNetwork();
  const [isBullish, setIsBullish] = useState<boolean | null>(null);
  const [control, setControl] = useState<any>({ isBullish: isBullish, account: '', txStatus: '', timestamp: 0 });
  const { sendTransaction, state } = useSendTransaction()
  const [currentWinner, setCurrentWinner] = useState<string>('');
  const [winnerSentiment, setWinnerSentiment] = useState<boolean>(false);

  const getMostFrequent = (arr: any[]) => {
    const hashmap = arr.reduce((acc, val) => {
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(hashmap).reduce((a, b) => (hashmap[a] > hashmap[b] ? a : b));
  }

  useEffect(() => {
    try {
      if (state.transaction) {
        setDoc(
          doc(db, CONTROL_COLLECTION, state.transaction.hash),
          { isBullish: isBullish, account: account, timestamp: Date.now() },
          { merge: true }
        ).then(() => {
          console.log("Transaction successfully stored")
        })
      }
    } catch (error) {
      console.log(error);
    }
  }, [state])

  useEffect(() => {
    getDocs(collection(db, CONTROL_COLLECTION)).then((snapshot) => {
      const accountData = snapshot.docs.map((doc: any) => doc.data());
      const accountNames = accountData.map((data: any) => data.account);
      const winner = getMostFrequent(accountNames);
      setCurrentWinner(winner);

      const sentiment = accountData
        .filter((data: any) => data.account === winner)
        .sort((x: any, y: any) => {
          return x.timestamp - y.timestamp;
        })
        .pop().isBullish;
      setWinnerSentiment(sentiment);
    });
  }, [account, state, chainId])

  const fundUsdcBalance = useTokenBalance(
    USDC.arbitrumAddress,
    CONTROL_ADDRESS,
    { chainId: ARBITRUM.chainId }
  );
  const fundWethBalance = useTokenBalance(
    WETH.arbitrumAddress,
    CONTROL_ADDRESS,
    { chainId: ARBITRUM.chainId }
  );

  useEffect(() => {
    if (!account) return;
    const controlQuery = query(collection(db, CONTROL_COLLECTION), orderBy("timestamp", 'desc'), limit(1));
    getDocs(controlQuery).then((doc) => {
      setControl(
        doc.docs.pop().data()
      );
    });
  }, [account, state, chainId]);

  const pushSentiment = async (sentiment: string) => {
    if (sentiment === BULLISH) {
      console.log("Bullish", account);
      setIsBullish(true);
    } else if (sentiment === BEARISH) {
      console.log("Bearish", account);
      setIsBullish(false);
    } else {
      throw new Error(`Invalid sentiment: ${sentiment}`);
    }
    await sendTransaction({ to: CONTROL_ADDRESS, value: utils.parseEther("0.001") })
  };

  return (
    <Page>
      <>
        <PageTitle
          title="Control Point Fund"
          subtitle="Capture the point, allocate the fund and wins 1%."
        />

        {/* SENTIMENT VOTE  */}
        <div className="block col-span-1 md:w-1/2 m-auto bg-theme-pan-champagne border-t border-b border-theme-pan-navy  divide-y divide-theme-pan-navy">
          <div className="block border-none">
            <p className="text-xl text-theme-pan-sky pt-6 font-bold  m-auto text-center justify-center">
              1000 USDC to allocate
            </p>
            <p className="text-xl text-theme-pan-navy  m-auto text-center justify-center">
              Tag us on Twitter<br></br>
              <a
                className="hover:text-theme-pan-sky"
                href="https://twitter.com/CursedFund"
                target={"_blank"} rel="noreferrer"
              >
                @CursedFund
              </a>
            </p>
          </div>
          <div className="w-full items-center justify-between p-6 border-none space-x-6">
            {account && chainId && chainId === ARBITRUM.chainId ? (
              <div className="text-theme-pan-navy">
                <div>
                  {control.account.toLowerCase() && control.account.toLowerCase() === account.toLowerCase() ? (
                    <div className="border-t border-b border-theme-pan-navy mb-3">
                      <p className="text-md text-theme-pan-navy font-bold pb-3 pt-3 ">
                        You have control of the point! Great job.
                      </p>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>

                <div>
                  {parseFloat(displayFromWei(balances.ethBalance, 3)) < ETH_MINIMUM ? (
                    <div className="border-t border-b border-theme-pan-navy mb-3">
                      <span className="font-bold inline-flex items-center py-0.5 text-md text-theme-pan-navy">
                        Insufficient Balance:{" "}
                        <span className=" pl-2 text-theme-sky">
                          {displayFromWei(balances.ethBalance, 3)}
                        </span>
                        <Box
                          className="justify-start  pl-2  text-left "
                          mt="16px"
                        >
                          <Image
                            className="-translate-y-1.5"
                            height={["25", "25"]}
                            borderRadius={"25"}
                            opacity={"100%"}
                            src={dbl}
                            alt="Chest Icon"
                          />{" "}
                        </Box>
                      </span>
                      <p className="text-md text-theme-pan-navy font-bold pb-3 ">
                        To participate in the Control Point Fund, {ETH_MINIMUM}{" "}
                        $ETH is required.
                      </p>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
                <span
                  className={
                    parseFloat(displayFromWei(balances.ethBalance, 3)) < ETH_MINIMUM ? "opacity-50" : ""
                  }
                >
                  <h3 className="text-lg font-bold leading-6 text-theme-pan-navy pb-3">
                    Capture
                  </h3>
                  <h1 className="">Ahoy ye no good sea rat,</h1>
                  <p className="">
                    Control the point by setting your $ETH market sentiment below at a 0.001 ETH cost. The deckhand with the most captures by the end of the week wins 1% of the fund.
                  </p>
                  <div className="flex m-auto justify-center">
                    <Box
                      className="justify-center text-center mx-auto "
                      mt="16px"
                    >
                      <Image
                        height={["50", "50"]}
                        borderRadius={"25"}
                        opacity={"100%"}
                        src={ETH.image}
                        alt="Chest Icon"
                      />{" "}
                    </Box>
                  </div>
                  <div className="m-auto flex justify-center py-2">
                    <button
                      disabled={control.account.toLowerCase() && control.account.toLowerCase() === account.toLowerCase()}
                      onClick={() => pushSentiment(BULLISH)}
                      type="button"
                      className="inline-flex  mx-2 items-center rounded-xl border disabled:bg-theme-pan-navy disabled:opacity-70 border-transparent bg-theme-pan-sky px-6 py-2 text-md text-white hover:opacity-80 focus:outline-none "
                    >
                      Bullish
                    </button>
                    <button
                      onClick={() => pushSentiment(BEARISH)}
                      disabled={control.account.toLowerCase() && control.account.toLowerCase() === account.toLowerCase()}
                      type="button"
                      className="inline-flex  mx-2 items-center rounded-xl border border-transparent disabled:bg-theme-pan-navy disabled:opacity-70 bg-theme-pan-navy px-6 py-2 text-md text-white hover:opacity-80 focus:outline-none"
                    >
                      Bearish
                    </button>
                  </div>

                  <>
                    <span className="flex pb-3  m-auto justify-center items-center rounded-xl mb-2 px-3 py-0.5 text-sm font-medium text-theme-pan-sky">

                      <span className="p-4 rounded-2xl bg-theme-white mt-4 border border-theme-pan-navy">
                        {control.account !== ''
                          ? <>
                            <p>
                              Controller: <span className="font-bold animate animate-pulse ">{control.account.slice(0, 6)}...{control.account.slice(control.account.length - 4, control.account.length)}</span>
                            </p>
                            <p>Controller Sentiment: <span className="font-bold animate animate-pulse ">{control.isBullish ? 'Bullish' : 'Bearish'}</span></p>
                            {currentWinner !== '' ? <>    <br></br>
                              <p>Leader: <span className="font-bold">{currentWinner.slice(0, 6)}...{currentWinner.slice(currentWinner.length - 4, currentWinner.length)}</span></p>
                              <p>Leader Sentiment <span className="font-bold">{winnerSentiment ? 'Bullish' : 'Bearish'}</span></p>
                              <p>Potential Reward: {parseFloat(displayFromWei(fundWethBalance, 2, 18)) > parseFloat(displayFromWei(fundUsdcBalance, 2, 6)) ? <>{(parseFloat(displayFromWei(fundWethBalance, 2, 18)) / 100).toFixed(3)} WETH</> : <>{(parseFloat(displayFromWei(fundUsdcBalance, 2, 6)) / 100).toFixed(2)} USDC</>}</p></> : <></>}
                          </>
                          : <></>}
                      </span>
                    </span>
                  </>

                  <h3 className="text-lg font-bold leading-6 text-theme-pan-navy pb-3">
                    Rules of Engagement
                  </h3>
                  <p className="pb-1">
                    <span className="font-bold">Every Sunday at 12:00 (UTC)</span> a snapshot will be taken, crowning the deckhand with the most point captures.
                    <span className="font-bold"></span> The winners sentiment will be used to determine the direction of the fund, <span className="font-bold">100% ETH or 100% USDC.
                    </span>
                  </p>
                  <br></br>
                  <p className="pb-1">
                    After the snapshot is taken,{" "}<span className="font-bold">1%</span> of the {" "}
                    <a
                      href={CONTROL_ARBISCAN}
                      target="_blank"
                      className="text-theme-pan-sky hover:opacity-80" rel="noreferrer"
                    >
                      fund
                    </a>{" "}
                    will be sent to the winner in either USDC or WETH. This is an experiment on balancing novel inflows and outflows of the fund to create sustainability.
                  </p>
                  <p className="pb-1">
                   
                  </p>
                </span>
                {displayFromWei(balances.ethBalance, 3) ? (
                  <></>
                ) : (
                  <>
                    <span className=" font-bold inline-flex items-center rounded-full py-0.5 text-md text-theme-pan-navy">
                      Balance:{" "}
                      <span className="text-theme-sky pl-2">
                        {displayFromWei(balances.ethBalance, 3)}
                      </span>
                    </span>{" "}
                    <div className="inline-flex pl-1 translate-y-1.5 justify-start">
                      <Box className="justify-start text-left " mt="16px">
                        <Image
                          height={["25", "25"]}
                          borderRadius={"25"}
                          opacity={"100%"}
                          src={dbl}
                          alt="Chest Icon"
                        />{" "}
                      </Box>
                    </div>{" "}
                  </>
                )}
              </div>
            ) : account && chainId ? (
              <>
                <div className=" px-2 pb-4 pt-4 sm:px-4">
                  <h3 className="text-xl leading-6 font-morion font-semibold text-theme-pan-navy">
                    Change Network
                  </h3>
                  <p className="mt-1 text-md text-theme-pan-navy">
                    The Cursed Fund is only operational on the Arbitrum
                    network.
                  </p>
                  <p>
                    Please switch network to vote your market sentiment using
                    $DBL.
                  </p>
                  <>
                    <button
                      onClick={() =>
                        changeNetwork(ARBITRUM.chainId.toString())
                      }
                      className="justify-left text-left block mt-4 bg-theme-pan-sky shadow-sm shadow-theme-black text-white  py-1.5 px-4 border border-theme-pan-sky rounded-xl text-base font-medium  hover:bg-opacity-75"
                    >
                      Switch to Arbitrum
                    </button>
                  </>
                </div>
              </>
            ) : <div className="justify-center text-center flex"><ConnectButton></ConnectButton></div>}
          </div>
        </div>

        {/* STATISTICS & REBALANCING  */}
        <div className="block mt-2 border-b border-theme-pan-navy col-span-1 md:w-1/2 m-auto bg-theme-pan-champagne mb-3 divide-y divide-theme-pan-navy">
          <div className="w-full items-center justify-between p-6 space-x-6">
            <div>
              <h3 className="text-lg font-bold leading-6 text-theme-pan-navy">
                Statistics & Rebalancing
              </h3>

              {account ? (
                <>
                  <div className="  ">
                    <h3 className="text-lg font-medium leading-6 text-theme-pan-navy">
                      Current Holdings
                    </h3>
                    <dl className="mt-5 mb-5 grid grid-cols-1 gap-5 sm:grid-cols-2 justify-center">
                      <div className="overflow-hidden rounded-lg bg-theme-white px-4 py-5 border border-theme-pan-navy sm:p-6">
                        <dt className="truncate text-sm font-bold text-theme-pan-navy">
                          WETH
                        </dt>
                        <dd className="mt-1 text-3xl font-semibold tracking-tight text-theme-pan-sky">
                          {" "}
                          <span className=" ">
                            {displayFromWei(fundWethBalance, 2, 18)}
                          </span>
                          <div className="inline-flex pr-2 translate-y-1.5 justify-start">
                            <Box className="justify-start text-left " mt="16px">
                              <Image
                                height={["35", "35"]}
                                borderRadius={"25"}
                                opacity={"100%"}
                                src={ETH.image}
                                alt="Chest Icon"
                              />{" "}
                            </Box>
                          </div>
                        </dd>
                      </div>

                      <div className="overflow-hidden rounded-lg bg-white px-4 py-5 border border-theme-pan-navy sm:p-6">
                        <dt className="truncate text-sm font-bold text-theme-pan-navy">
                          USDC
                        </dt>
                        <dd className="mt-1 text-3xl font-semibold tracking-tight text-theme-pan-sky">
                          {" "}
                          <span className=" ">
                            {displayFromWei(fundUsdcBalance, 2, 6)}
                          </span>
                          <div className="inline-flex pl-2 translate-y-1.5 justify-start">
                            <Box className="justify-start text-left " mt="16px">
                              <Image
                                height={["35", "35"]}
                                borderRadius={"25"}
                                opacity={"100%"}
                                src={USDC.image}
                                alt="Chest Icon"
                              />{" "}
                            </Box>
                          </div>
                        </dd>
                      </div>
                    </dl>
                  </div>
                </>
              ) : (
                <> </>
              )}

              <a
                href={CONTROL_ARBISCAN}
                target={"_blank"}
                className="mx-auto mt-6 overflow-hidden  text-center py-2 justify-center flex hover:opacity-70 items-center rounded-xl bg-theme-pan-navy  px-2.5 text-sm font-medium text-theme-pan-champagne" rel="noreferrer"
              >
                arbiscan.io/address/{CONTROL_ADDRESS}
              </a>
            </div>

            <div className="border-none pt-6 text-center text-theme-pan-navy">
              <p className="text-xl  font-bold">
                Pending{" "}
                {new Date(
                  new Date().setDate(
                    new Date().getDate() +
                    ((0 + 7 - new Date().getDay()) % 7 || 7)
                  )
                ).toDateString()}{" "}
                Rebalance (Currently)
              </p>

              <span className=" font-bold inline-flex items-center border-none py-0.5 text-xl ">
                WETH: {control.isBullish ? '100' : '0'}%
              </span>

              <div className="inline-flex pr-2 translate-y-1.5 justify-start">
                <Box className="justify-start text-left " mt="16px">
                  <Image
                    height={["30", "30"]}
                    borderRadius={"25"}
                    opacity={"100%"}
                    src={ETH.image}
                    alt="Chest Icon"
                  />{" "}
                </Box>
              </div>

              <span className=" font-bold inline-flex items-center border-none py-0.5 text-xl ">
                USDC: {!control.isBullish ? '100' : '0'}%
              </span>

              <div className="inline-flex pl-2 translate-y-1.5 justify-start">
                <Box className="justify-start text-left " mt="16px">
                  <Image
                    height={["30", "30"]}
                    borderRadius={"25"}
                    opacity={"100%"}
                    src={USDC.image}
                    alt="Chest Icon"
                  />{" "}
                </Box>
              </div>
            </div>
          </div>
        </div>
      </>
    </Page>
  );
};

export default ControlExperiment;
