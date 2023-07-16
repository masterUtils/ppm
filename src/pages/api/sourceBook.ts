import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";
import type { Subject } from "@prisma/client";

export type SourceBookReqData = {
  name: string,
  subject: Subject,
  pdfUrl: string,
  answerUrl: string,
}

async function putHandler(request: NextApiRequest, response: NextApiResponse) {
  const data: SourceBookReqData = request.body;

  const result = await prisma.sourceBook.create({ data });

  response.status(200).json(result);
}

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  switch (request.method) {
    case "PUT":
      await putHandler(request, response);
      break;
    default:
      response.status(405).end();
  }
}
