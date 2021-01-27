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
import { transIntOfArraay, getTotalValue, calculateOfArraay, } from '@/utils/utils';
import { getselectBranchID, getselectYear, getselectOceanTransportType, } from '@/utils/auths';
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
        const result = await getMonthChartData(ParamsInfo);
        if (!result || getselectBranchID() == '') {
            return;
        }
        if (result) {
            let VolumeList: any = [];
            let TotalARList: any = [];
            if (result.length > 0) {
                result.map((x: { Volume: Number; TotalAR: any; }) => {
                    VolumeList.push(x.Volume);
                    TotalARList.push(parseFloat((x.TotalAR / 10000).toFixed(2)));
                });
            }
            settotalRT(getTotalValue(transIntOfArraay(VolumeList)));
            settotalIncome(getTotalValue(transIntOfArraay(TotalARList)))
            //将值传给初始化图表的函数
            initChart(VolumeList, TotalARList);
            setloading(false);
        }
    }

    //初始化图表
    let Chart_RT: any;
    let Chart_Income: any;
    let initChart = (VolumeData: any, IncomeDate: any,) => {
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

        //赋值月度货量图表中的单位
        let UnitName = '';
        if (Number(getselectOceanTransportType()) == 1) {
            UnitName = '单位: TEU';
        } else if (Number(getselectOceanTransportType()) == 2) {
            UnitName = '单位: CBM';
        } else if (Number(getselectOceanTransportType()) == 3) {
            UnitName = '单位: TON';
            //后台散货存的是 KGS
            VolumeData = calculateOfArraay(VolumeData, '/', 1000);
        } else if (Number(getselectOceanTransportType()) == 6) {
            UnitName = '单位: 批次';
        } else if (Number(getselectOceanTransportType()) == 7) {
            UnitName = '单位: KGS';
        } else {
            UnitName = '单位: RT';
        }

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
                toolbox: {
                    feature: {
                        dataView: { show: true, readOnly: false },
                        magicType: { show: true, type: ['line', 'bar'] },
                        restore: { show: true },
                        saveAsImage: { show: true },
                    },
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
                    name: UnitName,
                    nameTextStyle: {
                        color: 'black',
                        fontSize: 16,
                    },
                    axisLabel: {
                        show: true,
                        color: 'black',
                        fontSize: 16,
                    },
                },
                series: [
                    {
                        type: 'bar',
                        name: UnitName,
                        color: '#C23531',
                        label: {
                            show: true,
                            position: 'top',
                            color: 'black',
                            fontSize: 16,
                            formatter: function (params: any) {
                                if (params.value > 0) {
                                    return params.value;
                                } else {
                                    return ' ';
                                }
                            },
                        },
                        data: transIntOfArraay(VolumeData),
                    },
                ]
            };
            Chart_RT.setOption(Option_RT);
            Chart_RT.resize({ width: window.innerWidth - 72 });
            window.addEventListener('resize', () => { Chart_RT.resize({ width: window.innerWidth - 72 }) });
        }
        if (Element_Income) {
            Chart_Income = echarts.init(Element_Income as HTMLDivElement);
            Option_Income = {
                title: {
                    text: '月度收入',
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow',
                    },
                },
                toolbox: {
                    feature: {
                        dataView: { show: true, readOnly: false },
                        magicType: { show: true, type: ['line', 'bar'] },
                        restore: { show: true },
                        saveAsImage: { show: true },
                    },
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
                    name: '单位: CNY(万)',
                    nameTextStyle: {
                        color: 'black',
                        fontSize: 16,
                    },
                    axisLabel: {
                        show: true,
                        color: 'black',
                        fontSize: 16,
                    },
                },
                series: [
                    {
                        type: 'bar',
                        name: '单位: CNY(万)',
                        color: 'green',
                        label: {
                            show: true,
                            position: 'top',
                            color: 'black',
                            fontSize: 16,
                            formatter: function (params: any) {
                                if (params.value > 0) {
                                    return params.value;
                                } else {
                                    return ' ';
                                }
                            },
                        },
                        data: transIntOfArraay(IncomeDate),
                    },
                ]
            };
            Chart_Income.setOption(Option_Income);
            Chart_Income.resize({ width: window.innerWidth - 72 });
            window.addEventListener('resize', () => { Chart_Income.resize({ width: window.innerWidth - 72 }) });
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
        if (getselectBranchID() !== '') {
            fetchData(ParamsInfo);
        }
    }, [initialState]);

    return <>
        <Spin tip="数据正在加载中,请稍等..." spinning={loading} >
            <Card style={{ marginBottom: 10 }}
                extra={
                    <>
                        <span style={{ fontSize: 16, marginRight: 10 }}>
                            总货量: {totalRT}
                        </span>
                        <span style={{ fontSize: 16 }}>
                            平均货量: {totalRT ? (totalRT / 12).toFixed(2) : 0}
                        </span>
                    </>
                }
            >
                <div id="RTMonth" style={{ width: '100%', height: 500 }}></div>
            </Card>
        </Spin>
        <Spin tip="数据正在加载中,请稍等..." spinning={loading} >
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
        </Spin>

        {/*重点代码*/}
        <ContextProps.Provider value={1}>
            <SearchButton />
        </ContextProps.Provider>
    </>
}

export default VolumeMonth;