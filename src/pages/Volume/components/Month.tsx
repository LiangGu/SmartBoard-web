import React, { useState, useEffect, } from 'react';
import { useModel } from 'umi';
import { Card, Spin, } from 'antd';
//引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入需要用到的图表
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/bar';
// 引入提示框和标题组件
import 'echarts/lib/component/title';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
//调用API
import { getVolumeChartData, } from '@/services/volume';
//调用公式方法
import { getLineStackSeriesData, getLineStackLegendData, } from '@/utils/utils';
import { OceanTransportTypeList_MultiSelect, } from '@/utils/baseData';
import { getselectBranchID, getselectYear, getselectBusinessesLine, getselectBizType1List_Radio, getselectOceanTransportType, } from '@/utils/auths';
//引入自定义组件
import SearchButton from '@/components/Search/SearchButton';
//重点代码<React hooks之useContext父子组件传值>
import ContextProps from '@/createContext';

const VolumeMonth: React.FC<{}> = () => {
    const { initialState, } = useModel('@@initialState');
    const [loading, setloading] = useState(false);

    const [title, setTitle] = useState('');

    //获取数据
    let fetchData = async (ParamsInfo: any) => {
        setloading(true);
        //货量
        const resultVolume = await getVolumeChartData(ParamsInfo);
        if (!resultVolume || getselectBranchID() == '') {
            return;
        }
        if (resultVolume) {
            //当前选择年的货量数据
            let SelectYearVolumeData: any = [];
            if (resultVolume.length > 0) {
                SelectYearVolumeData = resultVolume.filter((x: { Year: any; }) => x.Year == ParamsInfo.Year);
            }
            let titleName = '';
            titleName = OceanTransportTypeList_MultiSelect.find((x: { Key: any; }) => x.Key == parseInt(ParamsInfo.CargoTypes[0]))?.Value || '';
            setTitle(titleName);
            //将值传给初始化图表的函数
            initChart(SelectYearVolumeData, titleName);
            setloading(false);
        }
    }

    //初始化图表
    let Chart_RT: any;
    let initChart = (SelectYearVolumeData: any, titleName: string) => {
        let Element_RT = document.getElementById('RTMonth');
        if (Chart_RT != null && Chart_RT != "" && Chart_RT != undefined) {
            Chart_RT.dispose();
        }
        let Option_RT: any;
        //单位
        let yAxisName = '';
        if (SelectYearVolumeData.length > 0) {
            yAxisName = SelectYearVolumeData[0].VolUnit;
        }

        if (Element_RT) {
            Chart_RT = echarts.init(Element_RT as HTMLDivElement);
            Option_RT = {
                title: {
                    text: `月度${titleName}货量`,
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'line',
                    },
                },
                legend: {
                    bottom: 'bottom',
                    textStyle: {
                        color: 'black',
                        fontSize: 16,
                    },
                    data: getLineStackLegendData(SelectYearVolumeData, 1),
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
                xAxis: [
                    {
                        type: 'category',
                        axisLabel: {
                            show: true,
                            color: 'black',
                            fontSize: 16,
                        },
                        data: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
                    },
                ],
                yAxis: {
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
                    type: 'value'
                },
                series: getLineStackSeriesData(SelectYearVolumeData, 1),
            };
            Chart_RT.setOption(Option_RT, true);
            Chart_RT.resize({ width: window.innerWidth - 72 });
            window.addEventListener('resize', () => { Chart_RT.resize({ width: window.innerWidth - 72 }) });
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
            BizLines: [getselectBusinessesLine()],
            TransTypes: [getselectBizType1List_Radio()],
            TradeTypes: initialState?.searchInfo?.BizType2List || [1, 2, 3, 4, 5, 6],
            CargoTypes: getselectOceanTransportType() == 'null' ? [] : [getselectOceanTransportType()],
        };
        if (getselectBranchID() !== '') {
            fetchData(ParamsInfo);
        }
    }, [initialState]);

    return <>
        <Spin tip="数据正在加载中,请稍等..." spinning={loading} >
            <Card style={{ marginBottom: 10 }}>
                <div id="RTMonth" style={{ width: '100%', height: 800 }}></div>
            </Card>
        </Spin>

        {/*重点代码*/}
        <ContextProps.Provider value={1.2}>
            <SearchButton />
        </ContextProps.Provider>
    </>
}

export default VolumeMonth;