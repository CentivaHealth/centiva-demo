import client from "./mongodb";

async function getClaim(filter: {
  address: string,
  surveyHash: string
}) {
  try {
    const db = client.db("db_centiva_demo");
    const claim = await db
      .collection("claims")
      .findOne(filter);
    return claim;
  } catch (e) {
    throw("Cannot retrieve claim from database");
  }
}

async function getClaims(filter: {
  address: string,
  surveyHash?: string,
  amount?: number,
  txHash?: string
}) {
  try {
    const db = client.db("db_centiva_demo");
    const claims = await db
      .collection("claims")
      .find(filter)
      .toArray();
    return claims;
  } catch (e) {
    throw("Cannot retrieve claims from database");
  }
}

async function addClaim(claim: {
  address: string,
  surveyHash: string,
  amount: number,
  txHash: string
}) {
  try {
    const db = client.db("db_centiva_demo");
    const result = await db
      .collection("claims")
      .insertOne(claim);
    return result;
  } catch (e) {
    throw("Cannot add claim to database");
  }
}

export { getClaim, getClaims, addClaim };