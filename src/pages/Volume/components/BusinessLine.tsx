import React, { useState, useEffect, useContext, } from 'react';
import { useModel } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Spin, Row, Col, Tooltip, } from 'antd';
import styles from '../index.less';
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
import { getICProfitChartData, } from '@/services/icprofit';
//调用公式方法
import { sortObjectArr, transIntOfArraay, } from '@/utils/utils';
import { getselectBranchID, getselectYear, getselectOceanTransportType, } from '@/utils/auths';
//引入自定义组件
import SearchButton from '@/components/Search/SearchButton';
//重点代码<React hooks之useContext父子组件传值>
import ContextProps from '@/createContext';
// 引入图标
import img_Container from '@/assets/businessLine/container.svg';
import img_Bulk from '@/assets/businessLine/bulk.svg';
import img_Airplane from '@/assets/businessLine/airplane.svg';
import img_Truck from '@/assets/businessLine/truck.svg';
import img_Ship from '@/assets/businessLine/ship.svg';
import img_Project from '@/assets/businessLine/project.svg';
import img_Contract from '@/assets/businessLine/contract.svg';
import img_Ecommerce from '@/assets/businessLine/ecommerce.svg';

const VolumeBusinessLine: React.FC<{}> = () => {
    const { initialState, } = useModel('@@initialState');
    const [loading, setloading] = useState(false);
    const [businessLine, setBusinessLine] = useState(1);
    const [title, setTitle] = useState('水路货代 - 集装箱量');
    const [unit, setUnit] = useState('单位:TEU');

    //获取数据
    let fetchData = async (ParamsInfo: any, LineID: number, Title: string) => {
        setloading(true);
        // const result = await getICProfitChartData(ParamsInfo);

        // 假数据
        const result = [
            // 水路货代 - 集装箱
            { value2019: 44497, value2020: 35658, name: '上海伟运', Type: 1 },
            { value2019: 18395, value2020: 21258, name: '泰国公司', Type: 1 },
            { value2019: 15197, value2020: 11785, name: '中越外运', Type: 1 },
            { value2019: 8987, value2020: 9678, name: '马来西亚公司', Type: 1 },
            { value2019: 6495, value2020: 6644, name: '柬埔寨公司', Type: 1 },
            { value2019: 5450, value2020: 4663, name: '香港船务', Type: 1 },
            { value2019: 4110, value2020: 3070, name: '缅甸公司', Type: 1 },
            { value2019: 3315, value2020: 2107, name: '印尼公司', Type: 1 },
            // 水路货代 – 散杂货
            { value2019: 141.48, value2020: 161.58, name: '印尼公司', Type: 2 },
            { value2019: 4.03, value2020: 18.04, name: '马来西亚公司', Type: 2 },
            { value2019: 28.18, value2020: 15.99, name: '香港船务', Type: 2 },
            { value2019: 0, value2020: 4.57, name: '柬埔寨公司', Type: 2 },
            { value2019: 0.48, value2020: 1.99, name: '上海伟运', Type: 2 },
            { value2019: 5.94, value2020: 0.20, name: '泰国公司', Type: 2 },
            // 航空货代
            { value2019: 89.64, value2020: 66.12, name: '上海伟运', Type: 3 },
            { value2019: 68.24, value2020: 39.62, name: '泰国公司', Type: 3 },
            { value2019: 18.6, value2020: 31.95, name: '马来西亚公司', Type: 3 },
            { value2019: 6.91, value2020: 6.96, name: '中越外运', Type: 3 },
            { value2019: 5.50, value2020: 5.01, name: '柬埔寨公司', Type: 3 },
            { value2019: 6.96, value2020: 3.22, name: '香港船务', Type: 3 },
            { value2019: 8.47, value2020: 2.66, name: '印尼公司', Type: 3 },
            { value2019: 1, value2020: 0.69, name: '缅甸公司', Type: 3 },

            // 项目物流 – 工程物流
            { value2019: 17.43, value2020: 4.80, name: '柬埔寨公司', Type: 6 },
            { value2019: 2.18, value2020: 4.68, name: '中越外运', Type: 6 },
            { value2019: 11.3, value2020: 3.64, name: '马来西亚公司', Type: 6 },
            { value2019: 9.45, value2020: 2.81, name: '印尼公司', Type: 6 },
            { value2019: 0, value2020: 1.91, name: '缅甸公司', Type: 6 },
            { value2019: 0.96, value2020: 0.17, name: '香港船务', Type: 6 },
            { value2019: 0.4, value2020: 0.05, name: '泰国公司', Type: 6 },
            // 合同物流
            { value2019: 40.20, value2020: 51.55, name: '马来西亚公司', Type: 7 },
            { value2019: 11.05, value2020: 33.5, name: '印尼公司', Type: 7 },
            { value2019: 11.55, value2020: 12.64, name: '香港仓储', Type: 7 },
            { value2019: 3.98, value2020: 6.59, name: '泰国公司', Type: 7 },
            { value2019: 0.06, value2020: 1.29, name: '中越外运', Type: 7 },
            { value2019: 0.05, value2020: 0.62, name: '缅甸公司', Type: 7 },
        ];

        if (!result || getselectBranchID() == '') {
            return;
        }
        if (result) {
            //将值传给初始化图表的函数
            initChart(result, LineID, Title);
            setloading(false);
        }
    }

    //初始化图表
    let Chart_Pie: any;
    let Chart_Bar: any;
    let initChart = (result: any, LineID: number, Title: string) => {
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

        // 根据 LineID 过滤 && 处理数据
        let LineData: any = [];
        let PieLegendData: any = [];
        let PieSeriesData: any = [];
        let BarxAxisData: any = [];
        let BarSeriesData2019: any = [];
        let BarSeriesData2020: any = [];

        LineData = result.filter((item: any) => item.Type == LineID);
        if (LineData.length > 0) {
            LineData.map((x: { value2019: number; value2020: number; name: string; }) => {
                PieLegendData.push(x.name);
                PieSeriesData.push({
                    value: Math.round(x.value2019 + x.value2020),
                    name: x.name,
                });
                BarxAxisData.push(x.name);
                BarSeriesData2019.push(x.value2019);
                BarSeriesData2020.push(x.value2020);
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
            window.addEventListener('resize', () => { Chart_Pie.resize() });
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
                xAxis: {
                    type: 'category',
                    axisLabel: {
                        show: true,
                        // 让显示所有 X 轴
                        interval: 0,
                        color: 'black',
                        fontSize: 16,
                    },
                    data: [...BarxAxisData],
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    textStyle: {
                        color: 'black',
                        fontSize: 16,
                    },
                    data: ['2020', '2019'],
                },
                yAxis: {
                    type: 'value',
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
                        type: 'bar',
                        name: '2020',
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
                        data: transIntOfArraay(BarSeriesData2020),
                    },
                    {
                        type: 'bar',
                        name: '2019',
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
                        data: transIntOfArraay(BarSeriesData2019),
                    },
                ]
            };
            Chart_Bar.setOption(Option_Bar);
            window.addEventListener('resize', () => { Chart_Bar.resize() });
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
            fetchData(ParamsInfo, businessLine, title);
        }
    }, [initialState]);

    /**
     * 点击切换业务线
     */
    const onChangeBusinessLine = (Type: number, Title: string, Unit: string) => {
        setBusinessLine(Type);
        setTitle(Title);
        setUnit(Unit);
        // 切换业务线获取数据
        let ParamsInfo: object = {
            BranchID: getselectBranchID(),
            Year: getselectYear(),
            TransTypes: initialState?.searchInfo?.BizType1List || [1, 2, 3, 4, 5, 6, 10, 11, 12, 13, 14],
            TradeTypes: initialState?.searchInfo?.BizType2List || [1, 2, 3, 4, 5, 6],
            CargoTypes: getselectOceanTransportType(),
        };
        if (getselectBranchID() !== '') {
            fetchData(ParamsInfo, Type, Title);
        }
    }

    return (
        <PageContainer>

            <Spin tip="数据正在加载中,请稍等..." spinning={loading}>
                <Card
                    title={title}
                    style={{ marginBottom: 10 }}
                    extra={
                        <span style={{ fontSize: 16 }}>
                            {unit}
                        </span>
                    }>
                    <Row>
                        <Col span={12}>
                            <div id="VolumeBusinessLinePie" style={{ width: '100%', height: 500 }}></div>
                        </Col>
                        <Col span={12}>
                            <div id="VolumeBusinessLineBar" style={{ width: '100%', height: 500 }}></div>
                        </Col>
                    </Row>
                </Card>
            </Spin>

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
                {/* <Tooltip placement="top" title={'公路货代'}>
                    <div className={styles.ImgContainer} onClick={()=>onChangeBusinessLine(4,'公路货代','单位:计费吨')}>
                        <img src={img_Truck} style={{backgroundColor: businessLine == 4 ? 'white' : '#D4D4D4'}} />
                    </div>
                </Tooltip>
                <Tooltip placement="top" title={'集装箱船代 - 艘次与箱'}>
                    <div className={styles.ImgContainer} onClick={()=>onChangeBusinessLine(5,'集装箱船代 - 艘次与箱量','单位:艘次')}>
                        <img src={img_Ship} style={{backgroundColor: businessLine == 5 ? 'white' : '#D4D4D4'}} />
                    </div>
                </Tooltip> */}
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
                {/* <Tooltip placement="top" title={'电子商务 - 电商物流操作'}>
                    <div className={styles.ImgContainer} onClick={()=>onChangeBusinessLine(8,'电子商务 - 电商物流操作量','单位:票')}>
                        <img src={img_Ecommerce} style={{backgroundColor: businessLine == 8 ? 'white' : '#D4D4D4'}} />
                    </div>
                </Tooltip> */}
            </div>

            {/*重点代码*/}
            {/* <ContextProps.Provider value={7}>
                <SearchButton />
            </ContextProps.Provider> */}
        </PageContainer>
    )
};

export default VolumeBusinessLine;