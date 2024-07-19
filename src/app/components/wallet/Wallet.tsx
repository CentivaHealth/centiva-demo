import { useEffect } from "react";
import {
  Box,
  ClipboardCopyText,
  TextField,
  Stack,
  useColorModeValue,
} from "@interchain-ui/react";
import { WalletStatus } from "@cosmos-kit/core";
import { useChain } from "@cosmos-kit/react";
import { chains } from "chain-registry";
import { User } from "./User";
import { Warning } from "./Warning";
import { ChainSelect } from "./Chain";
import { CHAIN_NAME, CHAIN_NAME_STORAGE_KEY } from "@/config/default";
import {
  Button,
  ButtonConnect,
  ButtonConnected,
  ButtonConnecting,
  ButtonDisconnected,
  ButtonError,
  ButtonNotExist,
  ButtonRejected,
} from "./Connect";
import React from "react";
import { verifyADR36Amino } from "@keplr-wallet/cosmos";
import { Message } from "@/model/Message";
import { str2base64, str2hex } from "@/lib/encoding";
import { requestClaimsFromAccount } from "@/lib/requests";

export type WalletProps = {
  chainName?: string;
  onChainChange?: (chainName?: string) => void;
};

export function Wallet({
    chainName = CHAIN_NAME,
    onChainChange = () => {},
  }: WalletProps) {
  const [surveyHash, setSurveyHash] = React.useState("");
  const [claimMessage, setClaimMessage] = React.useState("");
  const [claimError, setClaimError] = React.useState("");
  const [claims, setClaims] = React.useState([]);

  const usedChain = useChain(chainName);
  const {
    chain,
    status,
    wallet,
    username,
    address,
    message,
    connect,
    openView,
  } = usedChain;

  const ConnectButton = {
    [WalletStatus.Connected]: <ButtonConnected onClick={openView} />,
    [WalletStatus.Connecting]: <ButtonConnecting />,
    [WalletStatus.Disconnected]: <ButtonDisconnected onClick={connect} />,
    [WalletStatus.Error]: <ButtonError onClick={openView} />,
    [WalletStatus.Rejected]: <ButtonRejected onClick={connect} />,
    [WalletStatus.NotExist]: <ButtonNotExist onClick={openView} />,
  }[status] || <ButtonConnect onClick={connect} />;

  function handleChainChange(chainName?: string) {
    if (chainName) {
      onChainChange(chainName);
      localStorage.setItem(CHAIN_NAME_STORAGE_KEY, chainName!);
    }
  }

  const goToSurvey = async () => {
    setClaimMessage("");
    setClaimError("");
    if (!surveyHash) {
      setClaimError(Message.EMPTY_SURVEY);
      return;
    }

    const signatureCheck = await usedChain.signArbitrary(
      address as string,
      address as string
    );
    const existingClaim = await requestClaimsFromAccount({
      address: address as string,
      publicKey: signatureCheck.pub_key.value,
      signature: signatureCheck.signature,
    });
    console.log(existingClaim);
    if (existingClaim && existingClaim.length > 0) {
      setClaimError(`${Message.SURVEY_CLAIMED} TxHash: ${existingClaim[0].txHash}`);
      return;
    }

    const surveyUrl = `https://cnbs.dhealth.ninja/redcap/surveys/?s=${surveyHash}`;;

    const signature = await usedChain.signArbitrary(
      address as string,
      surveyHash
    );
    console.log(signature);

    const concatedSurveyUrl =
      `${surveyUrl}` +
      `&address=${str2hex(address as string)}` +
      `&pubkey=${str2hex(signature.pub_key.value)}` +
      `&signature=${str2hex(signature.signature)}`;
    window.open(concatedSurveyUrl, '_blank');
  };

  useEffect(() => {
    const selected = localStorage.getItem(CHAIN_NAME_STORAGE_KEY);
    if (selected && selected !== chainName) {
      onChainChange(selected);
    }
  }, []);

  return (
    <Box py="$10" width="28rem">
      {/* <Box mx="auto" maxWidth="28rem" attributes={{ mb: "$12" }}>
        <ChainSelect
          chains={chains}
          chainName={chain.chain_name}
          onChange={handleChainChange}
        />
      </Box> */}
      <Stack
        direction="vertical"
        attributes={{
          mx: "auto",
          px: "$8",
          py: "$15",
          maxWidth: "21rem",
          borderRadius: "$lg",
          justifyContent: "center",
          backgroundColor: useColorModeValue("$white", "$blackAlpha500"),
          boxShadow: useColorModeValue(
            "0 0 2px #dfdfdf, 0 0 6px -2px #d3d3d3",
            "0 0 2px #363636, 0 0 8px -2px #4f4f4f",
          ),
        }}
      >
        {username ? <User name={username} /> : null}
        {address
          ? <ClipboardCopyText text={address} truncate="middle" />
          : null}
        <Box
          my="$8"
          flex="1"
          width="full"
          display="flex"
          height="$16"
          overflow="hidden"
          justifyContent="center"
          px={{ mobile: "$8", tablet: "$10" }}
        >
          {ConnectButton}
        </Box>

        {address
          ?<TextField
            type="text"
            value={surveyHash}
            onChange={e => setSurveyHash(e.target.value)}
            id={""}
            label={"Survey hash"}
            size="sm"
            placeholder={"e.g. FYHYWCJ4AT"}
            className="items-center justify-center"
            inputClassName="text-center"
          />
          : null}

        {address
          ?<Box
            my="$8"
            flex="1"
            width="full"
            display="flex"
            height="$16"
            overflow="hidden"
            justifyContent="center"
            px={{ mobile: "$8", tablet: "$10" }}
          >
            {Button({
              text: "Go to survey",
              onClick: () => goToSurvey()
            })}
          </Box>
          : null}

        {message &&
            [WalletStatus.Error, WalletStatus.Rejected].includes(status)
          ? <Warning text={`${wallet?.prettyName}: ${message}`} />
          : null}
        {claimError
          ? <Warning text={`${wallet?.prettyName}: ${claimError}`} />
          : null}
      </Stack>
    </Box>
  );
}
