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
import { getMonthChartData, } from '@/services/volume';
//调用公式方法
import { getMaxValue, getMinValue, } from '@/utils/utils';
//引入自定义组件
import SearchButton from '@/components/Search/SearchButton';
import SearchResultList from '@/components/Search/SearchResultList';
//重点代码<React hooks之useContext父子组件传值>
import ContextProps from '@/createContext';

const Month: React.FC<{}> = () => {
    const { initialState, } = useModel('@@initialState');
    const [loading, setloading] = useState(false);
    //获取数据
    let fetchData = async (SearchInfo: any) => {
        setloading(true);
        const result = await getMonthChartData(SearchInfo);
        if (!result || initialState?.currentBranch?.BranchID == undefined) {
            return;
        }
        if (result) {
            let VolumeList: any = [];
            let TotalARList: any = [];
            if (result && result.length > 0) {
                result.map((x: { Volume: Number; TotalAR: any; }) => {
                    VolumeList.push(x.Volume);
                    TotalARList.push(parseFloat((x.TotalAR / 1000).toFixed(2)));
                });
            }
            //将值传给初始化图表的函数
            initChart(VolumeList, TotalARList);
            setloading(false);
        }
    }
    //初始化图表
    let initChart = (VolumeData: any, IncomeDate: any,) => {
        let element = document.getElementById('main');
        let myChart = echarts.init(element as HTMLDivElement);
        let option: any = {
            title: {
                text: '月份货量',
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
            legend: {
                data: ['RT', 'CNY']
            },
            xAxis: [
                {
                    type: 'category',
                    data: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
                },
            ],
            yAxis: [
                {
                    type: 'value',
                    scale: true,
                    name: '单位: RT',
                    min: getMinValue(VolumeData),
                    max: getMaxValue(VolumeData),
                    splitNumber: 5,
                    interval: (getMaxValue(VolumeData) - getMinValue(VolumeData)) / 5
                },
                {
                    type: 'value',
                    scale: true,
                    name: '单位: CNY(千)',
                    min: getMinValue(IncomeDate),
                    max: getMaxValue(IncomeDate),
                    splitNumber: 5,
                    interval: (getMaxValue(IncomeDate) - getMinValue(IncomeDate)) / 5
                }
            ],
            series: [
                {
                    name: 'RT',
                    type: 'bar',
                    color: '#61A0A8',
                    data: [...VolumeData]
                },
                {
                    name: 'CNY(千)',
                    type: 'line',
                    color: '#C23531',
                    yAxisIndex: 1,
                    data: [...IncomeDate]
                },
            ]
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
            // Months: initialState?.searchInfo?.MonthList || [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            TransTypes: initialState?.searchInfo?.BizType1List || [1, 2, 3, 4, 5, 6, 10, 11, 12, 13, 14],
            TradeTypes: initialState?.searchInfo?.BizType2List || [1, 2, 3, 4, 5, 6],
            CargoTypes: initialState?.searchInfo?.OceanTransportTypeList || [1, 2, 3, 6, 7],
        };
        if (initialState?.currentBranch?.BranchID || initialState?.searchInfo) {
            fetchData(SearchInfo);
        }
    }, [initialState]);

    return <>
        {/* <ContextProps.Provider value={1}>
            <SearchResultList />
        </ContextProps.Provider> */}

        <Spin tip="页面正在加载中..." spinning={loading}>
            <Card>
                <div id="main" style={{ width: '100%', height: 600 }}></div>
            </Card>
        </Spin>

        {/*重点代码*/}
        <ContextProps.Provider value={1}>
            <SearchButton />
        </ContextProps.Provider>
    </>
}

export default Month;