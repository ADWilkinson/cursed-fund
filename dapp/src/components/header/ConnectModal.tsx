import {
  Box,
  Flex,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { useEthers } from "@usedapp/core";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import metamaskIcon from "assets/metamask.png";
import walletconnectIcon from "assets/walletconnect.svg";
import { ARBITRUM, MAINNET, OPTIMISM, POLYGON } from "constants/chains";
import { metaMaskLink } from "constants/externalLinks";
import { colors } from "styles/colors";
import argentIcon from "assets/argent.png";
import coinbaseWalletIcon from "assets/coinbaseWalletIcon.png";
import rainbowIcon from "assets/rainbow-wallet.png";
import zengoIcon from "assets/zengo.png";

export default function ConnectModal(props: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { activateBrowserWallet, activate } = useEthers();
  // @ts-ignore
  const isMetaMaskInstalled = window.ethereum?.isMetaMask;
  const backgroundColor = colors.themePanChampagne;
  const borderColor = colors.themePanNavy;

  const handleMetamask = () => {
    if (isMetaMaskInstalled) {
      activateBrowserWallet();
      props.onClose();
    } else {
      window.open(metaMaskLink, "_blank");
    }
  };

  const handleWalletConnect = () => {
    const wc = new WalletConnectConnector({
      rpc: {
        42161: process.env.REACT_APP_ARBITRUM_ALCHEMY_API,
      },
      chainId: ARBITRUM.chainId,
    });
    activate(wc)
      .then(() => {})
      .then((err) => {
        props.onClose();
        console.error(err);
      });
  };

  const handleCoinbaseWallet = () => {
    const coinbase = new WalletLinkConnector({
      url: process.env.REACT_APP_ARBITRUM_ALCHEMY_API,
      appName: "Galleon",
      supportedChainIds: [
        ARBITRUM.chainId,
      ],
    });
    activate(coinbase)
      .then(() => {})
      .then((err) => {
        props.onClose();
        console.error(err);
      });
  };

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} isCentered size="md">
      <ModalOverlay />
      <ModalContent
        background={backgroundColor}
        border="2px"
        borderStyle="solid"
        borderRadius={10}
        borderColor={borderColor}
        color={borderColor}
      >
        <ModalHeader px={4} fontSize="lg" fontWeight="medium">
          Connect to wallet
        </ModalHeader>
        <ModalCloseButton
          fontSize="sm"
          _hover={{
            color: "whiteAlpha.700",
            borderColor: borderColor,
          }}
          _focus={{
            borderColor: borderColor,
          }}
        />
        <ModalBody pt={0} px={4} color={borderColor}>
          <WalletButton
            buttonIcon={metamaskIcon}
            buttonText={isMetaMaskInstalled ? "MetaMask" : "Install MetaMask"}
            borderColor={borderColor}
            handleConnection={handleMetamask}
          />
          <WalletButton
            buttonIcon={argentIcon}
            buttonText="Argent"
            borderColor={borderColor}
            handleConnection={handleWalletConnect}
          />
          <WalletButton
            buttonIcon={rainbowIcon}
            buttonText="Rainbow Wallet"
            borderColor={borderColor}
            handleConnection={handleWalletConnect}
          />
          <WalletButton
            buttonIcon={coinbaseWalletIcon}
            buttonText="Coinbase Wallet"
            borderColor={borderColor}
            handleConnection={handleCoinbaseWallet}
          />
          <WalletButton
            buttonIcon={zengoIcon}
            buttonText="ZenGo"
            borderColor={borderColor}
            handleConnection={handleWalletConnect}
          />
          <WalletButton
            buttonIcon={walletconnectIcon}
            buttonText="WalletConnect"
            borderColor={borderColor}
            handleConnection={handleWalletConnect}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

const WalletButton = (props: {
  buttonText: string;
  buttonIcon: string;
  borderColor: string;
  handleConnection: () => void;
}) => {
  return (
    <Box
      border="1px"
      borderStyle="solid"
      borderRadius={10}
      borderColor={props.borderColor}
      cursor="pointer"
      onClick={props.handleConnection}
      _hover={{ borderColor: props.borderColor }}
      px={5}
      pt={4}
      pb={2}
      mb={3}
    >
      <Flex justifyContent="space-between" alignItems="center" mb={3}>
        <Text fontSize="lg">{props.buttonText}</Text>
        <Image src={props.buttonIcon} width={"10%"} />
      </Flex>
    </Box>
  );
};
