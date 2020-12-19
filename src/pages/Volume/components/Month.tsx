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
//引入自定义组件
import SearchButton from '@/components/Search/SearchButton';
import SearchResultList from '@/components/Search/SearchResultList';
//重点代码<React hooks之useContext父子组件传值>
import ContextProps from '@/createContext';

const Month: React.FC<{}> = () => {
    const { initialState, } = useModel('@@initialState');
    const [ loading, setloading] = useState(false);

    //获取数据
    let fetchData = async(SearchInfo:any)=>{
        setloading(true)
        const result = await getMonthChartData(SearchInfo);
        if(!result || initialState?.currentBranch?.BranchID == undefined){
            return;
        }
        if(result){
            let VolumeList:Array<Number> = [];
            let TotalARList:Array<Number> = [];
            if(result && result.length > 0){
                result.map((x: { Volume: Number; TotalAR: Number; }) => {
                    VolumeList.push(x.Volume);
                    TotalARList.push(x.TotalAR);
                })
            }
            //将值传给初始化图表的函数
            initChart(VolumeList,TotalARList);
            setloading(false)
        }
    }
    //初始化图表
    let initChart = (VolumeData:any,IncomeDate:any,) => {
        let element_volume = document.getElementById('volumeChart');
        let element_income = document.getElementById('incomeChart');
        let volumeChart = echarts.init(element_volume as HTMLDivElement);
        let incomeChart = echarts.init(element_income as HTMLDivElement);
        let option_volume:any = {
            tooltip: {
                trigger: 'axis',
                axisPointer : {type : 'shadow'},
            },
            toolbox: {
                feature: {
                    dataView: {show: true, readOnly: false},
                    magicType: {show: true, type: ['line', 'bar']},
                    restore: {show: true},
                    saveAsImage: {show: true}
                }
            },
            legend: {
                data: ['RT', 'CNY']
            },
            xAxis: {
                type: 'category',
                data: ["一月", "二月", "三月", "四月", "五月", "六月","七月", "八月", "九月", "十月", "十一月", "十二月"],
                axisPointer: {
                    type: 'shadow'
                }
            },
            yAxis: [
                {
                    type: 'value',
                    name: 'CNY',
                    axisLabel: {
                        formatter: '{value} CNY'
                    },
                }
            ],
            series: [
                {
                    name: 'CNY',
                    type: 'bar',
                    color: '#FF0003',
                    data: [...IncomeDate]
                },
             ]
        };
        let option_income:any = {
            tooltip: {
                trigger: 'axis',
                axisPointer : {type : 'shadow'},
            },
            toolbox: {
                feature: {
                    dataView: {show: true, readOnly: false},
                    magicType: {show: true, type: ['line', 'bar']},
                    restore: {show: true},
                    saveAsImage: {show: true}
                }
            },
            legend: {
                data: ['RT', 'CNY']
            },
            xAxis: {
                type: 'category',
                data: ["一月", "二月", "三月", "四月", "五月", "六月","七月", "八月", "九月", "十月", "十一月", "十二月"],
                axisPointer: {
                    type: 'shadow'
                }
            },
            yAxis: [
                {
                    type: 'value',
                    name: 'RT',
                    axisLabel: {
                        formatter: '{value} RT'
                    },
                },
            ],
            series: [
                {
                    name: 'RT',
                    type: 'bar',
                    color: '#339900',
                    data: [...VolumeData]
                },
             ]
        };
        volumeChart.setOption(option_volume);
        incomeChart.setOption(option_income);
        window.addEventListener('resize' , () => {volumeChart.resize()});
        window.addEventListener('resize' , () => {incomeChart.resize()});
    };

    /**
     * 第2个参数传 [] 相当于 componentDidMount 钩子
     */
    useEffect(() =>{
        let SearchInfo:object = {
            BranchID: initialState?.currentBranch?.BranchID,
            // YearList: initialState?.searchInfo?.YearList,
            Year: initialState?.searchInfo?.Year,
            MonthList: initialState?.searchInfo?.MonthList || [],
            TransTypes: initialState?.searchInfo?.BizType1List || [],
            TradeTypes: initialState?.searchInfo?.BizType2List || [],
            CargoTypes: initialState?.searchInfo?.OceanTransportTypeList || [],
        };
        if(initialState?.currentBranch || initialState?.searchInfo){
            fetchData(SearchInfo);
        }
    },[]);

    /**
     * 第2个参数传 [initialState] 相当于 componentWillUnmount 钩子
     */
    useEffect(() =>{
        let SearchInfo:object = {
            BranchID: initialState?.currentBranch?.BranchID,
            // YearList: initialState?.searchInfo?.YearList,
            Year: initialState?.searchInfo?.Year,
            MonthList: initialState?.searchInfo?.MonthList || [],
            TransTypes: initialState?.searchInfo?.BizType1List || [],
            TradeTypes: initialState?.searchInfo?.BizType2List || [],
            CargoTypes: initialState?.searchInfo?.OceanTransportTypeList || [],
        };
        if(initialState?.currentBranch || initialState?.searchInfo){
            fetchData(SearchInfo);
        }
    },[initialState]);

    return <>
        <SearchResultList/>
        <Spin tip="页面正在加载中..." spinning={loading}>
            <Card>
                <div id="volumeChart" style={{width: '100%',height:400}}></div>
                <div id="incomeChart" style={{width: '100%',height:400}}></div>
            </Card>
        </Spin>

        {/*重点代码*/}
        <ContextProps.Provider value={1}>
            <SearchButton/>
        </ContextProps.Provider>
    </>
}

export default Month;