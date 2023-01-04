import { createBrowserRouter } from "react-router-dom";
import App from "App";
import theme from "theme";
import { createRoot } from "react-dom/client";
import "@fontsource/ibm-plex-sans";
import { ChakraProvider } from "@chakra-ui/react";
import { Config, DAppProvider } from "@usedapp/core";
import { RouterProvider } from "react-router-dom";
import { ARBITRUM, MAINNET, OPTIMISM, POLYGON } from "constants/chains";
import { MarketDataProvider } from "providers/MarketData/MarketDataProvider";
import "./index.css";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import GalleonExperiment from "components/views/Galleon";
import ControlExperiment from "components/views/Control";
import Hero from "components/hero/Hero";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGE_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

const config: Config = {
  readOnlyChainId: MAINNET.chainId,
  readOnlyUrls: {
    [MAINNET.chainId]: process.env.REACT_APP_MAINNET_ALCHEMY_API ?? "",
    [POLYGON.chainId]: process.env.REACT_APP_POLYGON_ALCHEMY_API ?? "",
    [OPTIMISM.chainId]: process.env.REACT_APP_OPTIMISM_ALCHEMY_API ?? "",
    [ARBITRUM.chainId]: process.env.REACT_APP_ARBITRUM_ALCHEMY_API ?? "",
  },
};

const Providers = (props: { children: any }) => {
  return (
    <ChakraProvider theme={theme}>
      <DAppProvider config={config}>
        <MarketDataProvider>{props.children}</MarketDataProvider>
      </DAppProvider>
    </ChakraProvider>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <App>
        <Hero />
      </App>
    ),
  },
  {
    path: "/royalfortune",
    element: (
      <App>
        <GalleonExperiment />
      </App>
    ),
  },
  {
    path: "/control",
    element: (
      <App>
        <ControlExperiment />
      </App>
    ),
  },
]);

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <Providers>
    <RouterProvider router={router} />
  </Providers>
);
