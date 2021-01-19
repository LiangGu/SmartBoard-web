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
import { getRankChartData, } from '@/services/rank';
//调用公式方法
import { sortObjectArr, transIntOfArraay, calculateOfArraay, } from '@/utils/utils';
import { getselectBranchID, getselectYear, getselectOceanTransportType, } from '@/utils/auths';
//引入自定义组件
import SearchButton from '@/components/Search/SearchButton';
//重点代码<React hooks之useContext父子组件传值>
import ContextProps from '@/createContext';

const Rank: React.FC<{}> = () => {
    const { initialState, } = useModel('@@initialState');
    const [loading, setloading] = useState(false);
    const [type, setType] = useState('收入');
    const [top, setTop] = useState(10);
    const [result, setResult] = useState([]);

    //获取数据
    let fetchData = async (ParamsInfo: any, Type: string, Top: Number) => {
        setloading(true);
        const result = await getRankChartData(ParamsInfo);
        if (!result || getselectBranchID() == '') {
            return;
        }
        if (result) {
            if (result.length > 0) {
                setResult(result);
            }
            //将值传给初始化图表的函数
            initChart(result, Type, Top);
            setloading(false);
        };
    }

    //初始化图表
    let myChart: any;
    let initChart = (result: any, type: string, top: Number) => {
        let element = document.getElementById('RankChart');
        if (myChart != null && myChart != "" && myChart != undefined) {
            myChart.dispose();
        }
        let option: any;
        // 根据 type 排序
        let RankTopList: any = [];
        let RankTopTotalARList: any = [];
        let RankTopTotalFCLList: any = [];
        let RankTopTotalLCLList: any = [];
        let RankTopTotalBulkList: any = [];
        let RankTopCTNameList: any = [];
        if (type == '收入') {
            RankTopList = (result.sort(sortObjectArr('TotalAR', 2)).slice(0, top));
        } else if (type == '整箱') {
            RankTopList = (result.sort(sortObjectArr('FLCVolume', 2)).slice(0, top));
        } else if (type == '拼箱') {
            RankTopList = (result.sort(sortObjectArr('LCLVolume', 2)).slice(0, top));
        } else {
            RankTopList = (result.sort(sortObjectArr('BulkVolume', 2)).slice(0, top));
        }
        if (RankTopList.length > 0) {
            RankTopList.map((x: { TotalAR: any; FLCVolume: Number; LCLVolume: Number; BulkVolume: Number; CustomerName: string; }) => {
                RankTopTotalARList.push((x.TotalAR / 10000).toFixed(2));
                RankTopTotalFCLList.push(x.FLCVolume);
                RankTopTotalLCLList.push(x.LCLVolume);
                RankTopTotalBulkList.push(x.BulkVolume);
                RankTopCTNameList.push(x.CustomerName);
            });
        };
        // 赋值图表 series 和 yAxis 中的 name
        let seriesData = [];
        let yAxisName = '';
        if (type == '收入') {
            seriesData = [...RankTopTotalARList];
            yAxisName = '单位: CNY(万)';
        } else if (type == '整箱') {
            seriesData = [...RankTopTotalFCLList];
            yAxisName = '单位: TEU';
        } else if (type == '拼箱') {
            seriesData = [...RankTopTotalLCLList];
            yAxisName = '单位: CBM';
        } else {
            //后台散货存的是 KGS
            seriesData = calculateOfArraay(RankTopTotalBulkList, '/', 1000);
            yAxisName = '单位: TON';
        }

        if (element) {
            myChart = echarts.init(element as HTMLDivElement);
            option = {
                title: {
                    text: `前${top}客户${type}排名`,
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
                    axisLabel: {
                        show: false,
                        // 让显示所有 X 轴
                        // interval: 0,
                        // rotate: 30,
                        color: 'black',
                        fontSize: 16,
                    },
                    data: [...RankTopCTNameList],
                },
                yAxis: {
                    name: yAxisName,
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
                        name: type,
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
                        data: transIntOfArraay(seriesData),
                    }
                ],
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
            Months: initialState?.searchInfo?.MonthList || [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            TransTypes: initialState?.searchInfo?.BizType1List || [1, 2, 3, 4, 5, 6, 10, 11, 12, 13, 14],
            TradeTypes: initialState?.searchInfo?.BizType2List || [1, 2, 3, 4, 5, 6],
            CargoTypes: getselectOceanTransportType(),
        };
        if (getselectBranchID() !== '') {
            fetchData(ParamsInfo, type, top);
        }
    }, [initialState]);

    /**
     * 点击切换统计图表类型
     */
    const onChangeType = (e: any) => {
        setType(e.target.value);
        initChart(result, e.target.value, top);
    }

    /**
     * 点击切换统计图表类型
     */
    const onChangeTop = (e: any) => {
        setTop(e.target.value);
        initChart(result, type, e.target.value);
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

                        <Radio.Group defaultValue={type} buttonStyle="solid" onChange={onChangeType}>
                            <Radio.Button value="收入">收入</Radio.Button>
                            <Radio.Button value="整箱">整箱</Radio.Button>
                            <Radio.Button value="拼箱">拼箱</Radio.Button>
                            <Radio.Button value="散货">散货</Radio.Button>
                        </Radio.Group>
                    </>
                }
            >
                <div id="RankChart" style={{ width: '100%', height: 600 }}></div>
            </Card>

        </Spin>

        {/*重点代码*/}
        <ContextProps.Provider value={3}>
            <SearchButton />
        </ContextProps.Provider>
    </>
};

export default Rank;