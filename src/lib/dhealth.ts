import { Message } from "@/model/Message";
import { DirectSecp256k1HdWallet, OfflineDirectSigner } from "@cosmjs/proto-signing";
import { SigningStargateClient, StargateClient } from "@cosmjs/stargate";
import {stringToPath} from "@cosmjs/crypto";

const MNEMONIC = process.env.MNEMONIC ?? "";
const ADDRESS = process.env.ADDRESS ?? "";
const NETWORK_PREFIX = process.env.NETWORK_PREFIX ?? "dh";
const COSMOS_DHP_DENOM = process.env.COSMOS_DHP_DENOM ?? "udhp";
const RPC_URI = process.env.RPC_URI ?? "https://rpc.dhealth.com";

const sendDHP = async (
  to: string,
  amount: string,
  memo: string
) => {
  // signing client
  const getMainAccSignerFromMnemonic =
    async (): Promise<OfflineDirectSigner> =>
    DirectSecp256k1HdWallet.fromMnemonic(MNEMONIC, {
      prefix: NETWORK_PREFIX,
      hdPaths: [stringToPath("m/44'/10111'/0'/0/0")]
    });
  console.log(MNEMONIC);
  const mainAccSigner: OfflineDirectSigner =
    await getMainAccSignerFromMnemonic();
  const signingClient = await SigningStargateClient.connectWithSigner(
    RPC_URI,
    mainAccSigner
  );
  // send token
  const result = await signingClient.sendTokens(
    ADDRESS,
    to,
    [{
      denom: COSMOS_DHP_DENOM,
      amount
    }],
    {
      amount: [
        {
          denom: COSMOS_DHP_DENOM,
          amount: "500",
        },
      ],
      gas: "200000",
    },
    memo
  );
  // return result
  return result;;
}

const validateBalance = async(
  address: string,
  denom: string,
  amount: number
): Promise<void> => {
  const balance = await getBalance(address, denom);
  if (+balance.amount < amount) {
    throw new Error(Message.INSUFFICIENT_BALANCE);
  }
}

const getAccount = async(address: string) => {
  const client = await StargateClient.connect(RPC_URI);
  return await client.getAccount(address);
}

const getBalance = async(address: string, denom: string) => {
  const client = await StargateClient.connect(RPC_URI);
  return await client.getBalance(address, denom);
}

export {
  ADDRESS,
  COSMOS_DHP_DENOM,
  sendDHP,
  validateBalance
};