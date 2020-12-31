import React, { useState, useEffect, } from 'react';
import { useModel } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Spin, } from 'antd';
//引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入需要用到的图表
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/bar';
// 引入提示框和标题组件
import 'echarts/lib/component/title';
import 'echarts/lib/component/tooltip';
//调用API
import { getDebtChartData, } from '@/services/debt';
//调用公式方法
import { getTotalValue, } from '@/utils/utils';
import { getselectBranchID, } from '@/utils/auths';

const Debt: React.FC<{}> = () => {
    const { initialState, } = useModel('@@initialState');
    const [ loading, setloading] = useState(false);

    //获取数据
    let fetchData = async (ParamsInfo: any) => {
        setloading(true);
        const result = await getDebtChartData(ParamsInfo);
        if (!result || getselectBranchID() == '') {
            return;
        }
        if (result) {
            let ReMoney30List: any = [];
            let ReMoney45List: any = [];
            let ReMoney60List: any = [];
            let ReMoney90List: any = [];
            let ReMoney180List: any = [];
            let ReMoney181List: any = [];
            if (result) {
                result.forEach((x: { ReMoney30: any;ReMoney45: any;ReMoney60: any;ReMoney90: any;ReMoney180: any;ReMoney181: any; }) => {
                    ReMoney30List.push(x.ReMoney30 / 10000);
                    ReMoney45List.push(x.ReMoney45 / 10000);
                    ReMoney60List.push(x.ReMoney60 / 10000);
                    ReMoney90List.push(x.ReMoney90 / 10000);
                    ReMoney180List.push(x.ReMoney180 / 10000);
                    ReMoney181List.push(x.ReMoney181 / 10000);
                });
                ReMoney30List = getTotalValue(ReMoney30List).toFixed(2);
                ReMoney45List = getTotalValue(ReMoney45List).toFixed(2);
                ReMoney60List = getTotalValue(ReMoney60List).toFixed(2);
                ReMoney90List = getTotalValue(ReMoney90List).toFixed(2);
                ReMoney180List = getTotalValue(ReMoney180List).toFixed(2);
                ReMoney181List = getTotalValue(ReMoney181List).toFixed(2);
            }
            let DebtList: any = [ReMoney30List, ReMoney45List, ReMoney60List, ReMoney90List, ReMoney180List, ReMoney181List];
            //将值传给初始化图表的函数
            initChart(DebtList);
            setloading(false);
        }
    }

    //初始化图表
    let initChart = (DebtList: []) => {
        let element = document.getElementById('DebtChart');
        let myChart: any;
        let option: any;
        if(element){
            myChart = echarts.init(element as HTMLDivElement);
            option = {
                title: {
                    text: '应收账款',
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
                xAxis: {
                    data: ["小于30天", "31-45天", "46-60天", "61-90天", "91-180天", "大于180天"]
                },
                yAxis: { name: '单位: CNY(万)' },
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
        }
    };

    /**
     * 第2个参数传 [initialState] 相当于 componentWillUnmount 钩子
     */
    useEffect(() => {
        let ParamsInfo: object = {
            BranchID: getselectBranchID(),
        };
        if (getselectBranchID() !=='') {
            fetchData(ParamsInfo);
        }
    }, [initialState]);

    return (
        <PageContainer>
            <Spin tip="页面正在加载中..." spinning={loading}>
                <Card>
                    <div id="DebtChart" style={{ width: '100%', height: 600 }}></div>
                </Card>
            </Spin>
        </PageContainer>
    )
};

export default Debt;