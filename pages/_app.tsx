import { SessionProvider } from "next-auth/react";
import "../styles/globals.css";

import { LensLoginProvider } from "../components/lens-login-provider";
import { LensFriendsProvider } from "../components/lens-friends-provider";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGE_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

function MyApp({ Component, pageProps }) {
  return (
    <LensFriendsProvider>
      <LensLoginProvider>
        <SessionProvider session={pageProps.session}>
          <Component {...pageProps} />
        </SessionProvider>
      </LensLoginProvider>
    </LensFriendsProvider>
  );
}

export default MyApp;
