// ** MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

// ** Third Party Imports
import {ApexOptions} from 'apexcharts'

// ** Custom Components Imports
import ReactApexcharts from 'src/@core/components/react-apexcharts'
import moment from "moment-timezone";

export interface WeeklyOverviewProps {
    learn: number[],
    review: number[],
    duration: number[]
}

const WeeklyOverview = (props: WeeklyOverviewProps) => {

    const options: ApexOptions = {
        chart: {
            parentHeightOffset: 0,
            toolbar: {show: false},
            zoom: {enabled: false},
            type: "line"
        },
        stroke: {
            width: 2,
            curve: 'smooth'
        },
        colors: ["#448aff", "#00695c", "#ff5252"],
        legend: {
            show: true,
            position: 'top'
        },
        grid: {
            strokeDashArray: 7,
            padding: {
                top: -1,
                right: 0,
                left: -12,
                bottom: 5
            }
        },
        dataLabels: {
            enabled: false,
        },
        // states: {
        //     hover: {
        //         filter: {type: 'none'}
        //     },
        //     active: {
        //         filter: {type: 'none'}
        //     }
        // },
        // colors: [
        //     theme.palette.primary.main
        // ],
        xaxis: {
            categories: (() => {
                const today = moment.tz('Asia/Shanghai').startOf('day');
                const days: string[] = [];
                const start = today.clone().subtract(6, 'days');
                for (let i = 0; i < 7; i++) {
                    days.push(start.clone().add(i, 'days').format('MM-DD'));
                }
                return days;
            })(),
            tickPlacement: 'on',
            labels: {show: true},
            axisTicks: {show: true},
            axisBorder: {show: true}
        },
        yaxis: {
            show: true,
            tickAmount: 4,
            labels: {
                offsetX: -17,
            }
        }
    }

    return (
        <Card>
            <CardHeader
                title='单词背诵'
                titleTypographyProps={{
                    sx: {lineHeight: '2rem !important', letterSpacing: '0.15px !important'}
                }}
                // action={
                //     <IconButton size='small' aria-label='settings' className='card-more-options'
                //                 sx={{color: 'text.secondary'}}>
                //         <DotsVertical/>
                //     </IconButton>
                // }
            />
            <CardContent>
                <ReactApexcharts type='line' height={312} options={options}
                                 series={
                                     [
                                         {name: "学习", data: props.learn},
                                         {name: "复习", data: props.review},
                                         {name: "时长", data: props.duration}
                                     ]
                                 }/>
            </CardContent>
        </Card>
    )
}

export default WeeklyOverview
