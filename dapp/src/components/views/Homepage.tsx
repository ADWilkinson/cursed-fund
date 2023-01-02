import { useEffect, useState } from "react";
import { Box, Image } from "@chakra-ui/react";
import Page from "components/Page";
import PageTitle from "components/PageTitle";
import { ARBITRUM, SUPPORTED_CHAINS } from "constants/chains";
import { displayFromWei } from "utils";
import { useNetwork } from "hooks/useNetwork";
import { useAccount } from "hooks/useAccount";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "index";
import { useBalance } from "hooks/useBalance";
import { DoubloonToken, ETH, USDC } from "constants/tokens";
import { useEthers } from "@usedapp/core";
import dbl from 'assets/brand/dbl.png';
import { collection, getDocs } from "firebase/firestore";
import { BEARISH, BULLISH, COLLECTION, cursedFundArbiscan, DBL_MINIMUM } from "constants/index";
import { useFund } from "hooks/useFund";

const HomePage = () => {

  const { library } = useEthers()
  const { getBalance } = useBalance()
  const { balances } = useFund()
  const { account } = useAccount();
  const { chainId, changeNetwork } = useNetwork();
  const dblBalance = displayFromWei(getBalance(DoubloonToken.symbol))
  const fundWethBalance = displayFromWei(balances.fundWeth)
  const fundUsdcBalance = displayFromWei(balances.fundUsdc)
  const [isBullish, setIsBullish] = useState<boolean | null>(null);
  const [totalVotes, setTotalVotes] = useState<number>(0);
  const [totalBullish, setTotalBullish] = useState<number>(0);
  const [totalBearish, setTotalBearish] = useState<number>(0);
  const [percentBullish, setPercentBullish] = useState<number>(0);
  const [percentBearish, setPercentBearish] = useState<number>(0);

  const signText = async (text: string) => {
    const signer = library.getSigner()
    await signer.signMessage(text)
  };

  useEffect(() => {
    if (!account) return
    getDocs(collection(db, COLLECTION)).then(snapshot => {
      setTotalVotes(snapshot.size)

      setTotalBullish(snapshot.docs.filter(doc => {
        return doc.data().isBullish === true
      }).length);

      setTotalBearish(snapshot.docs.filter(doc => {
        return doc.data().isBullish === false
      }).length);

      setPercentBullish(Math.round((totalBullish / totalVotes) * 100))
      setPercentBearish(Math.round((totalBearish / totalVotes) * 100))
    })
  }, [account, totalVotes, totalBullish, totalBearish, isBullish])

  useEffect(() => {
    if (!account) return
    const docRef = doc(db, COLLECTION, account.toLowerCase());
    getDoc(docRef).then((doc) => {
      if (doc.exists()) {
        console.log("Document data:", doc.data());
        setIsBullish(doc.data().isBullish)
      } else {
        console.log("No document found");
      }
    }).catch((error) => {
      console.log("Error getting document:", error);
    });

    return () => {

    }
  }, [account, totalVotes, totalBullish, totalBearish])

  const pushSentiment = async (sentiment: string) => {
    if (parseFloat(dblBalance) < DBL_MINIMUM) {
      console.log("Not enough DBL to vote sentiment", dblBalance);
    } else {
      console.log("Balance meets DBL threshold to vote sentiment", dblBalance);
      await signText('I am voting ' + sentiment + ' for Cursed Fund')
      try {
        if (sentiment === BULLISH) {
          console.log("Bullish", account);
          await setDoc(doc(db, COLLECTION, account.toLowerCase()), { isBullish: true }, { merge: true });
          setIsBullish(true);
        } else if (sentiment === BEARISH) {
          console.log("Bearish", account);
          await setDoc(doc(db, COLLECTION, account.toLowerCase()), { isBullish: false }, { merge: true });
          setIsBullish(false);
        } else {
          throw new Error(`Invalid sentiment: ${sentiment}`);
        }
      } catch (error) {
        console.log(error);
      }
    }

    return
  }

  return (
    <Page>
      <>
        <PageTitle
          title="Cursed Fund"
          subtitle="A social experiment within Galleon & Cursed DAO"
        />
        <div className="">
          <div className="block col-span-1 w-1/2 m-auto bg-theme-pan-champagne border-t border-b border-theme-pan-navy  divide-y divide-theme-pan-navy">
            <div className="block border-none">
              <p className="text-xl text-theme-pan-sky pt-3 font-bold  m-auto text-center justify-center">10,000 USDC to allocate</p>
              <p className="text-xl text-theme-pan-navy pb-3  m-auto text-center justify-center">Join the crew<br></br><a className="hover:text-theme-pan-sky" href="https://discord.gg/galleondao" target={'_blank'}>discord.gg/galleondao</a></p>
              <a href="https://arbiscan.io/address/0x92d7577430dd9da64d96ab4ddf69bf8010f233aa" target={"_blank"} className="mx-auto  text-center py-2 justify-center flex hover:opacity-70 items-center rounded-xl bg-theme-pan-navy  px-2.5 text-sm font-medium text-theme-pan-champagne">
                arbiscan.io/address/0x92d7577430dd9da64d96ab4ddf69bf8010f233aa
              </a>
            </div>
            <div className="w-full items-center justify-between p-6 border-none space-x-6">

              {chainId && chainId === ARBITRUM.chainId ? (
                <div className="text-theme-pan-navy">
                  <h3 className="text-lg font-bold leading-6 text-theme-pan-navy pb-3">Sentiment Vote</h3>
                  <h1 className="">Deckhand,</h1>
                  <p className="">
                    Are you currently bullish or bearish on $ETH?
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
                      disabled={parseFloat(dblBalance) < DBL_MINIMUM}
                      onClick={() => pushSentiment(BULLISH)}
                      type="button"
                      className="inline-flex  mx-2 items-center rounded-xl border disabled:bg-theme-pan-navy disabled:opacity-70 border-transparent bg-theme-pan-sky px-6 py-2 text-md text-white hover:opacity-80 focus:outline-none "
                    >
                      Bullish
                    </button>
                    <button
                      disabled={parseFloat(dblBalance) < DBL_MINIMUM}
                      onClick={() => pushSentiment(BEARISH)}
                      type="button"
                      className="inline-flex  mx-2 items-center rounded-xl border border-transparent disabled:bg-theme-pan-navy disabled:opacity-70 bg-theme-pan-navy px-6 py-2 text-md text-white hover:opacity-80 focus:outline-none"
                    >
                      Bearish
                    </button>

                  </div>


                  {parseFloat(dblBalance) < DBL_MINIMUM ? <> </> : <>
                    <span className="flex pb-3 m-auto justify-center animate animate-pulse items-center rounded-xl mb-2 px-3 py-0.5 text-sm font-medium text-theme-pan-sky">
                      <svg className="-ml-1 mr-1.5 h-2 w-2 text-theme-pan-sky" fill="currentColor" viewBox="0 0 8 8">
                        <circle cx={4} cy={4} r={3} />
                      </svg>
                      <span className="font-bold">{isBullish === null ? 'You have not voted yet' : isBullish ? 'You are currently voted Bullish' : 'You are currently voted Bearish'}</span>
                    </span>
                  </>}



                  <p className="pb-1">
                    <span className="font-bold">Every week</span> the sentiment of our crew is automatically weighted to rebalance a <a href={cursedFundArbiscan} target="_blank" className="text-theme-pan-sky hover:opacity-80">wallet</a> between a 0-100% allocation to $ETH.
                  </p>
                  <p>
                    <span className="font-bold">Every month</span> 1% of the fund is withdrawn and distributed 20:80 between development & the DBL/WETH pool.
                  </p>

                  {parseFloat(dblBalance) < DBL_MINIMUM ?
                    <>
                      <span className=" font-bold animate animate-pulse inline-flex items-center rounded-full py-0.5 text-md text-theme-copper">
                        Insufficient Balance: {' '}
                        {parseFloat(dblBalance).toFixed(2)}
                      </span>
                      <p className="text-md text-theme-copper font-bold">To participate in Cursed Fund voting, 10000 $DBL is required.</p>

                    </>
                    : <><span className=" font-bold inline-flex items-center rounded-full py-0.5 text-md text-theme-pan-navy">
                      Balance: {' '}
                      {parseFloat(dblBalance).toFixed(2)}
                    </span> <div className="inline-flex pl-2 translate-y-1.5 justify-start">
                        <Box
                          className="justify-start text-left "
                          mt="16px"

                        >
                          <Image
                            height={["25", "25"]}
                            borderRadius={"25"}
                            opacity={"100%"}
                            src={dbl}
                            alt="Chest Icon"
                          />{" "}
                        </Box>
                      </div> </>}



                </div>
              ) : (
                <>
                  <div className=" px-2 pb-4 pt-4 sm:px-4">
                    <h3 className="text-xl leading-6 font-morion font-semibold text-theme-pan-navy">
                      Change Network
                    </h3>
                    <p className="mt-1 text-md text-theme-pan-navy">
                      The Cursed Fund is only operational on the Arbitrum network.
                    </p>
                    <p>Please switch network to vote your market sentiment using $DBL.</p>
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
              )}
            </div>


          </div>

          <div className="block mt-2 border-b border-theme-pan-navy col-span-1 w-1/2 m-auto bg-theme-pan-champagne mb-3 divide-y divide-theme-pan-navy">
            <div className="w-full items-center justify-between p-6 space-x-6">

              <div>
                <h3 className="text-lg font-bold leading-6 text-theme-pan-navy">Statistics & Rebalancing</h3>
                <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">

                  <div className="overflow-hidden rounded-lg  px-4 py-5 border border-theme-pan-navy sm:p-6">
                    <dt className="truncate text-md font-medium text-theme-pan-navy">Total Votes</dt>
                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-theme-pan-sky">{totalVotes}</dd>
                  </div>

                  <div className="overflow-hidden rounded-lg  px-4 py-5 border border-theme-pan-navy sm:p-6">
                    <dt className="truncate text-md font-medium text-theme-pan-navy">Total Bullish</dt>
                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-theme-pan-sky">{totalBullish}</dd>
                  </div>

                  <div className="overflow-hidden rounded-lg  px-4 py-5 border border-theme-pan-navy sm:p-6">
                    <dt className="truncate text-md font-medium text-theme-pan-navy">Total Bearish</dt>
                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-theme-pan-sky">{totalBearish}</dd>
                  </div>

                </dl>
              </div>
              <div className="border-none pt-8 text-center text-theme-pan-navy">
                <p className="text-xl  font-bold">Pending {new Date(new Date().setDate(new Date().getDate() + (((1 + 7 - new Date().getDay()) % 7) || 7))).toDateString()} Rebalance (Currently)</p>

                <span className=" font-bold inline-flex items-center border-none py-0.5 text-xl ">
                  WETH: {' '}
                  {percentBullish && percentBullish}%
                </span>

                <div className="inline-flex pr-2 translate-y-1.5 justify-start">
                  <Box
                    className="justify-start text-left "
                    mt="16px"

                  >
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
                  USDC: {' '}
                  {percentBearish && percentBearish}%
                </span>

                <div className="inline-flex pl-2 translate-y-1.5 justify-start">
                  <Box
                    className="justify-start text-left "
                    mt="16px"

                  >
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
        </div>

        <footer className="text-center justify-center ">
          <div>
            <a
              href="https://cursed-fund.canny.io/feature-requests"
              target={"_blank"}
              rel={"noreferrer"}
            >
              Feedback
            </a>
            &nbsp; | &nbsp;
            <a
              href="https://cursed-fund.canny.io/bugs"
              target={"_blank"}
              rel={"noreferrer"}
            >
              Report a Bug
            </a>
            &nbsp; | &nbsp;
            <a
              href="https://github.com/ADWilkinson/lensfrensfund"
              target={"_blank"}
              rel={"noreferrer"}
            >
              GitHub
            </a>
          </div>
          <div>
            <span role="img" aria-label="sheep">
              Built for the Bilgerats by{' '}
            </span>
            <a href="https://twitter.com/andrew_eth" className="text-theme-pan-sky" target="blank">
              @andrew_eth
            </a>
          </div>
        </footer>
      </>
    </Page>
  );
};

export default HomePage;
