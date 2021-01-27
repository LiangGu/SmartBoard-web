import React, { useState, useEffect, useContext, } from 'react';
import { useModel } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Radio, Spin, } from 'antd';
//  引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入需要用到的图表
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/bar';
// 引入提示框和标题组件
import 'echarts/lib/component/title';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
//调用API
import { getICProfitChartData, } from '@/services/icprofit';
//调用公式方法
import { sortObjectArr, transIntOfArraay, } from '@/utils/utils';
import { getselectBranchID, getselectYear, getselectOceanTransportType, } from '@/utils/auths';
//引入自定义组件
import SearchButton from '@/components/Search/SearchButton';
//重点代码<React hooks之useContext父子组件传值>
import ContextProps from '@/createContext';

const ICProfitBranch: React.FC<{}> = () => {
    const { initialState, } = useModel('@@initialState');
    const [loading, setloading] = useState(false);
    const [type, setType] = useState('收入');
    const [result, setResult] = useState([]);

    //获取数据
    let fetchData = async (ParamsInfo: any, T: string) => {
        setloading(true);
        // const result = await getICProfitChartData(ParamsInfo);

        const result: any = [
            { FinanceMonth: '香港船务', TotalAR: 6053.2 * 10000, TotalAP: 5611.33 * 10000, Profit: 441.87 * 10000 },
            { FinanceMonth: '上海伟运', TotalAR: 25244.18 * 10000, TotalAP: 24296.329999999998 * 10000, Profit: 947.88 * 10000 },
            { FinanceMonth: '泰国公司', TotalAR: 12054.950000000003 * 10000, TotalAP: 7825.809999999999 * 10000, Profit: 4229.16 * 10000 },
            { FinanceMonth: '马来西亚公司', TotalAR: 10602.67 * 10000, TotalAP: 7557.849999999999 * 10000, Profit: 3044.85 * 10000 },
            { FinanceMonth: '印尼公司', TotalAR: 5932.21 * 10000, TotalAP: 4188.14 * 10000, Profit: 1744.07 * 10000 },
            { FinanceMonth: '柬埔寨公司', TotalAR: 7743.99 * 10000, TotalAP: 7104.240000000001 * 10000, Profit: 639.7299999999998 * 10000 },
            { FinanceMonth: '缅甸公司', TotalAR: 1059.52 * 10000, TotalAP: 781.75 * 10000, Profit: 277.76 * 10000 },
            { FinanceMonth: '中越外运', TotalAR: 2948.8700000000003 * 10000, TotalAP: 2372.6400000000003 * 10000, Profit: 576.24 * 10000 },
            { FinanceMonth: '上海伟运工程', TotalAR: 1458.6100000000004 * 10000, TotalAP: 1226.85 * 10000, Profit: 231.75000000000003 * 10000 },

            { FinanceMonth: '大宗商品事业部', TotalAR: 180.82 * 10000, TotalAP: 176.3 * 10000, Profit: 4.52 * 10000 },
            { FinanceMonth: '空运事业部(伟运)', TotalAR: 55.13 * 10000, TotalAP: 49.06 * 10000, Profit: 6.07 * 10000 },
            { FinanceMonth: '电商事业部(伟运)', TotalAR: 23.72 * 10000, TotalAP: 23.62 * 10000, Profit: 0.1200000000000001 * 10000 },
            { FinanceMonth: '中越外运(E拼)', TotalAR: 14694.63 * 10000, TotalAP: 10960.1 * 10000, Profit: 3734.53 * 10000 },
        ];

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
    let myChart: any;
    let initChart = (result: any, type: string) => {
        let element = document.getElementById('ICProfitBranch');
        if (myChart != null && myChart != "" && myChart != undefined) {
            myChart.dispose();
        }
        let option: any;

        // 根据 type 排序
        let SortICProfitList: any = [];
        let TotalARList: any = [];
        let TotalAPList: any = [];
        let ProfitList: any = [];
        let yAxisData: any = [];

        if (type == '收入') {
            SortICProfitList = result.sort(sortObjectArr('TotalAR', 1));
        } else {
            SortICProfitList = result.sort(sortObjectArr('Profit', 1));
        }
        if (SortICProfitList && SortICProfitList.length > 0) {
            SortICProfitList.map((x: { TotalAR: any; TotalAP: any; Profit: any; FinanceMonth: any }) => {
                TotalARList.push((x.TotalAR / 10000).toFixed(2));
                // 支出转换成负数
                TotalAPList.push((x.TotalAP * -1 / 10000).toFixed(2));
                ProfitList.push((x.Profit / 10000).toFixed(2));
                yAxisData.push(`${x.FinanceMonth}`);
            });
        }

        if (element) {
            myChart = echarts.init(element as HTMLDivElement);
            option = {
                title: {
                    text: '公司收支毛利',
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
                legend: {
                    textStyle: {
                        color: 'black',
                        fontSize: 16,
                    },
                    data: ['收入', '支出', '毛利'],
                },
                xAxis: [
                    {
                        type: 'value',
                        axisLabel: {
                            show: true,
                            color: 'black',
                            fontSize: 16,
                        },
                    },
                ],
                yAxis: [
                    {
                        type: 'category',
                        name: '单位: CNY(万)',
                        axisLabel: {
                            show: true,
                            color: 'black',
                            fontSize: 16,
                        },
                        nameTextStyle: {
                            color: 'black',
                            fontSize: 16,
                        },
                        data: [...yAxisData],
                    }
                ],
                series: [
                    {
                        name: '毛利',
                        type: 'bar',
                        color: '#FF7C00',
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
                        data: transIntOfArraay(ProfitList),
                    },
                    {
                        name: '收入',
                        type: 'bar',
                        stack: '总量',
                        color: 'green',
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
                        data: transIntOfArraay(TotalARList),
                    },
                    {
                        name: '支出',
                        type: 'bar',
                        stack: '总量',
                        color: '#C23531',
                        label: {
                            show: true,
                            position: 'left',
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
                        data: transIntOfArraay(TotalAPList),
                    }
                ]
            };
            myChart.setOption(option);
            myChart.resize({ width: window.innerWidth });
            window.addEventListener('resize', () => { myChart.resize({ width: window.innerWidth }) });
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
                <Card
                    extra={
                        <>
                            <Radio.Group defaultValue={type} buttonStyle="solid" onChange={onChangeType}>
                                <Radio.Button value="收入">收入</Radio.Button>
                                <Radio.Button value="毛利">毛利</Radio.Button>
                            </Radio.Group>
                        </>
                    }
                >
                    <div id="ICProfitBranch" style={{ width: '100%', height: 800 }}></div>
                </Card>
            </Spin>

            {/*重点代码*/}
            <ContextProps.Provider value={8}>
                <SearchButton />
            </ContextProps.Provider>
        </PageContainer>
    )
};

export default ICProfitBranch;