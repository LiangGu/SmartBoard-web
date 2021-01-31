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
import { getVolumeChartData, getProfitChartData, } from '@/services/volume';
//调用公式方法
import { transIntOfArraay, getTotalValue, getLineStackSeriesData, getLineStackLegendData, } from '@/utils/utils';
import { getselectBranchID, getselectYear, getselectBusinessesLine, getselectBizType1List_Radio, getselectOceanTransportType, } from '@/utils/auths';
//引入自定义组件
import SearchButton from '@/components/Search/SearchButton';
//重点代码<React hooks之useContext父子组件传值>
import ContextProps from '@/createContext';

const VolumeMonth: React.FC<{}> = () => {
    const { initialState, } = useModel('@@initialState');
    const [loading, setloading] = useState(false);
    const [totalRT, settotalRT] = useState(0);
    const [totalIncome, settotalIncome] = useState(0);

    //获取数据
    let fetchData = async (ParamsInfo: any) => {
        setloading(true);
        //货量
        const resultVolume = await getVolumeChartData(ParamsInfo);
        //收支利润<钱>
        // const resultMoney = await getProfitChartData(ParamsInfo);
        if (!resultVolume || getselectBranchID() == '') {
            return;
        }
        if (resultVolume) {
            //当前选择年的货量数据
            let SelectYearVolumeData: any = [];
            if (resultVolume.length > 0) {
                SelectYearVolumeData = resultVolume.filter((x: { Year: any; }) => x.Year == ParamsInfo.Year);
            }
            // let VolumeList: any = [];
            // let IncomeList: any = [];
            //计算合计要用到下面2个数据集
            // if (SelectYearVolumeData.length > 0) {
            //     SelectYearVolumeData.map((x: { Volume: Number;}) => {
            //         VolumeList.push(x.Volume);
            //     });
            // }
            // if (resultMoney.length > 0) {
            //     resultMoney.map((x: { AmountAR: any;}) => {
            //         IncomeList.push(parseFloat((x.AmountAR / 10000).toFixed(2)));
            //     });
            // }
            // settotalRT(getTotalValue(transIntOfArraay(VolumeList)));
            // settotalIncome(getTotalValue(transIntOfArraay(IncomeList)));

            let LegendData = [];
            let SeriesData = [];
            if (SelectYearVolumeData && SelectYearVolumeData.length > 0) {
                LegendData = getLineStackLegendData(SelectYearVolumeData, 1);
                SeriesData = getLineStackSeriesData(SelectYearVolumeData, 1);
            }
            //将值传给初始化图表的函数
            initChart(SelectYearVolumeData);
            setloading(false);
        }
    }

    //初始化图表
    let Chart_RT: any;
    let Chart_Income: any;
    let initChart = (SelectYearVolumeData: any,) => {
        let Element_RT = document.getElementById('RTMonth');
        let Element_Income = document.getElementById('IncomeMonth');
        if (Chart_RT != null && Chart_RT != "" && Chart_RT != undefined) {
            Chart_RT.dispose();
        }
        if (Chart_Income != null && Chart_Income != "" && Chart_Income != undefined) {
            Chart_Income.dispose();
        }
        let Option_RT: any;
        let Option_Income: any;

        if (Element_RT) {
            Chart_RT = echarts.init(Element_RT as HTMLDivElement);
            Option_RT = {
                title: {
                    text: '月度货量',
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow',
                    },
                },
                legend: {
                    data: getLineStackLegendData(SelectYearVolumeData, 1),
                },
                toolbox: {
                    feature: {
                        dataView: { show: true, readOnly: false },
                        magicType: { show: true, type: ['line', 'bar'] },
                        restore: { show: true },
                        saveAsImage: { show: true },
                    },
                },
                grid: {
                    left: '5%',
                    right: '5%',
                    top: '10%',
                    bottom: '10%',
                    containLabel: true,
                },
                xAxis: [
                    {
                        type: 'category',
                        axisLabel: {
                            show: true,
                            color: 'black',
                            fontSize: 16,
                        },
                        data: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
                    },
                ],
                yAxis: {
                    type: 'value'
                },
                series: getLineStackSeriesData(SelectYearVolumeData, 1),
            };
            Chart_RT.setOption(Option_RT, true);
            Chart_RT.resize({ width: window.innerWidth - 72 });
            window.addEventListener('resize', () => { Chart_RT.resize({ width: window.innerWidth - 72 }) });
        }
        // if (Element_Income) {
        //     Chart_Income = echarts.init(Element_Income as HTMLDivElement);
        //     Option_Income = {
        //         title: {
        //             text: '月度收入',
        //         },
        //         tooltip: {
        //             trigger: 'axis',
        //             axisPointer: {
        //                 type: 'shadow',
        //             },
        //         },
        //         legend: {
        //             data: getLineStackLegendData(VolumeData, 2),
        //         },
        //         toolbox: {
        //             feature: {
        //                 dataView: { show: true, readOnly: false },
        //                 magicType: { show: true, type: ['line', 'bar'] },
        //                 restore: { show: true },
        //                 saveAsImage: { show: true },
        //             },
        //         },
        //         grid: {
        //             left: '5%',
        //             right: '5%',
        //             top: '10%',
        //             bottom: '10%',
        //             containLabel: true,
        //         },
        //         xAxis: [
        //             {
        //                 type: 'category',
        //                 axisLabel: {
        //                     show: true,
        //                     color: 'black',
        //                     fontSize: 16,
        //                 },
        //                 data: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        //             },
        //         ],
        //         yAxis: {
        //             type: 'value'
        //         },
        //         series: getLineStackSeriesData(MoneyDate, 2),
        //     };
        //     Chart_Income.setOption(Option_Income, true);
        //     Chart_Income.resize({ width: window.innerWidth - 72 });
        //     window.addEventListener('resize', () => { Chart_Income.resize({ width: window.innerWidth - 72 }) });
        // }
    };

    /**
     * 第2个参数传 [initialState] 相当于 componentWillUnmount 钩子
     */
    useEffect(() => {
        let ParamsInfo: object = {
            BranchID: getselectBranchID(),
            Year: getselectYear(),
            Months: initialState?.searchInfo?.MonthList || [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            BizLines: [getselectBusinessesLine()],
            TransTypes: [getselectBizType1List_Radio()],
            TradeTypes: initialState?.searchInfo?.BizType2List || [1, 2, 3, 4, 5, 6],
            CargoTypes: getselectOceanTransportType() == 'null' ? [] : [getselectOceanTransportType()],
        };
        if (getselectBranchID() !== '') {
            fetchData(ParamsInfo);
        }
    }, [initialState]);

    return <>
        <Spin tip="数据正在加载中,请稍等..." spinning={loading} >
            <Card style={{ marginBottom: 10 }}
                extra={
                    <>
                        {/* <span style={{ fontSize: 16, marginRight: 10 }}>
                            总货量: {totalRT}
                        </span>
                        <span style={{ fontSize: 16 }}>
                            平均货量: {totalRT ? (totalRT / 12).toFixed(2) : 0}
                        </span> */}
                    </>
                }
            >
                <div id="RTMonth" style={{ width: '100%', height: 800 }}></div>
            </Card>
        </Spin>
        {/* <Spin tip="数据正在加载中,请稍等..." spinning={loading} >
            <Card
                extra={
                    <>
                        <span style={{ fontSize: 16, marginRight: 10 }}>
                            总收入: {totalIncome}
                        </span>
                        <span style={{ fontSize: 16 }}>
                            平均收入: {totalIncome ? (totalIncome / 12).toFixed(2) : 0}
                        </span>
                    </>
                }
            >
                <div id="IncomeMonth" style={{ width: '100%', height: 500 }}></div>
            </Card>
        </Spin> */}

        {/*重点代码*/}
        <ContextProps.Provider value={1.2}>
            <SearchButton />
        </ContextProps.Provider>
    </>
}

export default VolumeMonth;