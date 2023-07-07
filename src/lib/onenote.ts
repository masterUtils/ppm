import { prisma } from "./prisma";
import { User } from "@prisma/client";
import { redirectUri, scopes, TEMPLATE_WITH_PIC, TEMPLATE_WITHOUT_PIC } from "./static/constant";
import { Client } from "@microsoft/microsoft-graph-client";
import { AccountInfo } from "@azure/msal-common";
import FormData from "form-data";
import { cca } from "./static/cca";


export async function getMSLoginUrl() {
  return await cca.getAuthCodeUrl({
    redirectUri,
    scopes
  });
}

export async function getClient(account: AccountInfo) {
  const token = await cca.acquireTokenSilent({
    account,
    scopes
  });
  if (!token) {
    throw new Error("failed to acquire token silently");
  }
  return Client.init({
    authProvider: (done) => {
      done(null, token.accessToken);
    }
  });
}

const NotebookName = "PPM";
const SectionName = "Problems";

export async function createNotebook(client: Client) {
  const notebooksResp = await client.api(`/me/onenote/notebooks`).get();
  const notebooks: Array<any> = notebooksResp.value;
  const targetNotebook = notebooks.find((notebook) => notebook.displayName === NotebookName);

  let targetNotebookId: string;
  if (targetNotebook) {
    targetNotebookId = targetNotebook.id;
  } else {
    const notebook = await client.api(`/me/onenote/notebooks`).post({
      displayName: NotebookName
    });
    targetNotebookId = notebook.id;
  }

  let targetSectionId: string;
  const sectionsResp = await client.api(`/me/onenote/notebooks/${targetNotebookId}/sections`).get();
  const sections: Array<any> = sectionsResp.value;
  const targetSection = sections.find((section) => section.displayName === SectionName);
  if (targetSection) {
    targetSectionId = targetSection.id;
  } else {
    const section = await client.api(`/me/onenote/notebooks/${targetNotebookId}/sections`).post({
      displayName: SectionName
    });
    targetSectionId = section.id;
  }
  return targetSectionId;
}

export async function createProblemPage(user: User, problemId: number) {
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

  const client = await getClient(JSON.parse(user.msAccount!));

  const data = new FormData();
  data.append("Presentation", payload, { contentType: "text/html" });

  return await client.api(`/me/onenote/sections/${user.msSectionId}/pages`).post(data);
}
