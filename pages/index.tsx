/* eslint-disable @next/next/no-page-custom-font */
import Image from "next/image";
import { useRef, useState, useEffect, SetStateAction, useContext } from "react";
import styles from "../styles/Home.module.css";
import Web3Modal from "web3modal";
import jwt from "jsonwebtoken";
import {
  AuthorizationError,
  findFrens,
  TooManyRequestsError,
} from "../lib/find-frens";
import { freeFollow } from "../lib/follow";
import { ReactNotifications } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import { Store } from "react-notifications-component";

import Footer from "../components/footer";
import AppHead from "../components/app-head";
import LensFrensFundLogoNav from "../components/lensfrensfund-logo-nav";
import { signOut, useSession } from "next-auth/react";
import LensLogin from "../components/lens-login";
import { LensUserContext } from "../components/lens-login-provider";
import { LensFriendsContext } from "../components/lens-friends-provider";

const BULLISH = "BULLISH";
const BEARISH = "BEARISH";

export default function Home() {
  const { data } = useSession();

  const { connect } = useContext(LensUserContext);
  const { frens, setFrens } = useContext(LensFriendsContext);

  const [waiting, setWaiting] = useState(false);

  const [inputValue, setInputValue] = useState("");


  const pushSentiment = async (sentiment: string) => {

    if (sentiment === BULLISH) {
      console.log("Bullish");
    } else if (sentiment === BEARISH) {
      console.log("Bearish");

    } else {
      throw new Error(`Invalid sentiment: ${sentiment}`);
    }
  }

  const followRequest = async (id: string) => {
    const notifySuccess = () => {
      Store.addNotification({
        title: "Transaction sent!",
        message: "You will see the update in a few seconds!",
        type: "success",
        insert: "bottom",
        container: "bottom-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
          duration: 5000,
          onScreen: true,
        },
      });
    };

    const newFrens = [...frens];
    const fren = newFrens.find((fren) => fren.lens.id === id);
    if (fren.lens.waitingFollow || fren.lens.follows) {
      return;
    }
    fren.lens.waitingFollow = true;
    setFrens(newFrens);

    try {
      const connected = await connect();
      if (!connected) {
        throw new Error("Sign in failed");
      }

      const newFrensConnect = [...frens];
      const frenConnect = newFrensConnect.find((fren) => fren.lens.id === id);
      frenConnect.lens.follows = true;
      setFrens(newFrensConnect);

      await freeFollow(id);

      const newFrens = [...frens];
      const fren = newFrens.find((fren) => fren.lens.id === id);
      fren.lens.follows = true;
      fren.lens.waitingFollow = false;
      setFrens(newFrens);

      notifySuccess();
    } catch (err) {
      const errorMessage =
        err.message || "Please try again in a few seconds 🙏";

      const newFrens = [...frens];
      const fren = newFrens.find((fren) => fren.lens.id === id);
      fren.lens.waitingFollow = false;
      setFrens(newFrens);
      console.error(err);

      if (errorMessage === "You are already following this profile") {
        notifySuccess();
      } else if (errorMessage !== "Sign in failed") {
        fren.lens.follows = false;
        Store.addNotification({
          title: "There was an error",
          message: errorMessage,
          type: "danger",
          insert: "bottom",
          container: "bottom-right",
          animationIn: ["animate__animated", "animate__fadeIn"],
          animationOut: ["animate__animated", "animate__fadeOut"],
          dismiss: {
            duration: 5000,
            onScreen: true,
          },
        });
      }
    }
  };

  const findFrensRequest = async () => {
    if (waiting) {
      return;
    }
    setWaiting(true);

    const twitterHandle = inputValue.replaceAll("@", "");
    if (!twitterHandle) {
      setWaiting(false);
      return;
    }

    setFrens([]);

    try {
      let accessToken = localStorage.getItem("access_token");
      const decoded = jwt.decode(accessToken, { json: true });
      const address = decoded?.id;

      const newFrens = await findFrens(twitterHandle, address);

      if (newFrens.length) {
        setFrens(newFrens);
      } else {
        Store.addNotification({
          title: "No friend were found for this profile in Lens",
          type: "danger",
          insert: "bottom",
          container: "bottom-right",
          animationIn: ["animate__animated", "animate__fadeIn"],
          animationOut: ["animate__animated", "animate__fadeOut"],
          dismiss: {
            duration: 5000,
            onScreen: true,
          },
        });
      }
    } catch (err) {
      let title = "No frens found :(";
      let message = "There are no Lens frens for that profile";

      if (err instanceof TooManyRequestsError) {
        title = "No slots available";
        message =
          "Connect Twitter to skip the line or try again in a few minutes ⌛️";
      }
      if (err instanceof AuthorizationError) {
        title = "Authorization Error";
        message = "Your Twitter session has expired. Please login again";
        await signOut();
      }

      Store.addNotification({
        title: title,
        message: message,
        type: "danger",
        insert: "bottom",
        container: "bottom-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
          duration: 5000,
          onScreen: true,
        },
      });
    }
    setWaiting(false);
  };

  const frensList = () => {
    if (!frens?.length) {
      return "";
    }

    const twitterUrl = (handle: string) => `https://twitter.com/${handle}`;
    const lensUrl = (handle: string) =>
      `https://lenster.xyz/u/${handle.toLowerCase()}`;

    const renderFollowing = (fren) => {
      if (fren.lens?.follows) {
        return <button className={styles.following}>{"Following"}</button>;
      } else {
        return (
          <button
            className={styles.follow}
            onClick={() => followRequest(fren.lens.id)}
          >
            <Image
              unoptimized
              height="38"
              width="38"
              src="/lens.svg"
              alt="Lens Logo"
            ></Image>
            <span className={styles.followText}>{"Follow"}</span>
          </button>
        );
      }
    };

    const defaultAvatar =
      "https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png";

    return (
      <div className={styles.frensContainer}>
        <ul>
          {frens.map((fren) => (
            <li className={styles.userCard} key={fren.twitter.handle}>
              <div className={styles.avatarContainer}>
                <Image
                  unoptimized
                  height="48"
                  width="48"
                  src={fren.twitter.avatar || defaultAvatar}
                  alt="User Avatar"
                ></Image>
              </div>
              <div className={styles.profileContainer}>
                <div className={styles.profileHeader}>
                  <div className={styles.profileNameContainer}>
                    <div className={styles.profileName}>
                      {fren.twitter.name}
                    </div>
                    <div>
                      <a
                        className={styles.twitter}
                        href={twitterUrl(fren.twitter.handle)}
                        target={"_blank"}
                        rel={"noreferrer"}
                      >
                        @{fren.twitter.handle}
                      </a>
                      {" | "}
                      <a
                        className={styles.lens}
                        href={lensUrl(fren.lens.handle)}
                        target={"_blank"}
                        rel={"noreferrer"}
                      >
                        {fren.lens.handle}
                      </a>
                    </div>
                  </div>
                  {renderFollowing(fren)}
                </div>

                <div className={styles.profileDescription}>
                  {fren.twitter.description}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderHeart = () => {
    return (
      <span className={styles.ldsheart}>
        <div></div>
      </span>
    );
  };

  return (
    <div>
      <AppHead></AppHead>
      <ReactNotifications />
      <header>
        <nav>
          <LensFrensFundLogoNav></LensFrensFundLogoNav>
          <div className={styles.loginContainer}>
            <LensLogin></LensLogin>
          </div>
        </nav>
      </header>
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>🌿  Fren,<br></br>Are you bullish or bearish on $ETH?</h1>
          <p className={styles.description}>
            Every week the sentiment of our frens on Lens is automatically weighted<br></br> to rebalance a wallet between a 0-100% allocation to Ethereum.
          </p>

          <div>

            <button className="btn-bullish" onClick={() => pushSentiment(BULLISH)}>Bullish</button>
            <button className="btn-bearish" onClick={() => pushSentiment(BEARISH)}>Bearish</button>
          </div>

          <div className={styles.pleaseWait}>
            {waiting === true ? "Finding frens in Lens. Please wait :)" : ""}
          </div>
          <div>{waiting === true ? "It takes up to 10 seconds ⌛️" : ""}</div>
          {waiting === true ? renderHeart() : ""}
          {/* {!data?.user && !waiting && !frens?.length ? (
            <div>
              💡 <span className={styles.tip}>Connect Twitter</span> and skip
              the line!
            </div>
          ) : (
            ""
          )} */}

          <div>{!waiting && frensList()}</div>
        </main>

        <Footer></Footer>
      </div>
    </div>
  );
}
