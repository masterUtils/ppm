import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";

export type ProblemReqData = {
  name: string,
  picUrl: string,
  sourceBookId?: number,
}

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method !== "PUT") {
    response.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  const data: ProblemReqData = request.body;

  const result = await prisma.problem.create({ data });

  response.status(200).json(result);
}
