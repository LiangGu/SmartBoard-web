import React, { useState, useEffect, } from 'react';
import { useModel } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
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
import { getDebtChartData, } from '@/services/debt';
//调用公式方法
import { getTotalValue, } from '@/utils/utils';

const Debt: React.FC<{}> = () => {
    const { initialState, } = useModel('@@initialState');
    const [loading, setloading] = useState(false);

    //获取数据
    let fetchData = async (SearchInfo: any) => {
        setloading(true);
        const result = await getDebtChartData(SearchInfo);
        if (!result || initialState?.currentBranch?.BranchID == undefined) {
            return;
        }
        if (result) {
            let ReMoney30List: any = [];
            let ReMoney45List: any = [];
            let ReMoney60List: any = [];
            let ReMoney90List: any = [];
            let ReMoney180List: any = [];
            let ReMoney181List: any = [];
            if (result && result.length > 0) {
                ReMoney30List = getTotalValue(Array.from(result, x => (x.ReMoney30 / 1000))).toFixed(2);
                ReMoney45List = getTotalValue(Array.from(result, x => (x.ReMoney45 / 1000))).toFixed(2);
                ReMoney60List = getTotalValue(Array.from(result, x => (x.ReMoney60 / 1000))).toFixed(2);
                ReMoney90List = getTotalValue(Array.from(result, x => (x.ReMoney90 / 1000))).toFixed(2);
                ReMoney180List = getTotalValue(Array.from(result, x => (x.ReMoney180 / 1000))).toFixed(2);
                ReMoney181List = getTotalValue(Array.from(result, x => (x.ReMoney181 / 1000))).toFixed(2);
            }
            let DebtList: any = [ReMoney30List, ReMoney45List, ReMoney60List, ReMoney90List, ReMoney180List, ReMoney181List];
            //将值传给初始化图表的函数
            initChart(DebtList);
            setloading(false);
        }
    }

    //初始化图表
    let initChart = (DebtList: []) => {
        let element = document.getElementById('main');
        let myChart = echarts.init(element as HTMLDivElement);
        let option: any = {
            title: {
                text: '应收账款',
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
            legend: {
                data: ['应收账款']
            },
            xAxis: {
                data: ["小于30天", "31-45天", "46-60天", "61-90天", "91-180天", "大于180天"]
            },
            yAxis: { name: 'CNY(千)' },
            series: [
                {
                    name: '应收账款',
                    type: 'bar',
                    data: [...DebtList]
                },
            ]
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
        };
        if (initialState?.currentBranch) {
            fetchData(SearchInfo);
        }
    }, [initialState]);

    return (
        <PageContainer>
            <Spin tip="页面正在加载中..." spinning={loading}>
                <Card>
                    <div id="main" style={{ width: '100%', height: 600 }}></div>
                </Card>
            </Spin>
        </PageContainer>
    )
};

export default Debt;