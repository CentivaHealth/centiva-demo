import { NextRequest, NextResponse } from 'next/server';
import { verifyADR36Amino } from "@keplr-wallet/cosmos";
import { Message } from '@/model/Message';
import { addClaim, getClaim } from '@/lib/database';
import { sendDHP } from '@/lib/dhealth';
import { hex2str, str2base64 } from '@/lib/encoding';

export async function POST(req: NextRequest) {
  // get request body
  const {
    addressHex,
    publicKeyHex,
    signatureHex,
    surveyHash
  } = await req.json();
  // convert hex to string
  const [
    address,
    publicKey,
    signature
  ] = [
    hex2str(addressHex),
    hex2str(publicKeyHex),
    hex2str(signatureHex)
  ];
  try {
    // validate signature
    const isSignatureValid = verifyADR36Amino(
      "dh",
      address,
      surveyHash,
      str2base64(publicKey),
      str2base64(signature)
    );
    if (!isSignatureValid) throw (Message.INVALID_SIGNATURE);

    // validate account has not received reward for this survey yet
    const claim = await getClaim({
      address: address,
      surveyHash
    });
    console.log(claim);
    if (claim) throw (Message.SURVEY_CLAIMED);

    // pay reward
    const claimResult = await sendDHP(
      address,
      "100000000",
      `Reward for survey: ${surveyHash}`
    );
    const txHash = claimResult.transactionHash;

    // update database
    const result =
      await addClaim({address, surveyHash, amount: 100, txHash});

    // return success message
    return NextResponse.json(result);
  } catch(e) {
    console.log(e);
    return NextResponse.json(e, { status: 400 });
  }
}