import React, { useState, useEffect, } from 'react';
import { useModel } from 'umi';
import { Card, Radio, Spin, } from 'antd';
//引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入需要用到的图表
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/bar';
// 引入提示框和标题组件
import 'echarts/lib/component/title';
import 'echarts/lib/component/tooltip';
//调用API
import { getRankIncomeData, } from '@/services/rank';
//调用公式方法
import { sortObjectArr, transIntOfArraay, FilterZeroOfArraay, } from '@/utils/utils';
import { getselectBranchID, getselectYear, } from '@/utils/auths';
//引入自定义组件
import SearchButton from '@/components/Search/SearchButton';
//重点代码<React hooks之useContext父子组件传值>
import ContextProps from '@/createContext';

const RankIncome: React.FC<{}> = () => {
    const { initialState, } = useModel('@@initialState');
    const [loading, setloading] = useState(false);
    const [top, setTop] = useState(10);
    const [result, setResult] = useState([]);
    const [domHeight, setDomHeight] = useState(800);

    //获取数据
    let fetchData = async (ParamsInfo: any, Top: Number, domHeight: Number) => {
        setloading(true);
        const result = await getRankIncomeData(ParamsInfo);
        if (!result || getselectBranchID() == '') {
            return;
        }
        if (result) {
            if (result.length > 0) {
                setResult(result);
            }
            //将值传给初始化图表的函数
            initChart(result, Top, domHeight);
            setloading(false);
        };
    }

    //初始化图表
    let myChart: any;
    let initChart = (result: any, top: Number, domHeight: Number) => {
        let element = document.getElementById('RankIncomeChart');
        if (myChart != null && myChart != "" && myChart != undefined) {
            myChart.dispose();
        }
        let option: any;

        let RankTopList: any = [];
        let RankTopTotalIncomeList: any = [];
        let RankTopCTNameList: any = [];
        RankTopList = FilterZeroOfArraay((result.sort(sortObjectArr('AmountAR', 2)).slice(0, top)).sort(sortObjectArr('AmountAR', 1)), 0, 'AmountAR');
        if (RankTopList.length > 0) {
            RankTopList.map((x: { AmountAR: any; CustomerName: string; }) => {
                RankTopTotalIncomeList.push((x.AmountAR / 10000).toFixed(2));
                RankTopCTNameList.push(x.CustomerName);
            });
        };

        if (element) {
            myChart = echarts.init(element as HTMLDivElement);
            option = {
                title: {
                    text: `前${top}客户收入排名`,
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
                yAxis: {
                    type: 'category',
                    name: '单位: CNY(万)',
                    scale: true,
                    nameTextStyle: {
                        color: 'black',
                        fontSize: 16,
                    },
                    data: [...RankTopCTNameList],
                    //Y轴超长标签换行
                    axisLabel: {
                        show: true,
                        color: 'black',
                        fontSize: 16,
                        interval: 0,
                        //设置字数限制
                        // formatter: function (value: any) {
                        //     if (value.length > 40) {
                        //         return value.substring(0, 40) + '\n' + value.substring(40, value.length);
                        //     } else {
                        //         return value;
                        //     }
                        // },
                    },
                },
                series: [
                    {
                        type: 'bar',
                        name: '收入',
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
                        data: transIntOfArraay(RankTopTotalIncomeList),
                    }
                ],
            };
            myChart.setOption(option, true);
            myChart.resize({ height: domHeight });
            window.addEventListener('resize', () => { myChart.resize() });
        }
    };

    /**
     * 第2个参数传 [initialState] 相当于 componentDidUpdate 钩子
     */
    useEffect(() => {
        let ParamsInfo: object = {
            BranchID: getselectBranchID(),
            Year: getselectYear(),
            Months: initialState?.searchInfo?.MonthList || [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            BizLines: initialState?.searchInfo?.BusinessesLineList || [1, 2, 3, 4, 5],
            TransTypes: initialState?.searchInfo?.BizType1List_MultiSelect || [1, 2, 3, 4, 5, 6, 10, 11, 12, 13, 14],
            TradeTypes: initialState?.searchInfo?.BizType2List || [1, 2, 3, 4, 5, 6],
            CargoTypes: initialState?.searchInfo?.OceanTransportTypeList_MultiSelect || [1, 2, 3, 6, 7],
        };
        if (getselectBranchID() !== '') {
            fetchData(ParamsInfo, top, domHeight);
        }
    }, [initialState]);

    /**
     * 点击切换统计图表类型
     */
    const onChangeTop = (e: any) => {
        setTop(e.target.value);
        let DomHeight = domHeight;
        if (e && e.target.value) {
            if (e.target.value == 10) {
                DomHeight = 800;
            } else if (e.target.value == 20) {
                DomHeight = 1000;
            } else if (e.target.value == 30) {
                DomHeight = 1200;
            } else if (e.target.value == 40) {
                DomHeight = 1400;
            } else if (e.target.value == 50) {
                DomHeight = 1600;
            }
        }
        setDomHeight(DomHeight);
        initChart(result, e.target.value, DomHeight);
    }

    return <>
        <Spin tip="数据正在加载中,请稍等..." spinning={loading}>
            <Card
                extra={
                    <>
                        <Radio.Group defaultValue={top} buttonStyle="solid" onChange={onChangeTop} style={{ marginRight: 20 }}>
                            <Radio.Button value={10}>前10</Radio.Button>
                            <Radio.Button value={20}>前20</Radio.Button>
                            <Radio.Button value={30}>前30</Radio.Button>
                            <Radio.Button value={40}>前40</Radio.Button>
                            <Radio.Button value={50}>前50</Radio.Button>
                        </Radio.Group>
                    </>
                }
            >
                <div id="RankIncomeChart" style={{ width: '100%', height: domHeight }}></div>
            </Card>

        </Spin>

        {/*重点代码*/}
        <ContextProps.Provider value={5.1}>
            <SearchButton />
        </ContextProps.Provider>
    </>
};

export default RankIncome;