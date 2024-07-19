import { getClaims } from '@/lib/database';
import { NextRequest, NextResponse } from 'next/server';
import { verifyADR36Amino } from "@keplr-wallet/cosmos";
import { Message } from '@/model/Message';
import { str2base64 } from '@/lib/encoding';


export async function POST(req: NextRequest) {
  const { address, publicKey, signature, surveyHash } = await req.json();
  try {
    // validate signature
    const isSignatureValid = verifyADR36Amino(
      "dh",
      address,
      address,
      str2base64(publicKey),
      str2base64(signature)
    );
    if (!isSignatureValid) throw (Message.INVALID_SIGNATURE);

    // get claims from database
    let result;
    if (surveyHash) {
      result = await getClaims({address, surveyHash});
    } else {
      result = await getClaims({ address });
    }

    // return result
    return NextResponse.json(result);
  } catch(e) {
    return NextResponse.json(e, { status: 400 });
  }
}