import React,{ useState, useEffect, }  from 'react';
import { PageContainer} from '@ant-design/pro-layout';
import { Card, } from 'antd';

// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入需要用到的图表
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/pie';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/toolbox';
import 'echarts/lib/component/dataZoom';
//调用API
import { getCashFlowChartData,} from '@/services/cashflow';
//
import {getCurDay} from '../../utils/utils'

const CashFlow: React.FC<{}> = () => {
    const [curData, setcurData] = useState<number>(()=>{
      return getCurDay()
    });

    //获取数据
    let fetchData = async()=>{
        const result = await getCashFlowChartData();
        if(result && result.Result){
          //将值传给初始化图表的函数
          initChart(result.Content.CashFlowChartData,result.Content.CashFlowChartKey);
        }
    }

    //初始化图表
    let initChart = (CashFlowChartData:[],CashFlowChartKey:[]) => {
        let element = document.getElementById('main');
        let myChart = echarts.init(element as HTMLDivElement);
        let option = {
            tooltip: {},
            toolbox: {
                show: true,
                showTitle: false,
                feature: {magicType: {type: ['line', 'bar']},saveAsImage: {}}
            },
            xAxis: {
                min: 1,
                max: curData,
                axisLabel: {interval: 0,},
                show: false,
                name: `${curData}`,
                boundaryGap: false,
                data: [...CashFlowChartKey]
            },
            // yAxis: {name: '千'},
            yAxis: {},
            dataZoom: [
                {
                    type: 'slider',         // 滑动条
                    xAxisIndex: 0,          // Y轴
                    start: 0,               // 左边在 0% 的位置
                    end: 100,               // 右边在 100% 的位置
                },
            ],
            series: [{
                name: '现金流',
                color: '#ff0005',
                type: 'line',
                barWidth: 20,
                itemStyle: {
                    normal: {
                        //*根据后台数据动态为每条数据添加不同的颜色
                        color: function (params:any) {
                            if (params.value < 0) {
                                let color = ['#CC3300'];
                                return params.itemStyle = color;
                            } else if (params.value > 0) {
                                let color = ['#FFCC00'];
                                return params.itemStyle = color;
                            }
                        },
                    },
                },
                data: [...CashFlowChartData],
            }],
        };
        myChart.setOption(option);
    };

    /**
     * 第2个参数传 [] 相当于 componentDidMount 钩子
     */
    useEffect(() =>{
      fetchData();
    },[]);

  return (
    <PageContainer>
      <Card>
        <div id="main" style={{width: '100%',height:400}}></div>
      </Card>
    </PageContainer>
  )
};

export default CashFlow;