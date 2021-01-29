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
import { getPortChartData, } from '@/services/volume';
//调用公式方法
import { sortObjectArr, transIntOfArraay, calculateOfArraay, FilterZeroOfArraay, } from '@/utils/utils';
import { getselectBranchID, getselectYear, } from '@/utils/auths';
//引入自定义组件
import SearchButton from '@/components/Search/SearchButton';
//重点代码<React hooks之useContext父子组件传值>
import ContextProps from '@/createContext';

const VolumePort: React.FC<{}> = () => {
    const { initialState, } = useModel('@@initialState');
    const [loading, setloading] = useState(false);
    const [type, setType] = useState('收入');
    const [result, setResult] = useState([]);

    //获取数据
    let fetchData = async (ParamsInfo: any, T: string) => {
        setloading(true);
        const result = await getPortChartData(ParamsInfo);
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
        let element = document.getElementById('VolumePort');
        if (myChart != null && myChart != "" && myChart != undefined) {
            myChart.dispose();
        }
        let option: any;

        // 根据 type 排序
        let PortTopList: any = [];
        let PortTopTotalARList: any = [];
        let PortTopTotalFCLList: any = [];
        let PortTopTotalLCLList: any = [];
        let PortTopTotalBulkList: any = [];
        let PortTopPortNameList: any = [];
        if (type == '收入') {
            PortTopList = FilterZeroOfArraay((result.sort(sortObjectArr('TotalAR', 2)).slice(0, 10)).sort(sortObjectArr('TotalAR', 1)), 10000, 'TotalAR');
        } else if (type == '整箱') {
            PortTopList = FilterZeroOfArraay((result.sort(sortObjectArr('FLCVolume', 2)).slice(0, 10)).sort(sortObjectArr('FLCVolume', 1)), 0, 'FLCVolume');
        } else if (type == '拼箱') {
            PortTopList = FilterZeroOfArraay((result.sort(sortObjectArr('LCLVolume', 2)).slice(0, 10)).sort(sortObjectArr('LCLVolume', 1)), 0, 'LCLVolume');
        } else {
            PortTopList = FilterZeroOfArraay((result.sort(sortObjectArr('BulkVolume', 2)).slice(0, 10)).sort(sortObjectArr('BulkVolume', 1)), 0, 'BulkVolume');
        }
        if (PortTopList.length > 0) {
            PortTopList.map((x: { TotalAR: any; FLCVolume: any; LCLVolume: any; BulkVolume: any; PortName: string; }) => {
                PortTopTotalARList.push((x.TotalAR / 10000).toFixed(2));
                PortTopTotalFCLList.push(x.FLCVolume);
                PortTopTotalLCLList.push(x.LCLVolume);
                PortTopTotalBulkList.push(x.BulkVolume);
                PortTopPortNameList.push(x.PortName);
            });
        }
        // 赋值图表 series 和 yAxis 中的 name
        let seriesData = [];
        let yAxisName = '';
        if (type == '收入') {
            seriesData = [...PortTopTotalARList];
            yAxisName = '单位: CNY(万)';
        } else if (type == '整箱') {
            seriesData = [...PortTopTotalFCLList];
            yAxisName = '单位: TEU';
        } else if (type == '拼箱') {
            seriesData = [...PortTopTotalLCLList];
            yAxisName = '单位: CBM';
        } else {
            //后台散货存的是 KGS
            seriesData = calculateOfArraay(PortTopTotalBulkList, '/', 1000);
            yAxisName = '单位: TON';
        }

        if (element) {
            myChart = echarts.init(element as HTMLDivElement);
            option = {
                title: {
                    text: `前10港口${type}排名`,
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
                    name: yAxisName,
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
                    data: [...PortTopPortNameList],
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
            myChart.setOption(option);
            myChart.resize({ width: window.innerWidth - 72 });
            window.addEventListener('resize', () => { myChart.resize({ width: window.innerWidth - 72 }) });
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

    return <>
        <Spin tip="数据正在加载中,请稍等..." spinning={loading}>
            <Card
                extra={
                    <>
                        <Radio.Group defaultValue={type} buttonStyle="solid" onChange={onChangeType}>
                            <Radio.Button value="收入">收入</Radio.Button>
                            <Radio.Button value="整箱">整箱</Radio.Button>
                            <Radio.Button value="拼箱">拼箱</Radio.Button>
                            <Radio.Button value="散货">散货</Radio.Button>
                        </Radio.Group>
                    </>
                }
            >
                <div id="VolumePort" style={{ width: '100%', height: 800 }}></div>
            </Card>
        </Spin>

        {/*重点代码*/}
        <ContextProps.Provider value={1.3}>
            <SearchButton />
        </ContextProps.Provider>
    </>
};

export default VolumePort;