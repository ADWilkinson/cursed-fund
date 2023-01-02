import { Outlet } from "react-router-dom";
import { useEthers, useNotifications } from "@usedapp/core";
import Header from "components/Header";
import { useToast } from "@chakra-ui/react";
import { useEffect } from "react";
import { SUPPORTED_CHAINS } from "constants/chains";
import HomePage from "components/views/Homepage";

const App = () => {
  const { notifications } = useNotifications();
  const { chainId } = useEthers();
  const toast = useToast();
  useEffect(() => {
    if (notifications.length === 0) return;

    let explorer = SUPPORTED_CHAINS.find((x) => x.chainId == chainId);
    notifications.forEach((notification) => {
      if ("transaction" in notification) {
        toast({
          title:
            notification.type === "transactionStarted"
              ? "Transaction Pending"
              : notification.type === "transactionSucceed"
              ? "Transaction Success"
              : "Transaction Failed",
          description: (
            <a
              className="hover:text-theme-sky text-theme-pan-sky"
              target={"_blank"}
              href={
                explorer.blockExplorerUrl +
                "tx/" +
                notification.transaction.hash
              }
              rel="noreferrer"
            >
              Go to transaction explorer
            </a>
          ),
          variant: "info",
          duration: 3000,
          isClosable: true,
          containerStyle: {
            borderRadius: "1rem",
            border: "2px solid #040728",
            backgroundColor: " #f4eee8",
            color: "#040728",
          },
        });
      }
    });
  }, [notifications]);

  return (
    <>
      <Header />
      <HomePage />
    </>
  );
};

export default App;
