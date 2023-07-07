import { NextApiRequest, NextApiResponse } from "next";
import { redirectUri, scopes } from "../../lib/static/constant";
import { prisma } from "../../lib/prisma";
import { obtainUserFromMiddleware } from "../../lib/utils";
import { createNotebook, getClient } from "../../lib/onenote";
import { cca } from "../../lib/static/cca";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const user = obtainUserFromMiddleware(request.headers);
  const code = request.query.code;

  if (!(typeof code === "string")) {
    response.status(400).json({ message: "code is not a string" });
    return;
  }

  const token = await cca.acquireTokenByCode({
    code,
    redirectUri,
    scopes
  });

  const client = await getClient(token.account!);
  const sectionId = await createNotebook(client);

  await prisma.user.upsert({
    where: {
      name: user
    },
    update: {
      msAccount: JSON.stringify(token.account),
      msSectionId: sectionId
    },
    create: {
      name: user,
      msAccount: JSON.stringify(token.account),
      msSectionId: sectionId
    }
  });

  response.redirect("/");
}
