import React, { useState, useEffect, } from 'react';
import { Card, } from 'antd';
import { MonthChartData, } from '../Volume.d'
import { Line } from '@ant-design/charts';
import { getMonthChartData, } from '@/services/volume';

const Month: React.FC<{}> = () => {
    const [data, setData] = useState<MonthChartData[]>([]);

    /**
     * 第2个参数传 [] 相当于 componentDidMount 钩子
     */
    useEffect(() =>{
        const fetchData = async()=>{
            const result = await getMonthChartData();
            console.log(result)
            if(result && result.success){
                setData(result.data);
            }
        }
        fetchData();
    },[]);

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