import { NextApiRequest, NextApiResponse } from "next";
import { cca, redirectUri, scopes } from "../../src/constant";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const code = request.query.code;
  const clientInfo = request.query.client_info;

  if (!(typeof code === "string")) {
    response.status(400).json({ message: "code is not a string" });
    return;
  }
  if (!(typeof clientInfo === "string")) {
    response.status(400).json({ message: "client_info is not a string" });
    return;
  }

  const token = await cca.acquireTokenByCode({
    code,
    redirectUri,
    scopes,
    clientInfo
  });

  console.log(token);

  response.status(200).json(token);
}
