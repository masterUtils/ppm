import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";

export type ProblemReqData = {
  name: string,
  picUrl: string,
  sourceBookId?: number,
}

async function putHandler(request: NextApiRequest, response: NextApiResponse) {
  const data: ProblemReqData = request.body;

  const result = await prisma.problem.create({ data });

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
