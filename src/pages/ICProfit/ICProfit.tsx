import React, { useEffect, } from 'react';
import { PageContainer} from '@ant-design/pro-layout';
import { Card, } from 'antd';
//  引入 ECharts 主模块
import echarts from 'echarts/lib/echarts'
// 引入需要用到的图表
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/bar'
// 引入提示框和标题组件
import 'echarts/lib/component/title'
import 'echarts/lib/component/tooltip'
//调用API
import { getICProfitChartData,} from '@/services/icprofit';

const ICProfit: React.FC<{}> = () => {

    //获取数据
    let fetchData = async()=>{
        const result = await getICProfitChartData();
        if(result && result.Result){
          //将值传给初始化图表的函数
          initChart(result.Content.BarDataAR,result.Content.BarDataAP,result.Content.ProfitData);
        }
    }
    //初始化图表
    let initChart = (BarDataAR:[],BarDataAP:[],ProfitData:[]) => {
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
              data:['收入', '支出', '利润']
          },
          xAxis: {
              data: ["一月", "二月", "三月", "四月", "五月", "六月","七月", "八月", "九月", "十月", "十一月", "十二月"]
          },
          yAxis: {name: '千'},
          series: [
              {
                  name: '收入',
                  type: 'bar',
                  color: '#339900',
                  data: [...BarDataAR]
              },
              {
                  name: '支出',
                  type: 'bar',
                  color: '#FF0003',
                  data: [...BarDataAP]
              },
              {
                  name: '利润',
                  type: 'line',
                  color: '#6700FF',
                  data: [...ProfitData]
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

export default ICProfit;