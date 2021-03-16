import React, { useState, useEffect, } from 'react';
import { useModel } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Spin, Row, Col, Button, Drawer, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import styles from '@/components/Search/index.less';
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入需要用到的图表
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/toolbox';
import 'echarts/lib/component/dataZoom';
//调用API
import { getCashFlowChartData, } from '@/services/cashflow';
//调用公式方法
import { getYearList, } from '@/utils/utils';
import {
  getBranchList,
  getselectBranchID,
  getselectYear,
} from '@/utils/auths';

const CashFlow: React.FC<{}> = () => {
  const { initialState, } = useModel('@@initialState');
  const [loading, setloading] = useState(false);
  const [DrawerVisible, setDrawerVisible] = useState(false);

  //数据集
  const [YearList,] = useState(() => {
    return getYearList();
  });
  const [BranchList,] = useState(() => {
    return getBranchList();
  });

  /**
   *  单选
   * */
  // YearList
  const [year, setYear] = useState(() => {
    // 惰性赋值 any 类型,要不默认值不起作用
    let selectYear: any = getselectYear();
    return selectYear;
  });

  // BranchList
  const [branch, setBranch] = useState(() => {
    // 惰性赋值 any 类型,要不默认值不起作用
    let selectBranch: any = getselectBranchID();
    return selectBranch;
  });

  //获取数据
  let fetchData = async (ParamsInfo: any) => {
    setloading(true);
    const result = await getCashFlowChartData(ParamsInfo);
    if (!result) {
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
          SortResultByDate.forEach((x: { SumToday: any; }) => {
            CashFlowSourceValue.push(x.SumToday);
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
          text: '日业务现金走势',
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
        grid: {
          left: '5%',
          right: '5%',
          top: '10%',
          bottom: '10%',
          containLabel: true,
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
          name: 'CNY(万)',
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
      myChart.setOption(option, true);
      window.addEventListener('resize', () => { myChart.resize() });
    }
  };

  /**
   * 第2个参数传 [] 相当于 componentDidUpdate 钩子
   */
  useEffect(() => {
    let ParamsInfo: object = {
      BranchID: getselectBranchID(),
      Year: getselectYear(),
    };
    fetchData(ParamsInfo);
  }, []);

  /**
   * 下拉选择
   * @param T:1.年份 2.业务线 3.运输类型 4.货物类型 5.公司
   * @param list 
   */
  const onSelect = (e: any, T: Number,) => {
    switch (T) {
      case 1:
        setYear(e);
        break;
      case 5:
        setBranch(e);
        break;
      default: return;
    }
  }

  /**
   * 关闭 Drawer
   */
  const onClose = () => {
    setDrawerVisible(false);
  }

  /**
   * 确定搜索条件
   */
  const onSearch = () => {
    let ParamsInfo: object = {
      BranchID: branch,
      Year: year,
    };
    fetchData(ParamsInfo);
    //关闭 Drawer
    setDrawerVisible(false);
  }

  return (
    <PageContainer>
      <Spin tip="数据正在加载中,请稍等..." spinning={loading}>
        <Card>
          <div id="CashFlowChart" style={{ width: '100%', height: 800 }}></div>
        </Card>
      </Spin>

      <Button type="primary" icon={<SearchOutlined />} className={styles.searchBtn} onClick={() => setDrawerVisible(true)} >搜索</Button>
      <Drawer
        placement={"right"}
        closable={false}
        onClose={onClose}
        visible={DrawerVisible}
        key={"right"}
        width={300}
        footer={
          <Button type="primary" icon={<SearchOutlined />} style={{ width: "100%", fontSize: 16, height: 'unset' }} onClick={onSearch}>
            确定
          </Button>
        }
      >
        <div className={styles.searchArea}>
          <Row className={styles.searchAreaLable}>
            <Col span={12} className={styles.searchAreaTitle}>公司</Col>
          </Row>
          <Row className={styles.searchAreaContent}>
            <Select
              style={{ width: "100%" }}
              defaultValue={parseInt(branch)}
              onChange={(e) => onSelect(e, 5)}
            >
              {
                BranchList && BranchList.length > 0 ? BranchList.map((x: any) => {
                  return <Select.Option key={x.BranchID} value={x.BranchID}>{x.BranchName}</Select.Option>
                }) : null
              }
            </Select>
          </Row>
        </div>
        <div className={styles.searchArea}>
          <Row className={styles.searchAreaLable}>
            <Col span={12} className={styles.searchAreaTitle}>年份</Col>
          </Row>
          <Row className={styles.searchAreaContent}>
            <Select
              style={{ width: "100%" }}
              defaultValue={parseInt(year)}
              onChange={(e) => onSelect(e, 1)}
            >
              {
                YearList && YearList.length > 0 ? YearList.map((x) => {
                  return <Select.Option key={x.Key} value={x.Key}>{x.Value}</Select.Option>
                }) : null
              }
            </Select>
          </Row>
        </div>
      </Drawer>

    </PageContainer>
  )
};

export default CashFlow;