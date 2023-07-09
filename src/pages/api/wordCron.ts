import {NextApiRequest, NextApiResponse} from "next";
import {prisma} from "../../lib/prisma";
import {SourceBookReqData} from "./sourceBook";
import {obtainUserFromMiddleware} from "../../lib/utils";

const dateFormat = (date: string) => {
    if (date === "今日") {
        const month = new Date().getMonth() + 1;
        let monthStr;
        if (month < 10) {
            monthStr = `0${month}`;
        } else {
            monthStr = month.toString();
        }

        const day = new Date().getDate();
        let dayStr;
        if (day < 10) {
            dayStr = `0${day}`;
        } else {
            dayStr = day.toString();
        }
        return `${monthStr}-${dayStr}`;
    }
    return date;
}

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse
) {
    // find all user with non-empty bbdcId field
    const users = await prisma.user.findMany({
        where: {
            bbdcID: {
                not: null
            }
        }
    });

    const tasks = users.map(async user => {
        const {bbdcID} = user;

        const data = await fetch(`https://learnywhere.cn/bb/dashboard/profile/search?userId=${bbdcID}`).then(res => res.json());

        const body = data["data_body"];

        const prismaData: Record<string, { learn: number, review: number, duration: number }> = {};

        const year = new Date().getFullYear();

        const durations = body["durationList"];
        for (const i of durations) {
            const {date, duration} = i;
            const key = `${year}-${dateFormat(date)}`;
            prismaData[key] = {
                learn: 0,
                review: 0,
                duration
            }
        }

        const learn = body["learnList"];
        for (const i of learn) {
            const {date, learnNum, reviewNum} = i;
            const key = `${year}-${dateFormat(date)}`;
            prismaData[key].learn = learnNum;
            prismaData[key].review = reviewNum;
        }

        const prismaDataArray = Object.entries(prismaData).map(([date, {learn, review, duration}]) => ({
            date,
            learn,
            review,
            duration,
            userID: user.id,
        }));

        await Promise.all(prismaDataArray.map(async data => {
            await prisma.wordsRecord.upsert({
                where: {
                    userId_date: {
                        date: data.date,
                        userId: data.userID
                    }
                },
                update: {
                    learn: data.learn,
                    review: data.review,
                    duration: data.duration
                },
                create: {
                    learn: data.learn,
                    review: data.review,
                    duration: data.duration,
                    date: data.date,
                    userId: data.userID
                }
            })
        }));
    });

    await Promise.all(tasks);

    response.status(200).json({message: "success"});
}
