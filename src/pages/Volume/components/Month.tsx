import React, { } from 'react';
import { Card} from 'antd';
import {MonthChartData} from '../Volume.d'
import { Line } from '@ant-design/charts';

const Month: React.FC<{}> = () => {

    let data:MonthChartData[] = [
        { year: '1991', value: 3 },
        { year: '1992', value: 4 },
        { year: '1993', value: 3.5 },
        { year: '1994', value: 5 },
        { year: '1995', value: 4.9 },
        { year: '1996', value: 6 },
        { year: '1997', value: 7 },
        { year: '1998', value: 9 },
        { year: '1999', value: 13 },
    ];
    const config:object = {
        data,
        xField: 'year',
        yField: 'value',
        point: {
          size: 5,
          shape: 'diamond',
        },
    };


    return <>
        <Card>
          <Line {...config} />




        </Card>
    </>

}
export default Month;