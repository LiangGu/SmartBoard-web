import React, { useState, useEffect, } from 'react';
import { useModel } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Spin, } from 'antd';
//  引入 ECharts 主模块
import echarts from 'echarts/lib/echarts'
// 引入需要用到的图表
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/bar'
// 引入提示框和标题组件
import 'echarts/lib/component/title'
import 'echarts/lib/component/tooltip'
//调用API
import { getICProfitChartData, } from '@/services/icprofit';
//调用公式方法
import { sortObjectArr, } from '@/utils/utils';
import { getselectBranchID, getselectYear, getselectOceanTransportType,} from '@/utils/auths';
//引入自定义组件
import SearchButton from '@/components/Search/SearchButton';
//重点代码<React hooks之useContext父子组件传值>
import ContextProps from '@/createContext';

const ICProfit: React.FC<{}> = () => {
  const { initialState, } = useModel('@@initialState');
  const [loading, setloading] = useState(false);

  //获取数据
  let fetchData = async (ParamsInfo: any) => {
    setloading(true);
    const result = await getICProfitChartData(ParamsInfo);
    if (!result || getselectBranchID() == '') {
      return;
    }
    if (result) {
      let SortICProfitList: any = [];
      let TotalARList: any = [];
      let TotalAPList: any = [];
      let ProfitList: any = [];
      // 根据 FinanceMonth 排序
      SortICProfitList = result.sort(sortObjectArr('FinanceMonth',1));
      if (SortICProfitList && SortICProfitList.length > 0) {
        SortICProfitList.map((x: { TotalAR: any; TotalAP: any; Profit: any }) => {
          TotalARList.push((x.TotalAR / 1000).toFixed(2));
          TotalAPList.push((x.TotalAP / 1000).toFixed(2));
          ProfitList.push((x.Profit / 1000).toFixed(2));
        });
      }
      //将值传给初始化图表的函数
      initChart(TotalARList, TotalAPList, ProfitList);
      setloading(false);
    }
  }

  //初始化图表
  let initChart = (TotalARList: [], TotalAPList: [], ProfitList: []) => {
    let element = document.getElementById('ICProfitChart');
    let myChart: any;
    let option: any;
    if(element){
      myChart = echarts.init(element as HTMLDivElement);
      option = {
        title: {
          text: '收支利润',
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
          data: ['收入', '支出', '毛利']
        },
        xAxis: {
          data: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
        },
        yAxis: { name: '单位: CNY(千)' },
        series: [
          {
            name: '收入',
            type: 'bar',
            color: '#61A0A8',
            data: [...TotalARList]
          },
          {
            name: '支出',
            type: 'bar',
            color: '#C23531',
            data: [...TotalAPList]
          },
          {
            name: '毛利',
            type: 'line',
            color: '#FF7C00',
            data: [...ProfitList]
          },
        ]
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
      TransTypes: initialState?.searchInfo?.BizType1List || [1, 2, 3, 4, 5, 6, 10, 11, 12, 13, 14],
      TradeTypes: initialState?.searchInfo?.BizType2List || [1, 2, 3, 4, 5, 6],
      CargoTypes: getselectOceanTransportType(),
    };
    if (getselectBranchID() !=='') {
      fetchData(ParamsInfo);
    }
  }, [initialState]);

  return (
    <PageContainer>
      <Spin tip="页面正在加载中..." spinning={loading}>
        <Card>
          <div id="ICProfitChart" style={{ width: '100%', height: 600 }}></div>
        </Card>
      </Spin>

      {/*重点代码*/}
      <ContextProps.Provider value={5}>
        <SearchButton />
      </ContextProps.Provider>
    </PageContainer>
  )
};

export default ICProfit;