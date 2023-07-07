import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";

export type SolveRecordReqData = {
  problemId: number,
  oneNoteUrl: string,
  result: boolean,
}

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method !== "PUT") {
    response.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  const data: SolveRecordReqData = request.body;

  const result = await prisma.solveRecord
    .create({ data });

  response.status(200).json(result);
}
