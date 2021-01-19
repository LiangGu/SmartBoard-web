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
import { getICProfitChartData, } from '@/services/icprofit';
//调用公式方法
import { sortObjectArr, transIntofArraay,} from '@/utils/utils';
import { getselectBranchID, getselectYear, getselectOceanTransportType, } from '@/utils/auths';
//引入自定义组件
import SearchButton from '@/components/Search/SearchButton';
//重点代码<React hooks之useContext父子组件传值>
import ContextProps from '@/createContext';

const VolumeBranch: React.FC<{}> = () => {
    const PropsState = useContext(ContextProps);     //得到父组件过来的值
    const { initialState, } = useModel('@@initialState');
    const [loading, setloading] = useState(false);

    //获取数据
    let fetchData = async (ParamsInfo: any,) => {
        setloading(true);
        // const result = await getICProfitChartData(ParamsInfo);

        // 假数据
        const result = [
            { TotalVolume: 5492.57, BranchName: '香港船务', },
            { TotalVolume: 83151.9, BranchName: '上海伟运货代', },
            { TotalVolume: 68515.67, BranchName: '泰国外运', },
            { TotalVolume: 21063.71, BranchName: '马来西亚外运', },
            { TotalVolume: 1721794.09, BranchName: '印尼外运', },
            { TotalVolume: 22615.23, BranchName: '柬埔寨外运', },
            { TotalVolume: 22621.66, BranchName: '缅甸外运', },
            { TotalVolume: 14577.93, BranchName: '中越外运', },
            // {TotalVolume: 0,BranchName: '上海伟运工程',},
            // {TotalVolume: 0,BranchName: '大宗商品事业部',},
            // {TotalVolume: 4.08,BranchName: '空运事业部(伟运)',},
            // {TotalVolume: 35,BranchName: '电商事业部(伟运)',},
            // {TotalVolume: 0,BranchName: '电商事业部(香港)',},
            { TotalVolume: 570.82, BranchName: '中越外运(E拼)', },
            // {TotalVolume: 0,BranchName: '空运事业部(香港)',},
        ];

        if (!result || getselectBranchID() == '') {
            return;
        }
        if (result) {
            let SortVolumeBranchList: any = [];
            let TotalVolumeList: any = [];
            let yAxisData: any = [];
            if (result.length > 0) {
                SortVolumeBranchList = result.sort(sortObjectArr('TotalVolume', 1));
                if (SortVolumeBranchList && SortVolumeBranchList.length > 0) {
                    SortVolumeBranchList.map((x: { TotalVolume: any; BranchName: any }) => {
                        TotalVolumeList.push(x.TotalVolume);
                        yAxisData.push(`${x.BranchName}`);
                    });
                }
            }
            //将值传给初始化图表的函数
            initChart(TotalVolumeList, yAxisData);
            setloading(false);
        }
    }

    //初始化图表
    let myChart: any;
    let initChart = (TotalVolumeList: any, yAxisData: any) => {
        let element = document.getElementById('VolumeBranch');
        if (myChart != null && myChart != "" && myChart != undefined) {
            myChart.dispose();
        }
        let option: any;
        if (element) {
            myChart = echarts.init(element as HTMLDivElement);
            option = {
                title: {
                    text: '公司货量',
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
                        name: '单位: RT',
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
                    },
                ],
                series: [
                    {
                        type: 'bar',
                        name: '货量',
                        color: '#C23531',
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
                        data: transIntofArraay(TotalVolumeList),
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
        if (getselectBranchID() !== '') {
            fetchData(ParamsInfo);
        }
    }, [initialState]);

    return (
        <PageContainer>
            <Spin tip="数据正在加载中,请稍等..." spinning={loading}>
                <Card>
                    <div id="VolumeBranch" style={{ width: '100%', height: 600 }}></div>
                </Card>
            </Spin>

            {/*重点代码*/}
            {/* <ContextProps.Provider value={7}>
                <SearchButton />
            </ContextProps.Provider> */}
        </PageContainer>
    )
};

export default VolumeBranch;