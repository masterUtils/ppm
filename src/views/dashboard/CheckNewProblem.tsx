// ** MUI Imports
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import SplitButton from "../../@core/components/select-subject";
import {Subject} from "@prisma/client";
import {useState} from "react";
import Box from "@mui/material/Box";

const CheckNewProblem = () => {

    const [subject, setSubject] = useState<Subject>(Subject.MATH);

    return (
        <Card sx={{position: "relative"}}>
            <CardContent>
                <Typography variant="h6">解题</Typography>
                <Box
                    sx={{
                        my: 6
                    }}
                >
                    <SplitButton
                        onChange={setSubject}
                    />
                </Box>
                <Button size="small" variant="text">
                    解决新题
                </Button>
            </CardContent>
        </Card>
    );
};

export default CheckNewProblem;
