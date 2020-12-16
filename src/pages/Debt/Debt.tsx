import React, { useEffect, } from 'react';
import { PageContainer} from '@ant-design/pro-layout';
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
import { getDebtChartData, } from '@/services/debt';

const Debt: React.FC<{}> = () => {

    //获取数据
    let fetchData = async()=>{
        const result = await getDebtChartData();
        if(result && result.Result){
            //将值传给初始化图表的函数
            initChart(result.Content.DebtChartData);
        }
    }

    //初始化图表
    let initChart = (DebtChartData:[]) => {
        let element = document.getElementById('main');
        let myChart = echarts.init(element as HTMLDivElement);
        let option = {
            tooltip: {},
            toolbox: {
                show: true,
                showTitle: false,
                feature: {magicType: {type: ['line', 'bar']},saveAsImage: {}}
            },
            legend: {
                data:['应收账款']
            },
            xAxis: {
                data: ["小于30", "31-45", "46-60", "61-90", "91-180", "大于180",]
            },
            yAxis: {},
            series: [
                {
                    name: '应收账款',
                    type: 'bar',
                    data: [...DebtChartData]
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

export default Debt;