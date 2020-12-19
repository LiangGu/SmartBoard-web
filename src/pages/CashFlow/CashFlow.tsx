import React,{ useState, useEffect, }  from 'react';
import { useModel } from 'umi';
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
//引入自定义组件
import SearchButton from '@/components/Search/SearchButton';
//重点代码<React hooks之useContext父子组件传值>
import ContextProps from '@/createContext';

const CashFlow: React.FC<{}> = () => {
  const { initialState, } = useModel('@@initialState');

  //获取数据
  let fetchData = async()=>{
      const result = await getCashFlowChartData();
      if(!result || initialState?.currentBranch?.BranchID == undefined){
        return;
    }
      if(result && result.Result){
        //将值传给初始化图表的函数
        initChart(result.Content.CashFlowChartData,result.Content.CashFlowChartKey);
      }
  }

  //初始化图表
  let initChart = (CashFlowChartData:[],CashFlowChartKey:[]) => {
      let element = document.getElementById('main');
      let myChart = echarts.init(element as HTMLDivElement);
      let option:any = {
        tooltip: {},
        toolbox: {
            feature: {
                dataView: {show: true, readOnly: false},
                magicType: {show: true, type: ['line', 'bar']},
                restore: {show: true},
                saveAsImage: {show: true}
            }
        },
        xAxis: {
            min: 1,
            max: CashFlowChartKey.length,
            axisLabel: {interval: 0,},
            show: false,
            name: `${CashFlowChartKey.length}`,
            boundaryGap: false,
            data: [...CashFlowChartKey]
        },
        yAxis: {name: '千'},
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
                        } else {
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
        {/*重点代码*/}
        <ContextProps.Provider value={2}>
            <SearchButton/>
        </ContextProps.Provider>
    </PageContainer>
  )
};

export default CashFlow;