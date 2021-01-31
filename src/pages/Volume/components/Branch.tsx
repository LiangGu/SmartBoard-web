import React, { useState, useEffect, } from 'react';
import { useModel } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Spin, Row, Col, Tooltip, } from 'antd';
// import styles from '../index.less';
//  引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入需要用到的图表
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/pie';
// 引入提示框和标题组件
import 'echarts/lib/component/title';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
//调用API
import { getBranchChartData, } from '@/services/volume';
//调用公式方法
import { transIntOfArraay, } from '@/utils/utils';
import { getselectBranchID, getselectYear, getselectBusinessesLine, getselectBizType1List_Radio, getselectOceanTransportType, } from '@/utils/auths';
//引入自定义组件
import SearchButton from '@/components/Search/SearchButton';
//重点代码<React hooks之useContext父子组件传值>
import ContextProps from '@/createContext';
// 引入图标
// import img_Container from '@/assets/businessLine/container.svg';
// import img_Bulk from '@/assets/businessLine/bulk.svg';
// import img_Airplane from '@/assets/businessLine/airplane.svg';
// import img_Truck from '@/assets/businessLine/truck.svg';
// import img_Ship from '@/assets/businessLine/ship.svg';
// import img_Project from '@/assets/businessLine/project.svg';
// import img_Contract from '@/assets/businessLine/contract.svg';
// import img_Ecommerce from '@/assets/businessLine/ecommerce.svg';

const VolumeBranch: React.FC<{}> = () => {
    const { initialState, } = useModel('@@initialState');
    const [year,] = useState(() => {
        // 惰性赋值 any 类型,要不默认值不起作用
        let selectYear: any = getselectYear();
        return selectYear;
    });
    const [loading, setloading] = useState(false);
    const [businessLine, setBusinessLine] = useState(1);
    const [title, setTitle] = useState('水路货代 - 集装箱量');
    const [unit, setUnit] = useState('单位:TEU');

    //获取数据
    let fetchData = async (ParamsInfo: any) => {
        setloading(true);
        const result = await getBranchChartData(ParamsInfo);
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
    let Chart_Pie: any;
    let Chart_Bar: any;
    let initChart = (result: any) => {
        let Element_Pie = document.getElementById('VolumeBusinessLinePie');
        let Element_Bar = document.getElementById('VolumeBusinessLineBar');
        if (Chart_Pie != null && Chart_Pie != "" && Chart_Pie != undefined) {
            Chart_Pie.dispose();
        }
        if (Chart_Bar != null && Chart_Bar != "" && Chart_Bar != undefined) {
            Chart_Bar.dispose();
        }
        let Option_Pie: any;
        let Option_Bar: any;

        let SelectYearData: any = [];
        let LastYearData: any = [];
        let PieLegendData: any = [];
        let PieSeriesData: any = [];
        let BarxAxisData: any = [];
        let BarSeriesData_SelectYear: any = [];
        let BarSeriesData_LastYear: any = [];

        if(result.length > 0){
            SelectYearData = result.filter((x: { FinanceYear: any; }) => x.FinanceYear == year);
            LastYearData = result.filter((x: { FinanceYear: any; }) => x.FinanceYear !== year);
        }
        //赋值饼图 + 公司名信息
        if (SelectYearData.length > 0) {
            SelectYearData.map((x: { Volume: number; BranchName: string;}) => {
                PieLegendData.push(x.BranchName);
                PieSeriesData.push({
                    value: x.Volume,
                    name: x.BranchName,
                });
                //当前选择的年和前一年的公司List是相同的,所以在这边直接赋值 BarxAxisData
                BarxAxisData.push(x.BranchName);
            });
        }
        //赋值柱状图当前选择的年和前一年
        if (SelectYearData.length > 0) {
            SelectYearData.map((x: { Volume: number;}) => {
                BarSeriesData_SelectYear.push(x.Volume);
            });
        }
        if (LastYearData.length > 0) {
            LastYearData.map((x: { Volume: number;}) => {
                BarSeriesData_LastYear.push(x.Volume);
            });
        }

        if (Element_Pie) {
            Chart_Pie = echarts.init(Element_Pie as HTMLDivElement);
            Option_Pie = {
                title: {
                    text: '累计占比',
                    left: 'center',
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{b} : {c} ({d}%)',
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
                    orient: 'vertical',
                    left: 'left',
                    textStyle: {
                        color: 'black',
                        fontSize: 16,
                    },
                    data: [...PieLegendData],
                },
                series: [
                    {
                        type: 'pie',
                        radius: '70%',
                        center: ['50%', '50%'],
                        data: [...PieSeriesData],
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)',
                            }
                        },
                        label: {
                            show: true,
                            fontSize: 16,
                        },
                    },
                ]
            };
            Chart_Pie.setOption(Option_Pie);
            Chart_Pie.resize({ width: (window.innerWidth - 72) / 2 });
            window.addEventListener('resize', () => { Chart_Pie.resize({ width: (window.innerWidth - 72) / 2 }) });
        }
        if (Element_Bar) {
            Chart_Bar = echarts.init(Element_Bar as HTMLDivElement);
            Option_Bar = {
                title: {
                    text: '累计同比',
                    left: 'center',
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
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    textStyle: {
                        color: 'black',
                        fontSize: 16,
                    },
                    data: [`${year - 1}`,`${year}`],
                },
                yAxis: {
                    type: 'category',
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
                    data: [...BarxAxisData],
                },
                series: [
                    {
                        type: 'bar',
                        name: `${year - 1}`,
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
                        data: transIntOfArraay(BarSeriesData_LastYear),
                    },
                    {
                        type: 'bar',
                        name:  `${year}`,
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
                        data: transIntOfArraay(BarSeriesData_SelectYear),
                    },
                ]
            };
            Chart_Bar.setOption(Option_Bar);
            Chart_Bar.resize({ width: (window.innerWidth - 72) / 2 });
            window.addEventListener('resize', () => { Chart_Bar.resize({ width: (window.innerWidth - 72) / 2 }) });
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
            CargoTypes: [getselectOceanTransportType()],
        };
        if (getselectBranchID() !== '') {
            fetchData(ParamsInfo);
        }
    }, [initialState]);

    /**
     * 点击切换业务线
     */
    // const onChangeBusinessLine = (Type: number, Title: string, Unit: string) => {
    //     setBusinessLine(Type);
    //     setTitle(Title);
    //     setUnit(Unit);
    //     // 切换业务线获取数据
    //     let ParamsInfo: object = {
    //         BranchID: getselectBranchID(),
    //         Year: getselectYear(),
    //         Months: initialState?.searchInfo?.MonthList || [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    //         BizLines: [getselectBusinessesLine()],
    //         TransTypes: [getselectBizType1List_Radio()],
    //         TradeTypes: initialState?.searchInfo?.BizType2List || [1, 2, 3, 4, 5, 6],
    //         CargoTypes: [getselectOceanTransportType()],
    //     };
    //     if (getselectBranchID() !== '') {
    //         fetchData(ParamsInfo, Type, Title);
    //     }
    // }

    return (
        <PageContainer>

            <Spin tip="数据正在加载中,请稍等..." spinning={loading}>
                <Card
                    title={`${title} (` + `${unit} )`}
                    style={{ marginBottom: 10 }}
                    extra={
                        <>

                        </>
                    }>
                    <Row>
                        <Col span={12}>
                            <div id="VolumeBusinessLinePie" style={{ width: '100%', height: 800 }}></div>
                        </Col>
                        <Col span={12}>
                            <div id="VolumeBusinessLineBar" style={{ width: '100%', height: 800 }}></div>
                        </Col>
                    </Row>
                </Card>
            </Spin>

            {/* <Row>
                <Col span={24}>
                    <div className={styles.BusinessLineContainer}>
                        <Tooltip placement="top" title={'水路货代 - 集装箱'}>
                            <div className={styles.ImgContainer} onClick={() => onChangeBusinessLine(1, '水路货代 - 集装箱量', '单位:TEU')} >
                                <img src={img_Container} style={{ backgroundColor: businessLine == 1 ? 'white' : '#D4D4D4' }} />
                            </div>
                        </Tooltip>
                        <Tooltip placement="top" title={'水路货代 - 散杂货'}>
                            <div className={styles.ImgContainer} onClick={() => onChangeBusinessLine(2, '水路货代 - 散杂货量', '单位:万计费吨')}>
                                <img src={img_Bulk} style={{ backgroundColor: businessLine == 2 ? 'white' : '#D4D4D4' }} />
                            </div>
                        </Tooltip>
                        <Tooltip placement="top" title={'航空货代'}>
                            <div className={styles.ImgContainer} onClick={() => onChangeBusinessLine(3, '航空货代', '单位:万公斤')}>
                                <img src={img_Airplane} style={{ backgroundColor: businessLine == 3 ? 'white' : '#D4D4D4' }} />
                            </div>
                        </Tooltip>
                        <Tooltip placement="top" title={'公路货代'}>
                            <div className={styles.ImgContainer} onClick={()=>onChangeBusinessLine(4,'公路货代','单位:计费吨')}>
                                <img src={img_Truck} style={{backgroundColor: businessLine == 4 ? 'white' : '#D4D4D4'}} />
                            </div>
                        </Tooltip>
                        <Tooltip placement="top" title={'集装箱船代 - 艘次与箱'}>
                            <div className={styles.ImgContainer} onClick={()=>onChangeBusinessLine(5,'集装箱船代 - 艘次与箱量','单位:艘次')}>
                                <img src={img_Ship} style={{backgroundColor: businessLine == 5 ? 'white' : '#D4D4D4'}} />
                            </div>
                        </Tooltip>
                        <Tooltip placement="top" title={'项目物流 - 工程物流'}>
                            <div className={styles.ImgContainer} onClick={() => onChangeBusinessLine(6, '项目物流 - 工程物流操作量', '单位:万计费吨')}>
                                <img src={img_Project} style={{ backgroundColor: businessLine == 6 ? 'white' : '#D4D4D4' }} />
                            </div>
                        </Tooltip>
                        <Tooltip placement="top" title={'合同物流'}>
                            <div className={styles.ImgContainer} onClick={() => onChangeBusinessLine(7, '合同物流操作量', '单位:万计费吨')}>
                                <img src={img_Contract} style={{ backgroundColor: businessLine == 7 ? 'white' : '#D4D4D4' }} />
                            </div>
                        </Tooltip>
                        <Tooltip placement="top" title={'电子商务 - 电商物流操作'}>
                            <div className={styles.ImgContainer} onClick={()=>onChangeBusinessLine(8,'电子商务 - 电商物流操作量','单位:票')}>
                                <img src={img_Ecommerce} style={{backgroundColor: businessLine == 8 ? 'white' : '#D4D4D4'}} />
                            </div>
                        </Tooltip>
                    </div>
                </Col>
            </Row> */}

            {/*重点代码*/}
            <ContextProps.Provider value={1.1}>
                <SearchButton />
            </ContextProps.Provider>
        </PageContainer>
    )
};

export default VolumeBranch;