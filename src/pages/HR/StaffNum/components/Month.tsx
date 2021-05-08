import React, { useState, useEffect, } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Spin, Row, Col, Button, Drawer, Checkbox, Select, } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import styles from '@/components/Search/index.less';
//引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入需要用到的图表
import 'echarts/lib/chart/bar';
// 引入提示框和标题组件
import 'echarts/lib/component/title';
import 'echarts/lib/component/tooltip';
import { HRBranchList, MonthList, } from '@/utils/baseData';
import { getHRListVO, } from '@/utils/auths';
import { getYearList, FilterZeroOfArraay, } from '@/utils/utils';
//调用API
import { getMonthChartData, } from '@/services/hr';

//父组件传过来的Props
type Props = {
    parentType: number,
    currentT: string,
}

//日期
const date = new Date()

const Month: React.FC<Props> = (props) => {
    const [loading, setloading] = useState(false);
    const [DrawerVisible, setDrawerVisible] = useState(false);
    const [currentT,] = useState(props.currentT);

    //数据集
    const [YearList,] = useState(() => {
        return getYearList();
    });
    const [MonthListVO,] = useState(MonthList);
    const [HRListOfType, setHRListOfType] = useState(getHRListVO().filter((x: { Type: number; }) => x.Type == props.parentType));

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

    //获取数据
    let fetchData = async (ParamsInfo: any, SelectType: number) => {
        setloading(true);
        const result = await getMonthChartData(ParamsInfo);
        let ChartData: any = [];
        if (!result) {
            return;
        }
        if (result) {
            if (result.length > 0) {
                if (SelectType > 0) {
                    ChartData = result.filter((x: { Type: number; }) => x.Type == SelectType);
                } else {
                    let keysArr = [...new Set(result.map((item: { BranchName: any; }) => item.BranchName))];
                    //全部：加总处理
                    keysArr.forEach(item => {
                        const arr = result.filter((x: { BranchName: string; }) => x.BranchName == item);
                        const sum = arr.reduce((a: any, b: { Num: number; }) => a + b.Num, 0);
                        ChartData.push({
                            BranchName: item,
                            Num: sum,
                        });
                    });
                }
            }
            //将值传给初始化图表的函数
            initChart(FilterZeroOfArraay(ChartData, 0, 'Num'));
            setloading(false);
        }
    }

    let Chart_MonthChart_Bar: any;
    let Chart_RatioChart_Pie: any;
    let initChart = (ChartData: any) => {
        let Element_MonthChart_Bar = document.getElementById('MonthChart');
        let Element_RatioChart_Pie = document.getElementById('RatioChart');
        let Option_MonthChart_Bar: any;
        let Option_RatioChart_Pie: any;

        //柱状图
        if (Element_MonthChart_Bar) {
            Chart_MonthChart_Bar = echarts.init(Element_MonthChart_Bar as HTMLDivElement);
            Option_MonthChart_Bar = {
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
                xAxis: {
                    type: 'value',
                    boundaryGap: [0, 0.01]
                },
                yAxis: {
                    type: 'category',
                    //反向排序
                    inverse: true,
                    data: ChartData.map((x: { BranchName: string; }) => x.BranchName),
                },
                series: [
                    {
                        //开启实时排序
                        realtimeSort: true,
                        type: 'bar',
                        name: '人数',
                        color: '#C23531',
                        label: {
                            show: true,
                            position: 'right',
                            color: 'black',
                            fontSize: 16,
                            valueAnimation: true,
                        },
                        data: ChartData.map((x: { Num: number; }) => x.Num),
                    },
                ],
                //动画特效
                animationDuration: 0,
                animationDurationUpdate: 500,
                animationEasing: 'linear',
                animationEasingUpdate: 'linear',
            };
            Chart_MonthChart_Bar.setOption(Option_MonthChart_Bar, true);
            window.addEventListener('resize', () => { Chart_MonthChart_Bar.resize() });
        }

        let seriesData: any = [];
        if (ChartData && ChartData.length > 0) {
            ChartData.map((x: { BranchName: string; Num: number }) => {
                seriesData.push({
                    //*饼图数据为0时不显示
                    value: x.Num == 0 ? null : x.Num,
                    name: x.BranchName,
                });
            });
        }
        //饼图
        if (Element_RatioChart_Pie) {
            Chart_RatioChart_Pie = echarts.init(Element_RatioChart_Pie as HTMLDivElement);
            Option_RatioChart_Pie = {
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
                    data: ChartData.map((x: { BranchName: string; }) => x.BranchName),
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
            Chart_RatioChart_Pie.setOption(Option_RatioChart_Pie, true);
            window.addEventListener('resize', () => { Chart_RatioChart_Pie.resize() });
        }
    }

    //当用户切换 Switch 时更新 HRListOfType 和 checkedList3
    useEffect(() => {
        let HRListOfTypeList = props.parentType > 0 ? getHRListVO().filter((x: { Type: number; }) => x.Type == props.parentType) : getHRListVO();
        setHRListOfType(HRListOfTypeList);
        setCheckedList3(HRListOfTypeList.map((x: { ID: number; }) => x.ID));
        let ParamsInfo: object = {
            year: [year],
            month: [month],
            company: HRBranchList.map(x => x.branchName),
            type: HRListOfTypeList.map((x: { ID: number; }) => x.ID),
        };
        if (currentT == props.currentT) {
            fetchData(ParamsInfo, props.parentType);
        }
    }, [props.parentType, props.currentT]);

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
        fetchData(ParamsInfo, props.parentType);
        //关闭 Drawer
        setDrawerVisible(false);
    }

    return (
        <PageContainer>
            <Spin tip="数据正在加载中,请稍等..." spinning={loading}>
                <Card>
                    <Row>
                        <Col span={12}>
                            <div id="MonthChart" style={{ width: '100%', height: 800 }}></div>
                        </Col>
                        <Col span={12}>
                            <div id="RatioChart" style={{ width: '100%', height: 800 }}></div>
                        </Col>
                    </Row>
                </Card>
            </Spin>

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

        </PageContainer>
    );
}

export default Month;