import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";
import type { Subject } from "@prisma/client";

export type SourceBookReqData = {
  name: string,
  subject: Subject,
  pdfUrl: string,
  answerUrl: string,
}

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method !== "PUT") {
    response.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  const data: SourceBookReqData = request.body;

  const result = await prisma.sourceBook.create({ data });

  response.status(200).json(result);
}
