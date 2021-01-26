import React, { useState, useEffect, } from 'react';
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
import { getBranchChartData, } from '@/services/volume';
//调用公式方法
import { sortObjectArr, transIntOfArraay, calculateOfArraay, FilterZeroOfArraay, } from '@/utils/utils';
import { getselectBranchID, getselectYear, getselectOceanTransportType, } from '@/utils/auths';
//引入自定义组件
import SearchButton from '@/components/Search/SearchButton';
//引入基础数据
import { BranchList, } from '@/utils/baseData';
//重点代码<React hooks之useContext父子组件传值>
import ContextProps from '@/createContext';

const VolumeBranch: React.FC<{}> = () => {
    const { initialState, } = useModel('@@initialState');
    const [loading, setloading] = useState(false);

    //获取数据
    let fetchData = async (ParamsInfo: any,) => {
        setloading(true);
        const result = await getBranchChartData(ParamsInfo);
        if (!result || getselectBranchID() == '') {
            return;
        }
        if (result) {
            let SortVolumeBranchList: any = [];
            let TotalVolumeList: any = [];
            let yAxisData: any = [];
            if (result.length > 0) {
                SortVolumeBranchList = FilterZeroOfArraay(result.sort(sortObjectArr('Volume', 1)), 0, 'Volume');
                if (SortVolumeBranchList && SortVolumeBranchList.length > 0) {
                    SortVolumeBranchList.map((x: { Volume: any; BranchName: any; BranchID: Number }) => {
                        TotalVolumeList.push(x.Volume);
                        yAxisData.push(BranchList.find(y => y.Key == x.BranchID)?.Value);      //*后台返回的 BranchName 是 null ,先前台自行过滤
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
        //赋值月度货量图表中的单位
        let UnitName = '';
        if (Number(getselectOceanTransportType()) == 1) {
            UnitName = '单位: TEU';
        } else if (Number(getselectOceanTransportType()) == 2) {
            UnitName = '单位: CBM';
        } else if (Number(getselectOceanTransportType()) == 3) {
            UnitName = '单位: TON';
            //后台散货存的是 KGS
            TotalVolumeList = calculateOfArraay(TotalVolumeList, '/', 1000);
        } else if (Number(getselectOceanTransportType()) == 6) {
            UnitName = '单位: 批次';
        } else if (Number(getselectOceanTransportType()) == 7) {
            UnitName = '单位: KGS';
        } else {
            UnitName = '单位: RT';
        }
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
                        name: UnitName,
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
                        name: UnitName,
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
                        data: transIntOfArraay(TotalVolumeList),
                    },
                ]
            };
            myChart.setOption(option);
            window.addEventListener('resize', () => { myChart.resize({ height: window.innerHeight - 256 }) });
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
                    <div id="VolumeBranch" style={{ width: '100%', height: window.innerHeight - 256 }}></div>
                </Card>
            </Spin>

            {/*重点代码*/}
            <ContextProps.Provider value={6}>
                <SearchButton />
            </ContextProps.Provider>
        </PageContainer>
    )
};

export default VolumeBranch;