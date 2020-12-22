import React, { useState, useEffect, } from 'react';
import { useModel } from 'umi';
import { Card, Radio, Spin, } from 'antd';
//引入 ECharts 主模块
import echarts from 'echarts/lib/echarts'
// 引入需要用到的图表
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/bar'
// 引入提示框和标题组件
import 'echarts/lib/component/title'
import 'echarts/lib/component/tooltip'
import styles from '@/global.less';
//调用API
import { getRankChartData, } from '@/services/rank';
//调用公式方法
import { sortObjectArr, } from '@/utils/utils';
//引入自定义组件
import SearchButton from '@/components/Search/SearchButton';
import SearchResultList from '@/components/Search/SearchResultList';
//重点代码<React hooks之useContext父子组件传值>
import ContextProps from '@/createContext';

const Rank: React.FC<{}> = () => {
    const { initialState, } = useModel('@@initialState');
    const [ loading, setloading] = useState(false);
    const [ type, setType] = useState('收入');
    // 将获取到的数据保存起来<用于在切换 Type 时直接使用而不用再调用后台接口>
    const [ rankTopCTNameList, setRankTopCTNameList] = useState([]);
    const [ rankTopTotalARList, setRankTopTotalARList] = useState([]);
    const [ rankTopTotalFCLList, setRankTopTotalFCLList] = useState([]);
    const [ rankTopTotalLCLList, setRankTopTotalLCLList] = useState([]);
    const [ rankTopTotalBulkList, setRankTopTotalBulkList] = useState([]);

    //获取数据
    let fetchData = async (SearchInfo: any) => {
        setloading(true);
        const result = await getRankChartData(SearchInfo);
        if (!result || initialState?.currentBranch?.BranchID == undefined) {
            return;
        }
        if (result) {
            let RankTopList: any = [];
            let RankTopTotalARList: any = [];       //Total AR
            let RankTopTotalFCLList: any = [];      //Total FCL
            let RankTopTotalLCLList: any = [];      //Total LCL
            let RankTopTotalBulkList: any = [];     //Total Bulk
            let RankTopCTNameList: any = [];
            if (result && result.length > 0) {
                // 截取前10客户并用 TotalAR 排序
                RankTopList = result.slice(0, 10).sort(sortObjectArr('TotalAR'));
            }
            if (RankTopList.length > 0) {
                RankTopList.map((x: { TotalAR: any; FLCVolume: any; LCLVolume: any; BulkVolume: any; CustomerName: string; }) => {
                    RankTopTotalARList.push((x.TotalAR / 1000).toFixed(2));             //Total AR
                    RankTopTotalFCLList.push(x.FLCVolume);          //Total AR
                    RankTopTotalLCLList.push(x.LCLVolume);          //Total AR
                    RankTopTotalBulkList.push(x.BulkVolume);        //Total AR
                    RankTopCTNameList.push(x.CustomerName);
                });
            }
            // *保存在 State 中
            setRankTopCTNameList(RankTopCTNameList);
            setRankTopTotalARList(RankTopTotalARList);
            setRankTopTotalFCLList(RankTopTotalFCLList);
            setRankTopTotalLCLList(RankTopTotalLCLList);
            setRankTopTotalBulkList(RankTopTotalBulkList);

            //将值传给初始化图表的函数
            initChart(RankTopCTNameList, RankTopTotalARList, RankTopTotalFCLList, RankTopTotalLCLList, RankTopTotalBulkList);
            setloading(false);
        }
    }

    //初始化图表
    let initChart = (RankTopCTNameList: [], RankTopTotalARList: [], RankTopTotalFCLList: [], RankTopTotalLCLList: [], RankTopTotalBulkList: [],) => {
        let element = document.getElementById('main');
        let myChart = echarts.init(element as HTMLDivElement);
        console.log(type)
        // let type: Number = 2;
        // let seriesData1 = [
        //     {
        //         name: '收入',
        //         type: 'bar',
        //         data: [...RankTopTotalARList]
        //     }
        // ];
        // let seriesData2 = [
        //     {
        //         name: '整箱',
        //         type: 'bar',
        //         data: [...RankTopTotalFCLList]
        //     }
        // ]

        let option: any = {
            title: {
                text: '前10客户收入排名',
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
            legend: {data: ['收入', '整箱', '拼箱', '散货']},
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
                name: '单位: CNY(千)',
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
            // series: type == 1 ? seriesData1 : seriesData2,
            // series: [
                // {
                //     name: '收入',
                //     type: 'bar',
                //     data: [...RankTopTotalARList]
                // },
                // {
                //     name: '整箱',
                //     type: 'bar',
                //     data: [...RankTopTotalFCLList]
                // },
                // {
                //     name: '拼箱',
                //     type: 'bar',
                //     data: [...RankTopTotalLCLList]
                // },
                // {
                //     name: '散货',
                //     type: 'bar',
                //     data: [...RankTopTotalBulkList]
                // },
            // ]
        };
        myChart.setOption(option);
        window.addEventListener('resize', () => { myChart.resize() });
    };

    /**
     * 第2个参数传 [initialState] 相当于 componentWillUnmount 钩子
     */
    useEffect(() => {
        let SearchInfo: object = {
            BranchID: initialState?.currentBranch?.BranchID,
            // YearList: initialState?.searchInfo?.YearList,
            Year: initialState?.searchInfo?.Year,
            Months: initialState?.searchInfo?.MonthList || [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            TransTypes: initialState?.searchInfo?.BizType1List || [1, 2, 3, 4, 5, 6, 10, 11, 12, 13, 14],
            TradeTypes: initialState?.searchInfo?.BizType2List || [1, 2, 3, 4, 5, 6],
            CargoTypes: initialState?.searchInfo?.OceanTransportTypeList || [1, 2, 3, 6, 7],
        };
        if (initialState?.currentBranch) {
            fetchData(SearchInfo);
        }
    }, [initialState]);

    /**
     * 点击切换统计图表类型
     */
    const onChangeType = (e:any) => {
        setType(e.target.value);
    }

    return <>
        {/* <ContextProps.Provider value={3}>
            <SearchResultList />
        </ContextProps.Provider> */}

        <Spin tip="页面正在加载中..." spinning={loading}>
            <Card 
                extra={
                    <>
                        {/* 切换统计图表类型 */}
                        <Radio.Group defaultValue={type} buttonStyle="solid" onChange={onChangeType}>
                            <Radio.Button value="收入">收入</Radio.Button>
                            <Radio.Button value="整箱">整箱</Radio.Button>
                            <Radio.Button value="拼箱">拼箱</Radio.Button>
                            <Radio.Button value="散货">散货</Radio.Button>
                        </Radio.Group>
                    </>
                }
            >
                <div id="main" style={{ width: '100%', height: 600 }}></div>
            </Card>

        </Spin>

        {/*重点代码*/}
        <ContextProps.Provider value={3}>
            <SearchButton />
        </ContextProps.Provider>
    </>
};

export default Rank;