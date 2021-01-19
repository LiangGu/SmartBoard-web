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
import { getselectBranchID, getselectYear, } from '@/utils/auths';
//引入自定义组件
import SearchButton from '@/components/Search/SearchButton';
//重点代码<React hooks之useContext父子组件传值>
import ContextProps from '@/createContext';

const CashFlow: React.FC<{}> = () => {
  const { initialState, } = useModel('@@initialState');
  const [loading, setloading] = useState(false);

  //获取数据
  let fetchData = async (ParamsInfo: any) => {
    setloading(true);
    const result = await getCashFlowChartData(ParamsInfo);
    if (!result || getselectBranchID() == '') {
      return;
    }
    if (result) {
      let SortResultByDate: any = [];
      let CashFlowSourceValue: any = [];
      let SumDateList: any = [];
      let SumTodayList: any = [];
      if (result.length > 0) {
        // 1、先把数据按照 日期 排序
        SortResultByDate = result.sort((a: any, b: any) => a.SumDate.localeCompare(b.SumDate));
        // 2、处理数据:数据累加
        if (SortResultByDate && SortResultByDate.length > 0) {
          SortResultByDate.forEach((x: { TotalAR: any; }) => {
            CashFlowSourceValue.push(x.TotalAR);
          });
        }
        // * 从第1个值开始,对应的值等于:当前值 + 当前值的后一个值
        for (let i = 1; i < CashFlowSourceValue.length; i++) {
          CashFlowSourceValue[i] = CashFlowSourceValue[i] + CashFlowSourceValue[i - 1];
        }
        // 3、取现金流的 key 值
        SortResultByDate.map((x: { SumDate: string; }) => {
          SumDateList.push(x.SumDate);
        });
        // 4、取现金流的 value 值
        CashFlowSourceValue.map((x: any) => {
          SumTodayList.push((x / 10000).toFixed(2));
        });
      }
      //将值传给初始化图表的函数
      initChart(SumDateList, SumTodayList);
      setloading(false);
    }
  }

  //初始化图表
  let myChart: any;
  let initChart = (SumDateList: [], SumTodayList: []) => {
    let element = document.getElementById('CashFlowChart');
    if (myChart != null && myChart != "" && myChart != undefined) {
      myChart.dispose();
    }
    let option: any;
    if (element) {
      myChart = echarts.init(element as HTMLDivElement);
      option = {
        title: {
          text: '日现金流走势',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#C23531',
            },
          },
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true },
          },
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisLabel: {
            show: true,
            color: 'black',
            fontSize: 16,
          },
          data: [...SumDateList],
        },
        yAxis: {
          type: 'value',
          name: '收入: CNY(万)',
          nameTextStyle: {
            color: 'black',
            fontSize: 16,
          },
          axisLabel: {
            show: true,
            color: 'black',
            fontSize: 16,
          },
        },
        dataZoom: [
          {
            type: 'slider',
            xAxisIndex: 0,
            start: 0,
            end: 100,
          },
        ],
        series: [
          {
            name: '现金流',
            color: '#C23531',
            type: 'line',
            barWidth: 20,
            itemStyle: {
              normal: {
                //*根据后台数据动态为每条数据添加不同的颜色
                color: function (params: any) {
                  if (params.value < 0) {
                    let color = ['#C23531'];
                    return params.itemStyle = color;
                  } else {
                    let color = ['green'];
                    return params.itemStyle = color;
                  }
                },
              },
            },
            data: [...SumTodayList],
          }
        ],
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
    };
    if (getselectBranchID() !== '') {
      fetchData(ParamsInfo);
    }
  }, [initialState]);

  return (
    <PageContainer>
      <Spin tip="数据正在加载中,请稍等..." spinning={loading}>
        <Card>
          <div id="CashFlowChart" style={{ width: '100%', height: 600 }}></div>
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