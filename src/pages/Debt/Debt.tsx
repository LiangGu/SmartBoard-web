import React, { useState, useEffect, } from 'react';
import { useModel } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Spin, Row, Col, Radio, } from 'antd';
//引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入需要用到的图表
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/bar';
// 引入提示框和标题组件
import 'echarts/lib/component/title';
import 'echarts/lib/component/tooltip';
//调用API
import { getDebtChartData, } from '@/services/debt';
//调用公式方法
import { getTotalValue, sortObjectArr, transIntOfArraay, } from '@/utils/utils';
import { getselectBranchID, } from '@/utils/auths';

const Debt: React.FC<{}> = () => {
    const { initialState, } = useModel('@@initialState');
    const [loading, setloading] = useState(false);
    const [type, setType] = useState('总金额');
    const [result, setResult] = useState([]);

    //获取数据
    let fetchData = async (ParamsInfo: any, T: string) => {
        setloading(true);
        const result = await getDebtChartData(ParamsInfo);
        if (!result || getselectBranchID() == '') {
            return;
        }
        if (result) {
            if (result.length > 0) {
                setResult(result);
            }
            //将值传给初始化图表的函数
            initChart(result, T);
            setloading(false);
        }
    }

    //初始化图表
    let Chart_Crosswise: any;
    let Chart_Lengthways: any;
    let initChart = (result: any, type: string) => {
        let Element_Crosswise = document.getElementById('DebtChartCrosswise');
        let Element_Lengthways = document.getElementById('DebtChartLengthways');
        if (Chart_Crosswise != null && Chart_Crosswise != "" && Chart_Crosswise != undefined) {
            Chart_Crosswise.dispose();
        }
        if (Chart_Lengthways != null && Chart_Lengthways != "" && Chart_Lengthways != undefined) {
            Chart_Lengthways.dispose();
        }
        let Option_Crosswise: any;
        let Option_Lengthways: any;

        // 处理 应收账款-区间 数据
        let ReMoney30List: any = [];
        let ReMoney45List: any = [];
        let ReMoney60List: any = [];
        let ReMoney90List: any = [];
        let ReMoney180List: any = [];
        let ReMoney181List: any = [];
        result.forEach((x: { ReMoney30: any; ReMoney45: any; ReMoney60: any; ReMoney90: any; ReMoney180: any; ReMoney181: any; }) => {
            ReMoney30List.push(x.ReMoney30 / 10000);
            ReMoney45List.push(x.ReMoney45 / 10000);
            ReMoney60List.push(x.ReMoney60 / 10000);
            ReMoney90List.push(x.ReMoney90 / 10000);
            ReMoney180List.push(x.ReMoney180 / 10000);
            ReMoney181List.push(x.ReMoney181 / 10000);
        });
        ReMoney30List = getTotalValue(ReMoney30List).toFixed(2);
        ReMoney45List = getTotalValue(ReMoney45List).toFixed(2);
        ReMoney60List = getTotalValue(ReMoney60List).toFixed(2);
        ReMoney90List = getTotalValue(ReMoney90List).toFixed(2);
        ReMoney180List = getTotalValue(ReMoney180List).toFixed(2);
        ReMoney181List = getTotalValue(ReMoney181List).toFixed(2);
        let DebtList: any = [ReMoney30List, ReMoney45List, ReMoney60List, ReMoney90List, ReMoney180List, ReMoney181List];
        // 根据 type 排序
        let DebtTopList: any = [];
        let ReMoneyMoneyTopList: any = [];
        let ReMoney30TopList: any = [];
        let ReMoney45TopList: any = [];
        let ReMoney60TopList: any = [];
        let ReMoney90TopList: any = [];
        let ReMoney180TopList: any = [];
        let ReMoney181TopList: any = [];
        let DebtTopCTNameList: any = [];

        if (type == '总金额') {
            DebtTopList = (result.sort(sortObjectArr('ReceiveMoney', 2)).slice(0, 10)).sort(sortObjectArr('ReceiveMoney', 1));
        } else if (type == '小于30天') {
            DebtTopList = (result.sort(sortObjectArr('ReMoney30', 2)).slice(0, 10)).sort(sortObjectArr('ReMoney30', 1));
        } else if (type == '31-45天') {
            DebtTopList = (result.sort(sortObjectArr('ReMoney45', 2)).slice(0, 10)).sort(sortObjectArr('ReMoney45', 1));
        } else if (type == '46-60天') {
            DebtTopList = (result.sort(sortObjectArr('ReMoney60', 2)).slice(0, 10)).sort(sortObjectArr('ReMoney60', 1));
        } else if (type == '61-90天') {
            DebtTopList = (result.sort(sortObjectArr('ReMoney90', 2)).slice(0, 10)).sort(sortObjectArr('ReMoney90', 1));
        } else if (type == '91-180天') {
            DebtTopList = (result.sort(sortObjectArr('ReMoney180', 2)).slice(0, 10)).sort(sortObjectArr('ReMoney180', 1));
        } else {
            DebtTopList = (result.sort(sortObjectArr('ReMoney181', 2)).slice(0, 10)).sort(sortObjectArr('ReMoney181', 1));
        }
        if (DebtTopList.length > 0) {
            DebtTopList.map((x: { ReceiveMoney: any; ReMoney30: any; ReMoney45: any; ReMoney60: any; ReMoney90: any; ReMoney180: any; ReMoney181: any; CTName: string; }) => {
                ReMoneyMoneyTopList.push((x.ReceiveMoney / 10000).toFixed(2));
                ReMoney30TopList.push((x.ReMoney30 / 10000).toFixed(2));
                ReMoney45TopList.push((x.ReMoney45 / 10000).toFixed(2));
                ReMoney60TopList.push((x.ReMoney60 / 10000).toFixed(2));
                ReMoney90TopList.push((x.ReMoney90 / 10000).toFixed(2));
                ReMoney180TopList.push((x.ReMoney180 / 10000).toFixed(2));
                ReMoney181TopList.push((x.ReMoney181 / 10000).toFixed(2));
                DebtTopCTNameList.push(x.CTName);
            });
        };
        // 赋值图表 series 和 yAxis 中的 name
        let seriesData = [];
        if (type == '总金额') {
            seriesData = [...ReMoneyMoneyTopList];
        } else if (type == '小于30天') {
            seriesData = [...ReMoney30TopList];
        } else if (type == '31-45天') {
            seriesData = [...ReMoney45TopList];
        } else if (type == '46-60天') {
            seriesData = [...ReMoney60TopList];
        } else if (type == '61-90天') {
            seriesData = [...ReMoney90TopList];
        } else if (type == '91-180天') {
            seriesData = [...ReMoney180TopList];
        } else {
            seriesData = [...ReMoney181TopList];
        }

        if (Element_Crosswise) {
            Chart_Crosswise = echarts.init(Element_Crosswise as HTMLDivElement);
            Option_Crosswise = {
                title: {
                    text: '应收账款-区间',
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
                xAxis: {
                    axisLabel: {
                        show: true,
                        color: 'black',
                        fontSize: 16,
                    },
                    data: ["小于30天", "31-45天", "46-60天", "61-90天", "91-180天", "大于180天"],
                },
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
                        name: '应收账款',
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
                        data: transIntOfArraay(DebtList),
                    },
                ]
            };
            Chart_Crosswise.setOption(Option_Crosswise);
            window.addEventListener('resize', () => { Chart_Crosswise.resize() });
        }
        if (Element_Lengthways) {
            Chart_Lengthways = echarts.init(Element_Lengthways as HTMLDivElement);
            Option_Lengthways = {
                title: {
                    text: '应收账款-前10客户',
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
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
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
                yAxis: {
                    type: 'category',
                    scale: true,
                    name: '单位: CNY(万)',
                    nameTextStyle: {
                        color: 'black',
                        fontSize: 16,
                    },
                    data: [...DebtTopCTNameList],
                    //Y轴超长标签换行
                    axisLabel: {
                        show: true,
                        color: 'black',
                        fontSize: 16,
                        interval: 0,
                        //设置字数限制
                        formatter: function (value: any) {
                            if (value.length > 40) {
                                return value.substring(0, 40) + '\n' + value.substring(40, value.length);
                            } else {
                                return value;
                            }
                        },
                    },
                },
                series: [
                    {
                        type: 'bar',
                        name: type,
                        color: '#C23531',
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
                        data: transIntOfArraay(seriesData),
                    }
                ],
            };
            Chart_Lengthways.setOption(Option_Lengthways);
            window.addEventListener('resize', () => { Chart_Lengthways.resize() });
        }
    };

    /**
     * 第2个参数传 [initialState] 相当于 componentWillUnmount 钩子
     */
    useEffect(() => {
        let ParamsInfo: object = {
            BranchID: getselectBranchID(),
        };
        if (getselectBranchID() !== '') {
            fetchData(ParamsInfo, type);
        }
    }, [initialState]);

    /**
     * 点击切换统计图表类型
     */
    const onChangeType = (e: any) => {
        setType(e.target.value);
        initChart(result, e.target.value);
    }

    return (
        <PageContainer>
            <Spin tip="数据正在加载中,请稍等..." spinning={loading}>
                <Card style={{ marginBottom: 10 }}>
                    <div id="DebtChartCrosswise" style={{ width: '100%', height: 500 }}></div>
                </Card>
            </Spin>
            <Spin tip="数据正在加载中,请稍等..." spinning={loading}>
                <Card 
                    extra={
                        <>
                            <Radio.Group defaultValue={type} buttonStyle="solid" onChange={onChangeType}>
                                <Radio.Button value="总金额">总金额</Radio.Button>
                                <Radio.Button value="小于30天">小于30天</Radio.Button>
                                <Radio.Button value="31-45天">31-45天</Radio.Button>
                                <Radio.Button value="46-60天">46-60天</Radio.Button>
                                <Radio.Button value="61-90天">61-90天</Radio.Button>
                                <Radio.Button value="91-180天">91-180天</Radio.Button>
                                <Radio.Button value="大于180天">大于180天</Radio.Button>
                            </Radio.Group>
                        </>
                    }
                >
                    <div id="DebtChartLengthways" style={{ width: '100%', height: 500 }}></div>
                </Card>
            </Spin>
        </PageContainer>
    )
};

export default Debt;