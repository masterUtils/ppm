import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";

export type SolveRecordReqData = {
  problemId: number,
  oneNoteUrl: string,
  result: boolean,
}

async function putHandler(request: NextApiRequest, response: NextApiResponse) {
  const data: SolveRecordReqData = request.body;

  const result = await prisma.solveRecord.create({ data });

  response.status(200).json(result);
}

async function getHandler(request: NextApiRequest, response: NextApiResponse) {
  const skip = Number(request.query.skip);

  const sourceBookID = (request.query.sourceBookID) ? Number(request.query.sourceBookID) : undefined;

  const problemID = (request.query.problemID) ? Number(request.query.problemID) : undefined;

  const result = await prisma.solveRecord.findMany({
    skip,
    take: 10,
    where: {
      problemId: problemID,
      ...((sourceBookID) ? { problem: { sourceBookId: sourceBookID } } : {})
    }
  });

  const count = await prisma.solveRecord.count({
    where: {
      problemId: problemID,
      ...((sourceBookID) ? { problem: { sourceBookId: sourceBookID } } : {})
    }
  });

  response.status(200).json({
    data: result,
    total: count
  });
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
