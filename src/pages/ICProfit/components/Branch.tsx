import React, { useState, useEffect, useContext, } from 'react';
import { useModel } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Radio, Spin, } from 'antd';
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
import { getICProfitBranchData, } from '@/services/icprofit';
//调用公式方法
import { sortObjectArr, transIntOfArraay, } from '@/utils/utils';
import { getselectBranchID, getselectYear, getselectOceanTransportType, } from '@/utils/auths';
//引入自定义组件
import SearchButton from '@/components/Search/SearchButton';
//重点代码<React hooks之useContext父子组件传值>
import ContextProps from '@/createContext';

const ICProfitBranch: React.FC<{}> = () => {
    const { initialState, } = useModel('@@initialState');
    const [loading, setloading] = useState(false);
    const [type, setType] = useState('收入');
    const [result, setResult] = useState([]);

    //获取数据
    let fetchData = async (ParamsInfo: any, T: string) => {
        setloading(true);
        const result = await getICProfitBranchData(ParamsInfo);
        if (!result || getselectBranchID() == '') {
            return;
        }
        if (result) {
            if (result.length > 0) {
                setResult(result);
            }
            //将值传给初始化图表的函数
            initChart(result, T);
            setloading(false);
        }
    }

    //初始化图表
    let myChart: any;
    let initChart = (result: any, type: string) => {
        let element = document.getElementById('ICProfitBranch');
        if (myChart != null && myChart != "" && myChart != undefined) {
            myChart.dispose();
        }
        let option: any;

        // 根据 type 排序
        let SortICProfitList: any = [];
        let TotalARList: any = [];
        let TotalAPList: any = [];
        let ProfitList: any = [];
        let yAxisData: any = [];

        if (type == '收入') {
            SortICProfitList = result.sort(sortObjectArr('AmountAR', 1));
        } else {
            SortICProfitList = result.sort(sortObjectArr('Profit', 1));
        }
        if (SortICProfitList && SortICProfitList.length > 0) {
            SortICProfitList.map((x: { AmountAR: any; AmountAP: any; Profit: any; BranchName: any }) => {
                TotalARList.push((x.AmountAR / 10000).toFixed(2));
                // 支出转换成负数
                TotalAPList.push((x.AmountAP * -1 / 10000).toFixed(2));
                ProfitList.push((x.Profit / 10000).toFixed(2));
                yAxisData.push(`${x.BranchName}`);
            });
        }

        if (element) {
            myChart = echarts.init(element as HTMLDivElement);
            option = {
                title: {
                    text: '公司收支毛利',
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
                legend: {
                    textStyle: {
                        color: 'black',
                        fontSize: 16,
                    },
                    data: ['收入', '支出', '毛利'],
                    selected: {
                        '支出': false,
                    },
                },
                xAxis: [
                    {
                        type: 'value',
                        axisLabel: {
                            show: true,
                            color: 'black',
                            fontSize: 16,
                        },
                    },
                ],
                yAxis: [
                    {
                        type: 'category',
                        name: '单位: CNY(万)',
                        axisLabel: {
                            show: true,
                            color: 'black',
                            fontSize: 16,
                        },
                        nameTextStyle: {
                            color: 'black',
                            fontSize: 16,
                        },
                        data: [...yAxisData],
                    }
                ],
                series: [
                    {
                        name: '毛利',
                        type: 'bar',
                        color: '#FF7C00',
                        label: {
                            show: true,
                            position: 'right',
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
                        data: transIntOfArraay(ProfitList),
                    },
                    {
                        name: '收入',
                        type: 'bar',
                        stack: '总量',
                        color: 'green',
                        label: {
                            show: true,
                            position: 'right',
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
                        name: '支出',
                        type: 'bar',
                        stack: '总量',
                        color: '#C23531',
                        label: {
                            show: true,
                            position: 'left',
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
                    }
                ]
            };
            myChart.setOption(option);
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
            fetchData(ParamsInfo, type);
        }
    }, [initialState]);

    /**
     * 点击切换统计图表类型
     */
    const onChangeType = (e: any) => {
        setType(e.target.value);
        initChart(result, e.target.value);
    }

    return (
        <PageContainer>
            <Spin tip="数据正在加载中,请稍等..." spinning={loading}>
                <Card
                    extra={
                        <>
                            <Radio.Group defaultValue={type} buttonStyle="solid" onChange={onChangeType}>
                                <Radio.Button value="收入">收入</Radio.Button>
                                <Radio.Button value="毛利">毛利</Radio.Button>
                            </Radio.Group>
                        </>
                    }
                >
                    <div id="ICProfitBranch" style={{ width: '100%', height: 800 }}></div>
                </Card>
            </Spin>

            {/*重点代码*/}
            <ContextProps.Provider value={2.1}>
                <SearchButton />
            </ContextProps.Provider>
        </PageContainer>
    )
};

export default ICProfitBranch;