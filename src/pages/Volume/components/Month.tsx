import React, { useState, useEffect, } from 'react';
import { useModel } from 'umi';
import { Card, Spin, } from 'antd';
//引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入需要用到的图表
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/bar';
// 引入提示框和标题组件
import 'echarts/lib/component/title';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
//调用API
import { getMonthChartData, } from '@/services/volume';
//调用公式方法
import { getMaxValue, getMinValue, } from '@/utils/utils';
import { getselectBranchID, getselectYear, getselectOceanTransportType,} from '@/utils/auths';
//引入自定义组件
import SearchButton from '@/components/Search/SearchButton';
//重点代码<React hooks之useContext父子组件传值>
import ContextProps from '@/createContext';

const Month: React.FC<{}> = () => {
    const { initialState, } = useModel('@@initialState');
    const [loading, setloading] = useState(false);
    //获取数据
    let fetchData = async (ParamsInfo: any) => {
        setloading(true);
        const result = await getMonthChartData(ParamsInfo);
        if (!result || getselectBranchID() == '') {
            return;
        }
        if (result) {
            let VolumeList: any = [];
            let TotalARList: any = [];
            if (result) {
                result.map((x: { Volume: Number; TotalAR: any; }) => {
                    VolumeList.push(x.Volume);
                    TotalARList.push(parseFloat((x.TotalAR / 10000).toFixed(2)));
                });
            }
            //将值传给初始化图表的函数
            initChart(VolumeList, TotalARList);
            setloading(false);
        }
    }
    //初始化图表
    let initChart = (VolumeData: any, IncomeDate: any,) => {
        let element = document.getElementById('MonthChart');
        let myChart: any;
        let option: any;
        // 赋值 legend 和图表 series 和 yAxis 中的 name
        let legendData:any = [];
        let yAxisName = '';
        let seriesName = '';
        if(Number(getselectOceanTransportType()) == 1){
            legendData = ['TEU','CNY(万)'];
            yAxisName = '整箱: TEU';
            seriesName = 'TEU';
        }else if(Number(getselectOceanTransportType()) == 2){
            legendData = ['CBM','CNY(万)'];
            yAxisName = '拼箱: CBM';
            seriesName = 'CBM';
        }else if(Number(getselectOceanTransportType()) == 3){
            legendData = ['KGS','CNY(万)'];
            yAxisName = '散货: KGS';
            seriesName = 'KGS';
        }else if(Number(getselectOceanTransportType()) == 6){
            legendData = ['批次','CNY(万)'];
            yAxisName = '整车: 批次';
            seriesName = '批次';
        }else if(Number(getselectOceanTransportType()) == 7){
            legendData = ['KGS','CNY(万)'];
            yAxisName = '零担: KGS';
            seriesName = 'KGS';
        }else{
            legendData = ['RT','CNY(万)'];
            yAxisName = 'RT';
            seriesName = 'RT';
        }

        if(element){
            myChart = echarts.init(element as HTMLDivElement);
            option = {
                title: {
                    text: '月份货量',
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#C23531'
                        }
                    }
                },
                toolbox: {
                    feature: {
                        dataView: { show: true, readOnly: false },
                        magicType: { show: true, type: ['line', 'bar'] },
                        restore: { show: true },
                        saveAsImage: { show: true }
                    }
                },
                legend: {
                    data: [...legendData],
                },
                xAxis: [
                    {
                        type: 'category',
                        data: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
                    },
                ],
                yAxis: [
                    {
                        type: 'value',
                        scale: true,
                        name: yAxisName,
                        min: getMinValue(VolumeData),
                        max: getMaxValue(VolumeData),
                        splitNumber: 5,
                        interval: (getMaxValue(VolumeData) - getMinValue(VolumeData)) / 5
                    },
                    {
                        type: 'value',
                        scale: true,
                        name: '收入: CNY(万)',
                        min: getMinValue(IncomeDate),
                        max: getMaxValue(IncomeDate),
                        splitNumber: 5,
                        interval: (getMaxValue(IncomeDate) - getMinValue(IncomeDate)) / 5
                    }
                ],
                series: [
                    {
                        name: seriesName,
                        type: 'bar',
                        color: '#61A0A8',
                        data: [...VolumeData]
                    },
                    {
                        name: 'CNY(万)',
                        type: 'line',
                        color: '#C23531',
                        yAxisIndex: 1,
                        data: [...IncomeDate]
                    },
                ]
            };
            myChart.setOption(option);
            window.addEventListener('resize', () => { myChart.resize() });
        }
    };

    /**
     * 第2个参数传 [initialState] 相当于 componentWillUnmount 钩子
     */
    useEffect(() => {
        let ParamsInfo: object = {
            BranchID: getselectBranchID(),
            Year: getselectYear(),
            TransTypes: initialState?.searchInfo?.BizType1List || [1, 2, 3, 4, 5, 6, 10, 11, 12, 13, 14],
            TradeTypes: initialState?.searchInfo?.BizType2List || [1, 2, 3, 4, 5, 6],
            CargoTypes: getselectOceanTransportType(),
        };
        if (getselectBranchID() !=='') {
            fetchData(ParamsInfo);
        }
    }, [initialState]);

    return <>
        <Spin tip="页面正在加载中..." spinning={loading}>
            <Card>
                <div id="MonthChart" style={{ width: '100%', height: 600 }}></div>
            </Card>
        </Spin>

        {/*重点代码*/}
        <ContextProps.Provider value={1}>
            <SearchButton />
        </ContextProps.Provider>
    </>
}

export default Month;