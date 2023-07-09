import {NextApiRequest, NextApiResponse} from "next";
import {obtainUserFromMiddleware} from "../../../lib/utils";
import {prisma} from "../../../lib/prisma";

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse
) {
    const user = obtainUserFromMiddleware(request.headers);

    const bbdcID = request.body;
    if (!(typeof bbdcID === "string")) {
        response.status(400).json({message: "bbdcID is not a string"});
        return;
    }
    if (!bbdcID) {
        response.status(204).json({message: "bbdcID is empty"});
        return;
    }

    await prisma.user.update({
        where: {
            name: user,
        },
        data: {bbdcID}
    })

    response.status(200).json({message: "success"});
}
