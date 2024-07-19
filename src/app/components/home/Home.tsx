import React from "react";

// Import this in your top-level route/layout
import "@interchain-ui/react/styles";
import { Wallet } from "../wallet";
import { CHAIN_NAME } from "@/config/default";
import { Window as KeplrWindow } from "@keplr-wallet/types";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Window extends KeplrWindow {}
}


export default function Home() {
  const [chainName, setChainName] = React.useState(CHAIN_NAME);

  function onChainChange(chainName?: string) {
    setChainName(chainName!);
  }

  return (
    <div className="flex flex-col justify-center items-center">
        {/* @ts-ignore */}
        <Wallet chainName={chainName} onChainChange={onChainChange} />
    {/* End main div */}
    </div>
  );
}
