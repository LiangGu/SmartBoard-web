import React, { useState, useEffect, } from 'react';
import { useModel } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Spin, Row, Col, } from 'antd';
//  引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入需要用到的图表
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/pie';
// 引入提示框和标题组件
import 'echarts/lib/component/title';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
//调用API
import { getBranchChartData, } from '@/services/volume';
//调用公式方法
import { transIntOfArraay, FilterZeroOfArraay, } from '@/utils/utils';
import { getselectBranchID, getselectYear, getselectBusinessesLine, getselectBizType1List_Radio, getselectOceanTransportType, } from '@/utils/auths';
//引入自定义组件
import SearchButton from '@/components/Search/SearchButton';
//重点代码<React hooks之useContext父子组件传值>
import ContextProps from '@/createContext';

const VolumeBranch: React.FC<{}> = () => {
    const { initialState, } = useModel('@@initialState');
    const [loading, setloading] = useState(false);

    //获取数据
    let fetchData = async (ParamsInfo: any) => {
        setloading(true);
        const result = await getBranchChartData(ParamsInfo);
        if (!result || getselectBranchID() == '') {
            return;
        }
        if (result) {
            //将值传给初始化图表的函数
            initChart(result, ParamsInfo);
            setloading(false);
        }
    }

    //初始化图表
    let Chart_Pie: any;
    let Chart_Bar: any;
    let initChart = (result: any, ParamsInfo: any) => {
        let Element_Pie = document.getElementById('VolumeBusinessLinePie');
        let Element_Bar = document.getElementById('VolumeBusinessLineBar');
        if (Chart_Pie != null && Chart_Pie != "" && Chart_Pie != undefined) {
            Chart_Pie.dispose();
        }
        if (Chart_Bar != null && Chart_Bar != "" && Chart_Bar != undefined) {
            Chart_Bar.dispose();
        }
        let Option_Pie: any;
        let Option_Bar: any;

        //饼图数据
        let SelectYearDataPie: any = [];
        let PieLegendData: any = [];
        let PieSeriesData: any = [];
        //柱状图数据
        let SelectYearDataBar: any = [];
        let LastYearDataBar: any = [];
        let BarxAxisData: any = [];
        let BarSeriesData_SelectYear: any = [];
        let BarSeriesData_LastYear: any = [];

        if (result.length > 0) {
            //柱状图
            SelectYearDataBar = result.filter((x: { FinanceYear: any; }) => x.FinanceYear == ParamsInfo.Year);
            LastYearDataBar = result.filter((x: { FinanceYear: any; }) => x.FinanceYear == ParamsInfo.Year - 1);
            //饼图
            SelectYearDataPie = result.filter((x: { FinanceYear: any; }) => x.FinanceYear == ParamsInfo.Year);
        }
        //赋值饼图 + 公司名信息
        if (SelectYearDataPie.length > 0) {
            FilterZeroOfArraay(SelectYearDataPie,0,'Volume').map((x: { Volume: number; BranchName: string; }) => {
                PieLegendData.push(x.BranchName);
                PieSeriesData.push({
                    value: x.Volume,
                    name: x.BranchName,
                });
                //当前选择的年和前一年的公司List是相同的,所以在这边直接赋值 BarxAxisData
                BarxAxisData.push(x.BranchName);
            });
        }
        //赋值柱状图当前选择的年和前一年
        if (SelectYearDataBar.length > 0) {
            FilterZeroOfArraay(SelectYearDataBar,0,'Volume').map((x: { Volume: number; }) => {
                BarSeriesData_SelectYear.push(x.Volume);
            });
        }
        if (LastYearDataBar.length > 0) {
            FilterZeroOfArraay(LastYearDataBar,0,'Volume').map((x: { Volume: number; }) => {
                BarSeriesData_LastYear.push(x.Volume);
            });
        }

        if (Element_Pie) {
            Chart_Pie = echarts.init(Element_Pie as HTMLDivElement);
            Option_Pie = {
                title: {
                    text: `累计占比(${getselectYear()})`,
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{b} : {c} ({d}%)',
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
                legend: {
                    textStyle: {
                        color: 'black',
                        fontSize: 16,
                    },
                    data: [...PieLegendData],
                },
                series: [
                    {
                        type: 'pie',
                        radius: '70%',
                        center: ['50%', '50%'],
                        data: [...PieSeriesData],
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)',
                            }
                        },
                        label: {
                            show: true,
                            fontSize: 16,
                        },
                    },
                ]
            };
            Chart_Pie.setOption(Option_Pie, true);
            Chart_Pie.resize({ width: (window.innerWidth - 72) / 2 });
            window.addEventListener('resize', () => { Chart_Pie.resize({ width: (window.innerWidth - 72) / 2 }) });
        }
        if (Element_Bar) {
            Chart_Bar = echarts.init(Element_Bar as HTMLDivElement);
            Option_Bar = {
                title: {
                    text: '累计同比',
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
                grid: {
                    left: '5%',
                    right: '5%',
                    top: '10%',
                    bottom: '10%',
                    containLabel: true,
                },
                xAxis: {
                    type: 'value',
                    axisLabel: {
                        show: true,
                        color: 'black',
                        fontSize: 16,
                    },
                    boundaryGap: [0, 0.01],
                },
                legend: {
                    textStyle: {
                        color: 'black',
                        fontSize: 16,
                    },
                    data: [`${ParamsInfo.Year - 1}`, `${ParamsInfo.Year}`],
                },
                yAxis: {
                    type: 'category',
                    scale: true,
                    axisLabel: {
                        show: true,
                        color: 'black',
                        fontSize: 16,
                    },
                    nameTextStyle: {
                        color: 'black',
                        fontSize: 16,
                    },
                    data: [...BarxAxisData],
                },
                series: [
                    {
                        type: 'bar',
                        name: `${ParamsInfo.Year - 1}`,
                        label: {
                            show: true,
                            position: 'right',
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
                        data: transIntOfArraay(BarSeriesData_LastYear),
                    },
                    {
                        type: 'bar',
                        name: `${ParamsInfo.Year}`,
                        label: {
                            show: true,
                            position: 'right',
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
                        data: transIntOfArraay(BarSeriesData_SelectYear),
                    },
                ]
            };
            Chart_Bar.setOption(Option_Bar, true);
            Chart_Bar.resize({ width: (window.innerWidth - 72) / 2 });
            window.addEventListener('resize', () => { Chart_Bar.resize({ width: (window.innerWidth - 72) / 2 }) });
        }
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

    return (
        <PageContainer>

            <Spin tip="数据正在加载中,请稍等..." spinning={loading}>
                <Card style={{ marginBottom: 10 }}>
                    <Row>
                        <Col span={12}>
                            <div id="VolumeBusinessLinePie" style={{ width: '100%', height: 800 }}></div>
                        </Col>
                        <Col span={12}>
                            <div id="VolumeBusinessLineBar" style={{ width: '100%', height: 800 }}></div>
                        </Col>
                    </Row>
                </Card>
            </Spin>

            {/*重点代码*/}
            <ContextProps.Provider value={1.1}>
                <SearchButton />
            </ContextProps.Provider>
        </PageContainer>
    )
};

export default VolumeBranch;