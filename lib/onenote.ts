import { prisma } from "./prisma";
import { cca, redirectUri, scopes, TEMPLATE_WITH_PIC, TEMPLATE_WITHOUT_PIC } from "../src/constant";
import { PublicClientApplication } from "@azure/msal-node";
import { msClientID } from "../src/env";

export async function getMSLoginUrl() {
  return await cca.getAuthCodeUrl({
    redirectUri,
    scopes
  });
}

export async function trySolveProblem(problemId: number) {
  const problem = await prisma.problem
    .findUniqueOrThrow({ where: { id: problemId } });

  const picUrl = problem.picUrl;

  let payload: string;

  if (picUrl) {
    payload = TEMPLATE_WITH_PIC
      .replace("PIC_URL", picUrl)
      .replace("TITLE", problem.name);
  } else {
    payload = TEMPLATE_WITHOUT_PIC
      .replace("TITLE", problem.name);
  }


}
