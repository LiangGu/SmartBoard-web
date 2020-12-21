import React, { useState, useEffect, } from 'react';
import { useModel } from 'umi';
import { Card, Spin, } from 'antd';
//引入 ECharts 主模块
import echarts from 'echarts/lib/echarts'
// 引入需要用到的图表
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/bar'
// 引入提示框和标题组件
import 'echarts/lib/component/title'
import 'echarts/lib/component/tooltip'
//调用API
import { getPortChartData, } from '@/services/volume';
//调用公式方法
import { sortObjectArr, } from '@/utils/utils';
//引入自定义组件
import SearchButton from '@/components/Search/SearchButton';
import SearchResultList from '@/components/Search/SearchResultList';
//重点代码<React hooks之useContext父子组件传值>
import ContextProps from '@/createContext';

const Port: React.FC<{}> = () => {
    const { initialState, } = useModel('@@initialState');
    const [loading, setloading] = useState(false);

    //获取数据
    let fetchData = async (SearchInfo: any) => {
        setloading(true);
        const result = await getPortChartData(SearchInfo);
        if (!result || initialState?.currentBranch?.BranchID == undefined) {
            return;
        }
        if (result) {
            let PortTopList: any = [];
            let PortTopTotalARList: any = [];       //Total AR
            let PortTopTotalFCLList: any = [];      //Total FCL
            let PortTopTotalLCLList: any = [];      //Total LCL
            let PortTopTotalBulkList: any = [];     //Total Bulk
            let PortTopPortNameList: any = [];
            if (result && result.length > 0) {
                // 截取前10客户并用 TotalAR 排序
                PortTopList = result.slice(0, 10).sort(sortObjectArr('TotalAR'));
            }
            if (PortTopList.length > 0) {
                PortTopList.map((x: { TotalAR: any; FLCVolume: any; LCLVolume: any; BulkVolume: any; PortName: string; }) => {
                    PortTopTotalARList.push((x.TotalAR / 1000).toFixed(2));             //Total AR
                    PortTopTotalFCLList.push(x.FLCVolume);          //Total AR
                    PortTopTotalLCLList.push(x.LCLVolume);          //Total AR
                    PortTopTotalBulkList.push(x.BulkVolume);        //Total AR
                    PortTopPortNameList.push(x.PortName);
                });
            }
            //将值传给初始化图表的函数
            initChart(PortTopPortNameList, PortTopTotalARList,);
            setloading(false);
        }
    }

    //初始化图表
    let initChart = (PortTopPortNameList: [], PortTopTotalARList: [],) => {
        let element = document.getElementById('port');
        let myChart = echarts.init(element as HTMLDivElement);
        let option: any = {
            title: {
                text: '前10港口收入排名',
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#283b56'
                    }
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
                name: 'CNY(千)',
                data: [...PortTopPortNameList],
            },
            series: [
                {
                    name: '收入',
                    type: 'bar',
                    data: [...PortTopTotalARList]
                },
            ]
        };
        myChart.setOption(option);
        window.addEventListener('resize', () => { myChart.resize() });
    };


    /**
     * 第2个参数传 [] 相当于 componentDidMount 钩子
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
    }, []);

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

    return <>
        {/* <ContextProps.Provider value={2}>
            <SearchResultList />
        </ContextProps.Provider> */}

        <Spin tip="页面正在加载中..." spinning={loading}>
            <Card>
                <div id="port" style={{ width: '100%', height: 600 }}></div>
            </Card>
        </Spin>

        {/*重点代码*/}
        <ContextProps.Provider value={2}>
            <SearchButton />
        </ContextProps.Provider>
    </>
};

export default Port;