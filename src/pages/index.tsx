// ** MUI Imports
import Grid from "@mui/material/Grid";

// ** Icons Imports
import Poll from "mdi-material-ui/Poll";
import CurrencyUsd from "mdi-material-ui/CurrencyUsd";
import HelpCircleOutline from "mdi-material-ui/HelpCircleOutline";
import BriefcaseVariantOutline from "mdi-material-ui/BriefcaseVariantOutline";

// ** Custom Components Imports
import CardStatisticsVerticalComponent from "src/@core/components/card-statistics/card-stats-vertical";

// ** Styled Component Import
import ApexChartWrapper from "src/@core/styles/libs/react-apexcharts";

// ** Demo Components Imports
import CheckNewProblem from "../views/dashboard/CheckNewProblem";
import TotalEarning from "src/views/dashboard/TotalEarning";
import TodayStatisticsCard from "../views/dashboard/TodayStatisticsCard";
import WeeklyOverview, { WeeklyOverviewProps } from "src/views/dashboard/WeeklyOverview";
import { GetServerSideProps } from "next";
import { MiddlewareUserKey } from "../lib/static/constant";
import { getMSLoginUrl } from "../lib/onenote";
import { prisma } from "../lib/prisma";
import { Result, Subject } from "@prisma/client";
import moment from "moment-timezone";
import { Stack } from "@mui/material";

type SubjectCount = Record<Subject, number>;

type Props = {
  bbdc: WeeklyOverviewProps,
  totalProblemCount: SubjectCount,
  totalSolvedProblemCount: SubjectCount,
  todaySolveCount: SubjectCount,
  todayCorrectSolveCount: SubjectCount,
}

const Dashboard = (props: Props) => {
  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12} md={6}>
          <Stack spacing={6}>
            <CheckNewProblem />
            <WeeklyOverview
              duration={props.bbdc.duration}
              learn={props.bbdc.learn}
              review={props.bbdc.review}
            />
          </Stack>
        </Grid>
        <Grid item xs={12} md={6}>
          <Stack spacing={6}>

          </Stack>
        </Grid>
      </Grid>
    </ApexChartWrapper>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const user = ctx.req!.headers[MiddlewareUserKey] as string;

  const userE = await prisma
    .user
    .findFirst({ where: { name: user } });
  if (!userE) {
    const loginUri = await getMSLoginUrl();
    return {
      redirect: {
        destination: loginUri,
        permanent: false
      }
    };
  }

  const wordHistory = (await prisma.wordsRecord.findMany({
    where: {
      user: {
        name: user
      }
    },
    orderBy: {
      date: "desc"
    },
    take: 7
  })).reverse();

  const bbdc: WeeklyOverviewProps = {
    duration: wordHistory.map((e) => e.duration),
    learn: wordHistory.map((e) => e.learn),
    review: wordHistory.map((e) => e.review)
  };

  const initial: Record<Subject, number> = {
    MATH: 0,
    POLITICS: 0,
    OPERATING_SYSTEM: 0,
    COMPUTER_NETWORK: 0,
    DATA_STRUCTURE: 0,
    POCO: 0,
    ENGLISH: 0
  };

  const todayCorrectSolveCount = structuredClone(initial);
  const todaySolveCount = structuredClone(initial);
  const totalSolvedProblemCount = structuredClone(initial);
  const totalProblemCount = structuredClone(initial);

  await Promise.all(Object.values(Subject).map(async (subject) => {
    totalProblemCount[subject] = await prisma.problem.count({
      where: {
        subject
      }
    });

    totalSolvedProblemCount[subject] = await prisma.problem.count({
      where: {
        subject,
        solveRecords: {
          some: {
            result: Result.CORRECT
          }
        }
      }
    });

    const today = moment.tz("Asia/Shanghai").startOf("day").toDate();

    todaySolveCount[subject] = await prisma.solveRecord.count({
      where: {
        problem: {
          subject
        },
        createdAt: {
          gt: today
        }
      }
    });

    todayCorrectSolveCount[subject] = await prisma.solveRecord.count({
      where: {
        problem: {
          subject
        },
        createdAt: {
          gt: today
        },
        result: Result.CORRECT
      }
    });
  }));


  return {
    props: {
      bbdc,
      totalProblemCount,
      totalSolvedProblemCount,
      todayCorrectSolveCount,
      todaySolveCount
    }
  };
};

export default Dashboard;
