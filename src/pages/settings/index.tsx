import {GetServerSideProps, InferGetServerSidePropsType} from "next";
import {obtainUserFromMiddleware} from "../../lib/utils";
import {prisma} from "../../lib/prisma";
import Grid from '@mui/material/Grid'
import TextField from "@mui/material/TextField";
import {useRef, useState} from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import useSWRMutation from 'swr/mutation'
import {LoadingButton} from "@mui/lab";
import {useSnackbar} from "notistack";

type Props = {
    bbdcID: string | null,
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
    const user = obtainUserFromMiddleware(ctx.req.headers);
    const {bbdcID} = await prisma.user.findUniqueOrThrow({
        where: {
            name: user
        },
        select: {
            bbdcID: true
        }
    })

    return {
        props: {
            bbdcID: bbdcID
        }
    }
}

async function bbdcMutation(url: string, {arg}: { arg: string }) {
    await fetch(url, {
        method: "POST",
        body: arg
    })
}

export default function Settings(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const [bbdcID, setBbdcID] = useState(props.bbdcID);

    const bbdcRef = useRef<HTMLInputElement>(null);

    const {enqueueSnackbar} = useSnackbar();

    const {trigger, isMutating} = useSWRMutation("/api/settings/bbdc", bbdcMutation, {
        onSuccess: () => {
            enqueueSnackbar("保存成功")
        },
        onError: (err) => {
            enqueueSnackbar("保存失败: " + err, {
                variant: "error"
            })
        }
    })


    return <Grid container spacing={6}>
        <Grid item xs={12} md={6}>
            <Card>
                <CardHeader
                    title="不背单词"
                />
                <CardContent>
                    <TextField inputRef={bbdcRef} label="不背单词 ID" variant="outlined" defaultValue={bbdcID || ""}/>
                </CardContent>
                <CardActions>
                    <LoadingButton
                        loading={isMutating}
                        variant="contained"
                        onClick={() => {
                            trigger(bbdcRef.current!.value)
                        }}
                        color="primary">保存</LoadingButton>
                </CardActions>
            </Card>
        </Grid>
    </Grid>
}
