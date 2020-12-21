import React, { useState, useEffect, } from 'react';
import { useModel } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Spin, } from 'antd';
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
import { getCashFlowChartData, } from '@/services/cashflow';
//调用公式方法
import { sortObjectArr, } from '@/utils/utils';
//引入自定义组件
import SearchButton from '@/components/Search/SearchButton';
import SearchResultList from '@/components/Search/SearchResultList';
//重点代码<React hooks之useContext父子组件传值>
import ContextProps from '@/createContext';

const CashFlow: React.FC<{}> = () => {
  const { initialState, } = useModel('@@initialState');
  const [loading, setloading] = useState(false);

  //获取数据
  let fetchData = async (SearchInfo: any) => {
    setloading(true);
    const result = await getCashFlowChartData(SearchInfo);
    if (!result || initialState?.currentBranch?.BranchID == undefined) {
      return;
    }
    if (result) {
      let SortResultByDate: any = [];
      let SumDateList: any = [];
      let SumTodayList: any = [];
      if (result && result.length > 0) {
        // 1、先把数据按照 日期 排序
        SortResultByDate = result.sort(sortObjectArr('SumDate'));
        // 2、分别存在不同的数组中
        SortResultByDate.map((x: { SumDate: string; SumToday: any; }) => {
          SumDateList.push(x.SumDate);
          SumTodayList.push((x.SumToday / 1000).toFixed(2));
        });
      }
      //将值传给初始化图表的函数
      initChart(SumDateList, SumTodayList);
      setloading(false);
    }
  }

  //初始化图表
  let initChart = (SumDateList: [], SumTodayList: []) => {
    let element = document.getElementById('main');
    let myChart = echarts.init(element as HTMLDivElement);
    let option: any = {
      title: {
        text: '现金流',
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
      toolbox: {
        feature: {
          dataView: { show: true, readOnly: false },
          magicType: { show: true, type: ['line', 'bar'] },
          restore: { show: true },
          saveAsImage: { show: true }
        }
      },
      xAxis: {
        min: 1,
        max: SumDateList.length,
        axisLabel: { interval: 0, },
        show: false,
        name: `${SumDateList.length}`,
        boundaryGap: false,
        data: [...SumDateList]
      },
      yAxis: { name: 'CNY(千)' },
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
        color: '#FF0005',
        type: 'line',
        barWidth: 20,
        itemStyle: {
          normal: {
            //*根据后台数据动态为每条数据添加不同的颜色
            color: function (params: any) {
              if (params.value < 0) {
                let color = ['#FF0005'];
                return params.itemStyle = color;
              } else {
                let color = ['#13E000'];
                return params.itemStyle = color;
              }
            },
          },
        },
        data: [...SumTodayList],
      }],
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
      Year: initialState?.searchInfo?.Year,
    };
    if (initialState?.currentBranch) {
      fetchData(SearchInfo);
    }
  }, [initialState]);

  return (
    <PageContainer>
      {/* <ContextProps.Provider value={4}>
        <SearchResultList />
      </ContextProps.Provider> */}

      <Spin tip="页面正在加载中..." spinning={loading}>
        <Card>
          <div id="main" style={{ width: '100%', height: 600 }}></div>
        </Card>
      </Spin>

      {/*重点代码*/}
      <ContextProps.Provider value={4}>
        <SearchButton />
      </ContextProps.Provider>
    </PageContainer>
  )
};

export default CashFlow;