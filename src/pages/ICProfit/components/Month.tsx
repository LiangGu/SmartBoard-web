import React, { useState, useEffect, useContext, } from 'react';
import { useModel } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Spin, } from 'antd';
//  引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入需要用到的图表
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/bar';
// 引入提示框和标题组件
import 'echarts/lib/component/title';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
//调用API
import { getICProfitMonthData, } from '@/services/icprofit';
//调用公式方法
import { sortObjectArr, transIntOfArraay, } from '@/utils/utils';
import { getselectBranchID, getselectYear, getselectOceanTransportType, } from '@/utils/auths';
//引入自定义组件
import SearchButton from '@/components/Search/SearchButton';
//重点代码<React hooks之useContext父子组件传值>
import ContextProps from '@/createContext';

const ICProfitMonth: React.FC<{}> = () => {
    const { initialState, } = useModel('@@initialState');
    const [loading, setloading] = useState(false);
    //获取数据
    let fetchData = async (ParamsInfo: any) => {
        setloading(true);
        const result = await getICProfitMonthData(ParamsInfo);
        if (!result || getselectBranchID() == '') {
            return;
        }
        if (result) {
            let SortICProfitList: any = [];
            let TotalARList: any = [];
            let TotalAPList: any = [];
            let ProfitList: any = [];
            if (result.length > 0) {
                // 根据 FinanceMonth 排序
                SortICProfitList = result.sort(sortObjectArr('Month', 1));
                if (SortICProfitList && SortICProfitList.length > 0) {
                    SortICProfitList.map((x: { AmountAR: any; AmountAP: any; Profit: any }) => {
                        TotalARList.push((x.AmountAR / 10000).toFixed(2));
                        TotalAPList.push((x.AmountAP / 10000).toFixed(2));
                        ProfitList.push((x.Profit / 10000).toFixed(2));
                    });
                }
            }
            //将值传给初始化图表的函数
            initChart(TotalARList, TotalAPList, ProfitList);
            setloading(false);
        }
    }

    //初始化图表
    let myChart: any;
    let initChart = (TotalARList: [], TotalAPList: [], ProfitList: []) => {
        let element = document.getElementById('ICProfitMonth');
        if (myChart != null && myChart != "" && myChart != undefined) {
            myChart.dispose();
        }
        let option: any;
        if (element) {
            myChart = echarts.init(element as HTMLDivElement);
            option = {
                title: {
                    text: '月度收支毛利',
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow',
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
                legend: {
                    textStyle: {
                        color: 'black',
                        fontSize: 16,
                    },
                    data: ['收入', '支出', '毛利'],
                },
                xAxis: {
                    axisLabel: {
                        show: true,
                        color: 'black',
                        fontSize: 16,
                    },
                    data: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
                },
                yAxis: {
                    name: '单位: CNY(万)',
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
                series: [
                    {
                        name: '收入',
                        type: 'bar',
                        color: 'green',
                        label: {
                            show: true,
                            position: 'top',
                            color: 'black',
                            fontSize: 16,
                            formatter: function (params: any) {
                                if (params.value > 0) {
                                    return params.value;
                                } else {
                                    return ' ';
                                }
                            },
                        },
                        data: transIntOfArraay(TotalARList),
                    },
                    {
                        type: 'bar',
                        name: '支出',
                        color: '#C23531',
                        label: {
                            show: true,
                            position: 'top',
                            color: 'black',
                            fontSize: 16,
                            formatter: function (params: any) {
                                if (params.value > 0) {
                                    return params.value;
                                } else {
                                    return ' ';
                                }
                            },
                        },
                        data: transIntOfArraay(TotalAPList),
                    },
                    {
                        type: 'line',
                        name: '毛利',
                        color: '#FF7C00',
                        data: transIntOfArraay(ProfitList),
                    },
                ]
            };
            myChart.setOption(option, true);
            myChart.resize({ width: window.innerWidth - 72 });
            window.addEventListener('resize', () => { myChart.resize({ width: window.innerWidth - 72 }) });
        }
    };

    /**
     * 第2个参数传 [initialState] 相当于 componentWillUnmount 钩子
     */
    useEffect(() => {
        let ParamsInfo: object = {
            BranchID: getselectBranchID(),
            Year: getselectYear(),
            BizLines: initialState?.searchInfo?.BusinessesLineList || [1, 2, 3, 4, 5],
            TransTypes: initialState?.searchInfo?.BizType1List_MultiSelect || [1, 2, 3, 4, 5, 6, 10, 11, 12, 13, 14],
            TradeTypes: initialState?.searchInfo?.BizType2List || [1, 2, 3, 4, 5, 6],
            CargoTypes: initialState?.searchInfo?.OceanTransportTypeList_MultiSelect || [1, 2, 3, 6, 7],
        };
        if (getselectBranchID() !== '') {
            fetchData(ParamsInfo);
        }
    }, [initialState]);

    return (
        <PageContainer>
            <Spin tip="数据正在加载中,请稍等..." spinning={loading}>
                <Card>
                    <div id="ICProfitMonth" style={{ width: '100%', height: 800 }}></div>
                </Card>
            </Spin>

            {/*重点代码*/}
            <ContextProps.Provider value={2.2}>
                <SearchButton />
            </ContextProps.Provider>
        </PageContainer>
    )
};

export default ICProfitMonth;