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
import { sortObjectArr, } from '@/utils/utils';
import { getselectBranchID, getselectYear, getselectOceanTransportType,} from '@/utils/auths';
//引入自定义组件
import SearchButton from '@/components/Search/SearchButton';
//重点代码<React hooks之useContext父子组件传值>
import ContextProps from '@/createContext';

const Rank: React.FC<{}> = () => {
    const { initialState, } = useModel('@@initialState');
    const [loading, setloading] = useState(false);
    const [type, setType] = useState('收入');
    const [result, setResult] = useState([]);

    //获取数据
    let fetchData = async (ParamsInfo: any, T: string) => {
        setloading(true);
        const result = await getRankChartData(ParamsInfo);
        if (!result || getselectBranchID() == '') {
            return;
        }
        if (result) {
            setResult(result);
            //将值传给初始化图表的函数
            initChart(result, T);
            setloading(false);
        };
    }

    //初始化图表
    let initChart = (result: any, type: string) => {
        let element = document.getElementById('RankChart');
        let myChart: any;
        let option: any;

        // 根据 type 排序
        let RankTopList: any = [];
        let RankTopTotalARList: any = [];       //Total AR
        let RankTopTotalFCLList: any = [];      //Total FCL
        let RankTopTotalLCLList: any = [];      //Total LCL
        let RankTopTotalBulkList: any = [];     //Total Bulk
        let RankTopCTNameList: any = [];
        if (type == '收入') {
            RankTopList = (result.sort(sortObjectArr('TotalAR',2)).slice(0, 10)).sort(sortObjectArr('TotalAR',1));
        } else if (type == '整箱') {
            RankTopList = (result.sort(sortObjectArr('FLCVolume',2)).slice(0, 10)).sort(sortObjectArr('FLCVolume',1));
        } else if (type == '拼箱') {
            RankTopList = (result.sort(sortObjectArr('LCLVolume',2)).slice(0, 10)).sort(sortObjectArr('LCLVolume',1));
        } else {
            RankTopList = (result.sort(sortObjectArr('BulkVolume',2)).slice(0, 10)).sort(sortObjectArr('BulkVolume',1));
        }
        if (RankTopList.length > 0) {
            RankTopList.map((x: { TotalAR: any; FLCVolume: Number; LCLVolume: Number; BulkVolume: Number; CustomerName: string; }) => {
                RankTopTotalARList.push((x.TotalAR / 1000).toFixed(2));             //Total AR
                RankTopTotalFCLList.push(x.FLCVolume);          //Total AR
                RankTopTotalLCLList.push(x.LCLVolume);          //Total AR
                RankTopTotalBulkList.push(x.BulkVolume);        //Total AR
                RankTopCTNameList.push(x.CustomerName);
            });
        };
        // 赋值图表 series 和 yAxis 中的 name
        let seriesData = [];
        let yAxisName = '';
        if (type == '收入') {
            seriesData.push({
                name: type,
                type: 'bar',
                data: [...RankTopTotalARList]
            });
            yAxisName = '收入: CNY(千)'
        } else if (type == '整箱') {
            seriesData.push({
                name: type,
                type: 'bar',
                data: [...RankTopTotalFCLList]
            });
            yAxisName = '整箱: TEU'
        } else if (type == '拼箱') {
            seriesData.push({
                name: type,
                type: 'bar',
                data: [...RankTopTotalLCLList]
            });
            yAxisName = '拼箱: CBM'
        } else {
            seriesData.push({
                name: type,
                type: 'bar',
                data: [...RankTopTotalBulkList]
            });
            yAxisName = '散货: TON'
        }

        if(element){
            myChart = echarts.init(element as HTMLDivElement);
            option = {
                title: {
                    text: `前10客户${type}排名`,
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
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'value',
                    boundaryGap: [0, 0.01]
                },
                yAxis: {
                    type: 'category',
                    scale: true,
                    name: yAxisName,
                    data: [...RankTopCTNameList],
                    //Y轴超长标签换行
                    axisLabel: {
                        show: true,
                        interval: 0,
                        //设置字数限制
                        formatter: function (value: any) {
                            if (value.length > 40) {
                                return value.substring(0, 40) + '\n' + value.substring(40, value.length);
                            } else if (value.length > 20) {
                                return value.substring(0, 20) + '\n' + value.substring(20, value.length);
                            } else {
                                return value;
                            }
                        }
                    },
                },
                series: seriesData,
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
        if (getselectBranchID() !=='') {
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
        <Spin tip="页面正在加载中..." spinning={loading}>
            <Card
                extra={
                    <>
                        {/* 切换统计图表类型 */}
                        <span style={{marginRight:10}}>排序方式:</span>
                        <Radio.Group size="small" defaultValue={type} buttonStyle="solid" onChange={onChangeType}>
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