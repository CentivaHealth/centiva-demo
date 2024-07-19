import { Message } from "@/model/Message";

const requestClaimsFromAccount = async (data: {
  address: string,
  publicKey: string,
  signature: string,
  surveyHash?: string,
}) => {
  const res = await sendRequest(
    "POST",
    data,
    "/api/claims",
    { "content-type": "application/json" }
  );
  return res;
}

const requestClaim = async (data: {
  address: string,
  publicKey: string,
  signature: string,
  surveyHash: string,
}) => {
  const res = await sendRequest(
    "POST",
    data,
    "/api/claim",
    { "content-type": "application/json" }
  );
  return res;
}

const sendRequest = async(
  method: string,
  body: any,
  url: string,
  headers: HeadersInit | undefined
) => {
  try {
    const res = await fetch(url, {
      method: method,
      body: JSON.stringify(body),
      headers
    });
    if(res.ok){
      const response = await res.json();
      return response;
    } else{
      throw (Message.UNSUCCESSFUL);
    }
  } catch (error) {
    throw (Message.UNSUCCESSFUL);
  }
}

export { requestClaimsFromAccount, requestClaim };