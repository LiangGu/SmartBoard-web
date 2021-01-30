import React, { useState, useEffect, } from 'react';
import { useModel } from 'umi';
import { Card, Radio, Spin, } from 'antd';
//引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入需要用到的图表
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/bar';
// 引入提示框和标题组件
import 'echarts/lib/component/title';
import 'echarts/lib/component/tooltip';
//调用API
import { getPortChartData, } from '@/services/volume';
//调用公式方法
import { sortObjectArr, transIntOfArraay, calculateOfArraay, FilterZeroOfArraay, } from '@/utils/utils';
import { OceanTransportTypeList,} from '@/utils/baseData';
import { getselectBranchID, getselectYear, getselectBusinessesLine, getselectBizType1List_Radio, getselectOceanTransportType, } from '@/utils/auths';
//引入自定义组件
import SearchButton from '@/components/Search/SearchButton';
//重点代码<React hooks之useContext父子组件传值>
import ContextProps from '@/createContext';

const VolumePort: React.FC<{}> = () => {
    const { initialState, } = useModel('@@initialState');
    const [OceanTransportType,] = useState(() => {
        // 惰性赋值 any 类型,要不默认值不起作用
        let selectOceanTransportType: any = getselectOceanTransportType();
        return selectOceanTransportType;
    });
    const [loading, setloading] = useState(false);

    //获取数据
    let fetchData = async (ParamsInfo: any) => {
        setloading(true);
        const result = await getPortChartData(ParamsInfo);
        if (!result || getselectBranchID() == '') {
            return;
        }
        if (result) {
            //将值传给初始化图表的函数
            initChart(result);
            setloading(false);
        }
    }

    //初始化图表
    let myChart: any;
    let initChart = (result: any) => {
        let element = document.getElementById('VolumePort');
        if (myChart != null && myChart != "" && myChart != undefined) {
            myChart.dispose();
        }
        let option: any;

        //处理数据
        let PortTopList: any = [];
        let PortTopTotalVolumeList: any = [];
        let PortTopPortNameList: any = [];
        PortTopList = FilterZeroOfArraay((result.sort(sortObjectArr('Volume', 2)).slice(0, 10)).sort(sortObjectArr('Volume', 1)), 0, 'Volume');
        if (PortTopList.length > 0) {
            PortTopList.map((x: { Volume: any; PortName: string; }) => {
                PortTopTotalVolumeList.push(x.Volume);
                PortTopPortNameList.push(x.PortName);
            });
        }
        let yAxisName = '';
        if(PortTopList.length > 0){
            yAxisName = PortTopList[0].VolUnit;
        }

        if (element) {
            myChart = echarts.init(element as HTMLDivElement);
            option = {
                title: {
                    text: `前10港口${OceanTransportTypeList.find(x=>x.Key == OceanTransportType)?.Value}排名`,
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
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true,
                },
                xAxis: {
                    type: 'value',
                    axisLabel: {
                        show: true,
                        color: 'black',
                        fontSize: 16,
                    },
                    boundaryGap: [0, 0.01],
                },
                yAxis: {
                    type: 'category',
                    name: `单位: ${yAxisName}`,
                    scale: true,
                    axisLabel: {
                        show: true,
                        color: 'black',
                        fontSize: 16,
                    },
                    nameTextStyle: {
                        color: 'black',
                        fontSize: 16,
                    },
                    data: [...PortTopPortNameList],
                },
                series: [
                    {
                        type: 'bar',
                        name: yAxisName,
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
                        data: transIntOfArraay(PortTopTotalVolumeList),
                    }
                ],
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
            Months: initialState?.searchInfo?.MonthList || [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            TransTypes: [getselectBizType1List_Radio()],
            TradeTypes: initialState?.searchInfo?.BizType2List || [1, 2, 3, 4, 5, 6],
            CargoTypes: [getselectOceanTransportType()],
            BizLines: [getselectBusinessesLine()],
        };
        if (getselectBranchID() !== '') {
            fetchData(ParamsInfo);
        }
    }, [initialState]);

    return <>
        <Spin tip="数据正在加载中,请稍等..." spinning={loading}>
            <Card>
                <div id="VolumePort" style={{ width: '100%', height: 800 }}></div>
            </Card>
        </Spin>

        {/*重点代码*/}
        <ContextProps.Provider value={1.3}>
            <SearchButton />
        </ContextProps.Provider>
    </>
};

export default VolumePort;