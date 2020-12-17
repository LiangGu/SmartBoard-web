import React, { useState, useEffect, } from 'react';
import { useModel } from 'umi';
import { Card, } from 'antd';
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

const Month: React.FC<{}> = () => {
    const { initialState, } = useModel('@@initialState');

    //获取数据
    let fetchData = async(SearchInfo:any)=>{
        const result = await getMonthChartData(SearchInfo);
        if(!result || !initialState?.currentBranch?.BranchID){
            return;
        }
        if(result && result.Result){
            console.log('1',result)
            //将值传给初始化图表的函数
            initChart(result.Content.ChartData);
        }
    }
    //初始化图表
    let initChart = (ChartData:[]) => {
        let element = document.getElementById('main');
        let myChart = echarts.init(element as HTMLDivElement);
        let option = {
            tooltip: {
                trigger: 'axis',
                axisPointer : {type : 'shadow'},            
            },
            toolbox: {
                show: true,
                showTitle: false,
                feature: {magicType: {type: ['line', 'bar']},saveAsImage: {}}
            },
            legend: {
                data:['RT']
            },
            xAxis: {
                data: ["一月", "二月", "三月", "四月", "五月", "六月","七月", "八月", "九月", "十月", "十一月", "十二月"]
            },
            yAxis: {name: 'RT'},
            series: [
                {
                    name: 'RT',
                    type: 'bar',
                    data: [...ChartData]
                },
             ]
        };
        myChart.setOption(option);
        window.addEventListener('resize' , () => {myChart.resize()});
    };

    /**
     * 第2个参数传 [] 相当于 componentDidMount 钩子
     */
    useEffect(() =>{
        fetchData(initialState?.currentBranch?.BranchID);
    },[]);

    /**
     * 第2个参数传 [initialState] 相当于 componentWillUnmount 钩子
     */
    useEffect(() =>{
        fetchData(initialState?.currentBranch?.BranchID);
    },[initialState]);

    return <>
        <Card>
            <div id="main" style={{width: '100%',height:400}}></div>
        </Card>
    </>
}

export default Month;