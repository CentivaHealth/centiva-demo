'use client';
import React from "react";

// Import this in your top-level route/layout
import "@interchain-ui/react/styles";

import { SignerOptions, wallets, WalletStatus } from 'cosmos-kit';
import { ChainProvider } from '@cosmos-kit/react';
import { assets, chains } from 'chain-registry';
import {
  Box,
  ThemeProvider,
  useColorModeValue,
  useTheme,
} from '@interchain-ui/react';
import Home from "./components/home/Home";

export default function Index() {

  const { themeClass } = useTheme();
  const signerOptions: SignerOptions = {
    // signingStargate: () => {
    //   return getSigningCosmosClientOptions();
    // }
    preferredSignType: (chain: any) => {
      return 'amino';
    }
  };

  return (
    // Main component
    <main className="flex min-h-screen flex-col items-center justify-start p-9 lg:p-24">

      {/* Page logo */}
      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTF2uhzAKKBE-IX-1Td1ePbOR5ThWlA4qsgptq1gyMaTt-V5kItAc799wgpThdBhG7jW3o&usqp=CAU" className="w-20" />
 
      {/* Page title */}
      <h1 className="mb-3 text-2xl font-semibold text-[#150867]">Centiva Survey Access</h1>

      {/* Main div */}
      <div className="z-10 w-full max-w-5xl items-center justify-center font-mono text-sm flex flex-col">
 
        {/* Legacy private key */}
        <div className="flex flex-col justify-center items-center">
          <ThemeProvider>
            <ChainProvider
              chains={chains}
              assetLists={assets}
              wallets={wallets}
              walletConnectOptions={{
                signClient: {
                  projectId: 'a8510432ebb71e6948cfd6cde54b70f7',
                  relayUrl: 'wss://relay.walletconnect.org',
                  metadata: {
                    name: 'Cosmos Kit dApp',
                    description: 'Cosmos Kit dApp built by Create Cosmos App',
                    url: 'https://docs.cosmology.zone/cosmos-kit/',
                    icons: [],
                  },
                },
              }}
              // @ts-ignore
              signerOptions={signerOptions}
            >
              <Box
                className={themeClass}
                // minHeight="100dvh"
                backgroundColor={useColorModeValue('$white', '$background')}
              >
                {/* @ts-ignore */}
                <Home />
              </Box>
            </ChainProvider>
          </ThemeProvider>
        </div>
      {/* End main div */}
      </div>

    {/* End main component */}
    </main>
  );
}
