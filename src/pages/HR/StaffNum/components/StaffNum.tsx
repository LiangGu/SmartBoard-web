import React, { useState, useEffect, } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Spin, Row, Col, Button, Drawer, Checkbox, Select, Form, Modal, } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import styles from '@/components/Search/index.less';
//引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入需要用到的图表
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/pie';
import 'echarts/lib/chart/sunburst';
// 引入提示框和标题组件
import 'echarts/lib/component/title';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import { HRBranchList, MonthList, } from '@/utils/baseData';
import { getHRListVO, } from '@/utils/auths';
import { getYearList, sortObjectArr, } from '@/utils/utils';
//调用API
import { getChartDataOfBar, getChartDataOfPie, getBarChartModalData, } from '@/services/hr';

//父组件传过来的Props
type Props = {
    parentType: number,
    currentT: string,
}

//日期
const date = new Date()

const StaffNum: React.FC<Props> = (props) => {
    const [loading, setloading] = useState(false);
    const [DrawerVisible, setDrawerVisible] = useState(false);
    const [ModalVisible, setModalVisible] = useState(false);
    const [ModalTitle, setModalTitle] = useState('');
    const [currentT,] = useState(props.currentT);

    //数据集
    const [YearList,] = useState(() => {
        return getYearList();
    });
    const [MonthListVO,] = useState(MonthList);
    const [HRListOfType, setHRListOfType] = useState(getHRListVO());

    /**
     *  单选
     * */
    // 年份
    const [year, setYear] = useState(date.getFullYear());

    // 月份
    const [month, setMonth] = useState(date.getMonth());

    /**
     *  多选
     * */
    // 业务线                   :1
    const [checkedList3, setCheckedList3] = useState(HRListOfType.map((x: { ID: number; }) => x.ID));
    const [indeterminate3, setIndeterminate3] = useState(false);
    const [checkAll3, setCheckAll3] = useState(true);

    //获取数据(柱状图)
    let fetchDataBar = async (ParamsInfo: any,) => {
        setloading(true);
        const result = await getChartDataOfBar(ParamsInfo);
        let ChartData: any = [];
        if (!result) {
            return;
        }
        if (result) {
            if (result.length > 0) {
                let keysArr = [...new Set(result.map((item: { BranchName: any; }) => item.BranchName))];
                keysArr.forEach(item => {
                    const arr = result.filter((x: { BranchName: string; }) => x.BranchName == item);
                    const total = arr.reduce((a: any, b: { Num: number; }) => a + b.Num, 0);    //全部：加总处理
                    const type1 = arr.filter((x: { Type: number; }) => x.Type == 1).length > 0 ? arr.filter((x: { Type: number; }) => x.Type == 1)[0].Num : 0;  //职能线
                    const type2 = arr.filter((x: { Type: number; }) => x.Type == 2).length > 0 ? arr.filter((x: { Type: number; }) => x.Type == 2)[0].Num : 0;  //业务线
                    const type3 = arr.filter((x: { Type: number; }) => x.Type == 3).length > 0 ? arr.filter((x: { Type: number; }) => x.Type == 3)[0].Num : 0;  //管理层
                    ChartData.push({
                        BranchName: item,
                        total: total,
                        type1: type1,
                        type2: type2,
                        type3: type3,
                    });
                });
            }
            //将值传给初始化图表的函数
            initBarChart(ChartData.sort(sortObjectArr('total', 1)));
            setloading(false);
        }
    }

    //获取数据(饼图)
    let fetchDataPie = async (ParamsInfo: any,) => {
        setloading(true);
        const result = await getChartDataOfPie(ParamsInfo);
        if (result) {
            //将值传给初始化图表的函数
            initPieChart(result);
            setloading(false);
        }
    }

    //获取 Modal 的数据
    let fetchModalData = async (recod: any,) => {
        setModalTitle(recod.name);
        setloading(true);
        const result = await getBarChartModalData({ BranchName: recod.name, year: year, month: month });
        if (result) {
            setModalVisible(true);
            //将值传给初始化图表的函数
            initModalChart(result.sort(sortObjectArr('Num', 1)));
            setloading(false);
        }
    }

    //柱状图
    let Chart_MonthChart_Bar: any;
    let initBarChart = (ChartData: any) => {
        let Element_MonthChart_Bar = document.getElementById('MonthChart');
        let Option_MonthChart_Bar: any;
        if (Element_MonthChart_Bar) {
            Chart_MonthChart_Bar = echarts.init(Element_MonthChart_Bar as HTMLDivElement);
            Option_MonthChart_Bar = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow',
                    },
                },
                legend: {
                    data: ['管理层人数', '职能线人数', '业务线人数',]
                },
                grid: {
                    left: '5%',
                    right: '5%',
                    top: '10%',
                    bottom: '10%',                    //反向排序
                    inverse: true,
                    containLabel: true,
                },
                xAxis: {
                    type: 'value'
                },
                yAxis: {
                    type: 'category',
                    data: ChartData.map((x: { BranchName: string; }) => x.BranchName),
                },
                series: [
                    {
                        name: '管理层人数',
                        type: 'bar',
                        stack: 'total',
                        label: {
                            show: true,
                            formatter: function (params: any) {
                                if (params.value > 0) {
                                    return params.value;
                                } else {
                                    return ' ';
                                }
                            },
                        },
                        emphasis: { focus: 'series', },
                        data: ChartData.map((x: { type3: number; }) => x.type3),
                    },
                    {
                        name: '职能线人数',
                        type: 'bar',
                        stack: 'total',
                        label: {
                            show: true,
                            formatter: function (params: any) {
                                if (params.value > 0) {
                                    return params.value;
                                } else {
                                    return ' ';
                                }
                            },
                        },
                        emphasis: { focus: 'series', },
                        data: ChartData.map((x: { type1: number; }) => x.type1),
                    },
                    {
                        name: '业务线人数',
                        type: 'bar',
                        stack: 'total',
                        label: {
                            show: true,
                            formatter: function (params: any) {
                                if (params.value > 0) {
                                    return params.value;
                                } else {
                                    return ' ';
                                }
                            },
                        },
                        emphasis: { focus: 'series', },
                        data: ChartData.map((x: { type2: number; }) => x.type2),
                    },
                ],
            };
            Chart_MonthChart_Bar.setOption(Option_MonthChart_Bar, true);
            //柱状图点击
            Chart_MonthChart_Bar.off('click');
            Chart_MonthChart_Bar.on('click', function (recod: any) {
                fetchModalData(recod)
            });
            window.addEventListener('resize', () => { Chart_MonthChart_Bar.resize() });
        }
    }

    //饼图
    let Chart_RatioChart_Pie: any;
    let initPieChart = (result: any) => {
        let Element_RatioChart_Pie = document.getElementById('RatioChart');
        let Option_RatioChart_Pie: any;

        let seriesData: any = [];
        if (result && result.length > 0) {
            result.map((x: { Name: string; Num: number; childrenDtos: any; }) => {
                seriesData.push({
                    name: x.Name,
                    value: x.Num,
                    children: x.childrenDtos,
                });
            });
        }

        if (Element_RatioChart_Pie) {
            Chart_RatioChart_Pie = echarts.init(Element_RatioChart_Pie as HTMLDivElement);
            Option_RatioChart_Pie = {
                series: {
                    type: 'sunburst',
                    data: seriesData,
                    radius: [0, '95%'],
                    sort: null,
                    emphasis: {
                        focus: 'ancestor'
                    },
                    label: {
                        show: true,
                        formatter: '{b} : {c}',
                        fontSize: 12,
                    },
                    levels: [{}, {
                        r0: '15%',
                        r: '35%',
                        itemStyle: {
                            borderWidth: 2
                        },
                        label: {
                            rotate: 'tangential'
                        },
                    }, {
                        r0: '35%',
                        r: '70%',
                        label: {
                            align: 'right'
                        },
                    }, {
                        r0: '70%',
                        r: '72%',
                        label: {
                            position: 'outside',
                            padding: 3,
                            silent: false
                        },
                        itemStyle: {
                            borderWidth: 3
                        },
                    }]
                }
            };
            Chart_RatioChart_Pie.setOption(Option_RatioChart_Pie, true);
            window.addEventListener('resize', () => { Chart_RatioChart_Pie.resize() });
        }
    }

    //Modal 中的饼图
    let Chart_ModalRatioChart_Pie: any;
    let initModalChart = (result: any) => {
        let Element_ModalRatioChart_Pie = document.getElementById('ModalRatioChart');
        let Option_ModalRatioChart_Pie: any;

        let seriesData: any = [];
        if (result && result.length > 0) {
            result.map((x: { Name: string; Num: number }) => {
                seriesData.push({
                    //*饼图数据为0时不显示
                    value: x.Num == 0 ? null : x.Num,
                    name: x.Name,
                });
            });
        }
        //Modal 中的饼图
        if (Element_ModalRatioChart_Pie) {
            Chart_ModalRatioChart_Pie = echarts.init(Element_ModalRatioChart_Pie as HTMLDivElement);
            Option_ModalRatioChart_Pie = {
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
                grid: {
                    left: '5%',
                    right: '5%',
                    top: '10%',
                    bottom: '10%',
                    containLabel: true,
                },
                legend: {
                    bottom: 'bottom',
                    textStyle: {
                        color: 'black',
                        fontSize: 16,
                    },
                    data: result.map((x: { Name: string; }) => x.Name),
                },
                series: [
                    {
                        type: 'pie',
                        radius: '70%',
                        center: ['50%', '50%'],
                        data: seriesData,
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)',
                            }
                        },
                        label: {
                            show: true,
                            formatter: '{b} : {c} ({d}%)',
                            fontSize: 16,
                        },
                    },
                ]
            };
            Chart_ModalRatioChart_Pie.setOption(Option_ModalRatioChart_Pie, true);
            window.addEventListener('resize', () => { Chart_ModalRatioChart_Pie.resize() });
        }
    }

    //当用户切换 Switch 时更新 HRListOfType 和 checkedList3
    useEffect(() => {
        let HRListOfTypeList = getHRListVO();
        setHRListOfType(HRListOfTypeList);
        setCheckedList3(HRListOfTypeList.map((x: { ID: number; }) => x.ID));
        let ParamsInfo: object = {
            year: [year],
            month: [month],
            company: HRBranchList.map(x => x.branchName),
            type: HRListOfTypeList.map((x: { ID: number; }) => x.ID),
        };
        if (currentT == props.currentT) {
            fetchDataBar(ParamsInfo);
            fetchDataPie({ year: year, month: month });
        }
    }, [props.currentT]);

    /**
     * 单选
     * @param T
     * @param list 
     */
    const onChange = (T: Number, list: any) => {
        switch (T) {
            case 1:
                setCheckedList3(list);
                setIndeterminate3(!!list.length && list.length < HRListOfType.length);
                setCheckAll3(list.length === HRListOfType.length);
                break;
            default: return;
        }
    }

    /**
     * 全选
     * @param T 
     * @param e 
     */
    const onCheckAllChange = (T: Number, e: any) => {
        switch (T) {
            case 1:
                setCheckedList3(e.target.checked ? HRListOfType.map((x: { ID: number; }) => x.ID) : []);
                setIndeterminate3(false);
                setCheckAll3(e.target.checked);
                break;
            default: return;
        }
    }

    /**
     * 下拉选择
     * @param T:1.年份 2.月份
     * @param list 
     */
    const onSelect = (e: any, T: Number,) => {
        switch (T) {
            case 1:
                setYear(e);
                break;
            case 2:
                setMonth(e);
                break;
            default: return;
        }
    }

    /**
     * 关闭 Drawer
     */
    const onClose = () => {
        setDrawerVisible(false);
    }

    /**
     * 确定搜索条件
     */
    const onSearch = () => {
        let ParamsInfo: object = {
            year: [year],
            month: [month],
            company: HRBranchList.map(x => x.branchName),       //前台不用添加公司的搜索条件，默认传过去
            type: checkedList3,
        };
        fetchDataBar(ParamsInfo);
        fetchDataPie({ year: year, month: month });
        //关闭 Drawer
        setDrawerVisible(false);
    }

    return (
        <PageContainer>
            <Spin tip="数据正在加载中,请稍等..." spinning={loading}>
                <Card className='search-info' title='搜索条件内容'>
                    <Row gutter={24}>
                        <Col span={4}>
                            <Form.Item label="年份">
                                {year}年
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item label="月份">
                                {month}月
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={24}>
                            <Form.Item label="业务">
                                <Checkbox.Group value={checkedList3} onChange={(list) => onChange(1, list)}>
                                    <Row className={styles.searchAreaContent}>
                                        {
                                            HRListOfType && HRListOfType.length > 0 ? HRListOfType.map((x: { ID: number; Name: string; }) => {
                                                return <Checkbox key={x.ID} value={x.ID} disabled={true}>{x.Name}</Checkbox>
                                            }) : null
                                        }
                                    </Row>
                                </Checkbox.Group>
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>
                <Card>
                    <Row gutter={24}>
                        <Col span={12}>
                            <div id="MonthChart" style={{ width: '100%', height: 800 }}></div>
                        </Col>
                        <Col span={12}>
                            <div id="RatioChart" style={{ width: '100%', height: 800 }}></div>
                        </Col>
                    </Row>
                </Card>
            </Spin>

            <Modal
                title={ModalTitle}
                width={1100}
                visible={ModalVisible}
                onCancel={() => { setModalVisible(false) }}
                footer={false}
            >
                <div id="ModalRatioChart" style={{ width: '100%', height: 500 }}></div>
            </Modal>

            <Button type="primary" icon={<SearchOutlined />} className={styles.searchBtn} onClick={() => setDrawerVisible(true)} >搜索</Button>
            <Drawer
                placement={"right"}
                closable={false}
                onClose={onClose}
                visible={DrawerVisible}
                key={"right"}
                width={300}
                footer={
                    <Button type="primary" icon={<SearchOutlined />} style={{ width: "100%", fontSize: 16, height: 'unset' }} onClick={onSearch}>
                        确定
                    </Button>
                }
            >
                <div className={styles.searchArea}>
                    <Row className={styles.searchAreaLable}>
                        <Col span={12} className={styles.searchAreaTitle}>年份</Col>
                    </Row>
                    <Row className={styles.searchAreaContent}>
                        <Select
                            style={{ width: "100%" }}
                            defaultValue={year}
                            onChange={(e) => onSelect(e, 1)}
                        >
                            {
                                YearList && YearList.length > 0 ? YearList.map((x) => {
                                    return <Select.Option key={x.Key} value={x.Key}>{x.Value}</Select.Option>
                                }) : null
                            }
                        </Select>
                    </Row>
                </div>
                <div className={styles.searchArea}>
                    <Row className={styles.searchAreaLable}>
                        <Col span={12} className={styles.searchAreaTitle}>月份</Col>
                    </Row>
                    <Row className={styles.searchAreaContent}>
                        <Select
                            style={{ width: "100%" }}
                            defaultValue={month}
                            onChange={(e) => onSelect(e, 2)}
                        >
                            {
                                MonthListVO && MonthListVO.length > 0 ? MonthListVO.map((x) => {
                                    return <Select.Option key={x.Key} value={x.Key}>{x.Value}</Select.Option>
                                }) : null
                            }
                        </Select>
                    </Row>
                </div>
                <div className={styles.searchArea}>
                    <Row className={styles.searchAreaLable}>
                        <Col span={12} className={styles.searchAreaTitle}>业务</Col>
                        <Checkbox indeterminate={indeterminate3} onChange={(e) => onCheckAllChange(1, e)} checked={checkAll3}>
                            全选
                    </Checkbox>
                    </Row>
                    <Checkbox.Group value={checkedList3} onChange={(list) => onChange(1, list)}>
                        <Row className={styles.searchAreaContent}>
                            {
                                HRListOfType && HRListOfType.length > 0 ? HRListOfType.map((x: { ID: number; Name: string; }) => {
                                    return <Col span={24} key={x.ID} style={{ marginBottom: 5, }}><Checkbox value={x.ID}>{x.Name}</Checkbox></Col>
                                }) : null
                            }
                        </Row>
                    </Checkbox.Group>
                </div>
            </Drawer>

        </PageContainer >
    );
}

export default StaffNum;