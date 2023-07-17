// ** MUI Imports
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import {Subject} from "@prisma/client";
import {useCallback, useState} from "react";
import Box from "@mui/material/Box";
import {Autocomplete} from "@mui/material";
import TextField from "@mui/material/TextField";
import CardHeader from "@mui/material/CardHeader";
import {useEffectOnce, useLocalStorage} from "usehooks-ts";
import useSWR from "swr";

export const subjects: Record<Subject, string> = {
    MATH: '数学',
    COMPUTER_NETWORK: '计算机网络',
    DATA_STRUCTURE: '数据结构',
    ENGLISH: '英语',
    OPERATING_SYSTEM: '操作系统',
    POCO: '计算机组成原理',
    POLITICS: '政治',
}

const options = Object.values(subjects);

const CheckNewProblem = () => {
    const [subject, setSubject] = useLocalStorage<Subject>('subject', Subject.MATH);

    const onSubjectChange = useCallback((event: React.SyntheticEvent, value: string) => {
        const key = Object.keys(subjects).find(key => subjects[key as Subject] === value) as string;
        setSubject(key as Subject);
    }, [setSubject])


    const [books, setBooks] = useState<{
        id: number;
        name: string;
        subject: Subject;
    }[]>([]);

    useEffectOnce(() => {
        fetch('/api/sourceBooks').then(res => res.json()).then(res => {
            setBooks(res)
        })
    })

    const bookDisplay = books
        .filter(book => book.subject === subject)
        .map(book => book.name)

    return (
        <Card sx={{position: "relative"}}>
            <CardHeader
                title="解题"
            />
            <CardContent>
                <Box sx={{display: "flex", justifyContent: "space-between", my: 2}}>
                    <Autocomplete
                        options={options}
                        value={subjects[subject]}
                        onChange={onSubjectChange}
                        sx={{mr: 2, flexGrow: 1}}
                        disableClearable
                        renderInput={(params) => <TextField {...params} label="科目"/>}
                    />
                    <Autocomplete
                        sx={{flexGrow: 1}}
                        disabled={bookDisplay.length === 0}
                        options={bookDisplay}
                        renderInput={(params) => <TextField {...params} label="书籍"/>}
                    />
                </Box>
                <Button
                    disabled={bookDisplay.length === 0}
                    variant="contained">
                    解决新题
                </Button>
            </CardContent>
        </Card>
    );
};


export default CheckNewProblem;
