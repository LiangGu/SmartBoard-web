import React, { useState, useEffect, } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Spin, Row, Col, Button, Drawer, Select, Checkbox, Form, } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import styles from '@/components/Search/index.less';
//引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入需要用到的图表
import 'echarts/lib/chart/bar';
// 引入提示框和标题组件
import 'echarts/lib/component/title';
import 'echarts/lib/component/tooltip';
import { MonthList, } from '@/utils/baseData';
import { getHRListVO, } from '@/utils/auths';
import { getYearList, sumArray, reverseObjArray, } from '@/utils/utils';
//调用API
import { getMonthChartDataOfYearOverYear, } from '@/services/hr';

//父组件传过来的Props
type Props = {
    parentType: number,
    currentT: string,
}

//日期
const date = new Date();

const YoYAndMoM: React.FC<Props> = (props) => {
    const [loading, setloading] = useState(false);
    const [DrawerVisible, setDrawerVisible] = useState(false);
    const [currentT,] = useState(props.currentT);
    const [totalPeople, setTotalPeople] = useState<any>('');

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
    // 业务线                   :3
    const [checkedList3, setCheckedList3] = useState(HRListOfType.map((x: { ID: number; }) => x.ID));
    const [indeterminate3, setIndeterminate3] = useState(false);
    const [checkAll3, setCheckAll3] = useState(true);

    //获取数据(每月人数环比)
    let fetchDataMonthOverMonth = async (ParamsInfo: any, SelectType: number) => {
        setloading(true);
        const result = await getMonthChartDataOfYearOverYear(ParamsInfo);
        if (!result) {
            return;
        }
        // 翻转对象数组（后台返回的数据长度不同，比如新添加了公司）
        if (result) {
            let reverseResult = {
                hrDivisionDtos: reverseObjArray(result.hrDivisionDtos,),
                hrDivisionDtosOYO: reverseObjArray(result.hrDivisionDtosOYO,),
            }
            //将值传给初始化图表的函数
            initChart_MonthOverMonth(reverseResult);
            setloading(false);
        }
    }

    //获取数据(每月人数同比)
    let fetchDataYearOverYear = async (ParamsInfo: any, SelectType: number) => {
        setloading(true);
        const result = await getMonthChartDataOfYearOverYear(ParamsInfo);
        if (!result) {
            return;
        }
        // 计算总人数
        let totalPeople = sumArray(Array.from(result.hrDivisionDtos, (x: { Num: number }) => x.Num));
        setTotalPeople(totalPeople);
        if (result) {
            //将值传给初始化图表的函数
            initChart_YearOverYear(result);
            setloading(false);
        }
    }

    //每月人数环比
    let Chart_MonthOverMonthr_Bar: any;
    let initChart_MonthOverMonth = (result: any) => {
        let Element_MonthOverMonthr_Bar = document.getElementById('MonthOverMonthChart');
        let Option_MonthOverMonthr_Bar: any;
        if (Element_MonthOverMonthr_Bar) {
            Chart_MonthOverMonthr_Bar = echarts.init(Element_MonthOverMonthr_Bar as HTMLDivElement);
            Option_MonthOverMonthr_Bar = {
                title: { subtext: '每月人数环比', },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { type: 'shadow', },
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
                    axisLabel: {
                        show: true,
                        color: 'black',
                        fontSize: 16,
                    },
                    boundaryGap: [0, 0.01],
                },
                legend: {
                    bottom: 'bottom',
                    textStyle: {
                        color: 'black',
                        fontSize: 16,
                    },
                },
                yAxis: {
                    type: 'category',
                    name: `单位: 人`,
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
                    data: result.hrDivisionDtos.map((x: { BranchName: string; }) => x.BranchName),
                },
                series: [
                    {
                        type: 'bar',
                        name: `${result.hrDivisionDtos.length > 0 ? `${result.hrDivisionDtos[0].Year}年 - ${result.hrDivisionDtos[0].Month}月` : `环比无数据，请添加数据!`} `,
                        label: {
                            show: true,
                            position: 'right',
                            color: 'black',
                            fontSize: 16,
                            formatter: function (params: any) {
                                if (params.value > 0) { return params.value; } else { return ''; }
                            }
                        },
                        data: result.hrDivisionDtos.map((x: { Num: number; }) => x.Num),
                    },
                    {
                        type: 'bar',
                        name: `${result.hrDivisionDtosOYO.length > 0 ? `${result.hrDivisionDtosOYO[0].Year}年 - ${result.hrDivisionDtosOYO[0].Month}月` : `环比无数据，请添加数据!`} `,
                        label: {
                            show: true,
                            position: 'right',
                            color: 'black',
                            fontSize: 16,
                            formatter: function (params: any) {
                                if (params.value > 0) { return params.value; } else { return ''; }
                            }
                        },
                        data: result.hrDivisionDtosOYO.map((x: { Num: number; }) => x.Num),
                    },
                ]
            };
            Chart_MonthOverMonthr_Bar.setOption(Option_MonthOverMonthr_Bar, true);
            window.addEventListener('resize', () => { Chart_MonthOverMonthr_Bar.resize() });
        }
    }

    //每月人数同比
    let Chart_YearOverYear_Bar: any;
    let initChart_YearOverYear = (result: any) => {
        let Element_YearOverYear_Bar = document.getElementById('YearOverYearChart');
        let Option_YearOverYear_Bar: any;
        if (Element_YearOverYear_Bar) {
            Chart_YearOverYear_Bar = echarts.init(Element_YearOverYear_Bar as HTMLDivElement);
            Option_YearOverYear_Bar = {
                title: { subtext: '每月人数同比', },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { type: 'shadow', },
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
                    axisLabel: {
                        show: true,
                        color: 'black',
                        fontSize: 16,
                    },
                    boundaryGap: [0, 0.01],
                },
                legend: {
                    bottom: 'bottom',
                    textStyle: {
                        color: 'black',
                        fontSize: 16,
                    },
                },
                yAxis: {
                    type: 'category',
                    name: `单位: 人`,
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
                    data: result.hrDivisionDtos.map((x: { BranchName: string; }) => x.BranchName),
                },
                series: [
                    {
                        type: 'bar',
                        name: `${result.hrDivisionDtos.length > 0 ? `${result.hrDivisionDtos[0].Year}年 - ${result.hrDivisionDtos[0].Month}月` : `同比无数据，请添加数据!`} `,
                        label: {
                            show: true,
                            position: 'right',
                            color: 'black',
                            fontSize: 16,
                            formatter: function (params: any) {
                                if (params.value > 0) { return params.value; } else { return ''; }
                            }
                        },
                        data: result.hrDivisionDtos.map((x: { Num: number; }) => x.Num),
                    },
                    {
                        type: 'bar',
                        name: `${result.hrDivisionDtosOYO.length > 0 ? `${result.hrDivisionDtosOYO[0].Year}年 - ${result.hrDivisionDtosOYO[0].Month}月` : `同比无数据，请添加数据!`} `,
                        label: {
                            show: true,
                            position: 'right',
                            color: 'black',
                            fontSize: 16,
                            formatter: function (params: any) {
                                if (params.value > 0) { return params.value; } else { return ''; }
                            }
                        },
                        data: result.hrDivisionDtosOYO.map((x: { Num: number; }) => x.Num),
                    },
                ]
            };
            Chart_YearOverYear_Bar.setOption(Option_YearOverYear_Bar, true);
            window.addEventListener('resize', () => { Chart_YearOverYear_Bar.resize() });
        }
    }

    //当用户切换 Switch 时更新 HRListOfType 和 checkedList3
    useEffect(() => {
        let HRListOfTypeList = props.parentType > 0 ? getHRListVO().filter((x: { Type: number; }) => x.Type == props.parentType) : getHRListVO();
        setHRListOfType(HRListOfTypeList);
        setCheckedList3(HRListOfTypeList.map((x: { ID: number; }) => x.ID));
        let ParamsInfo: object = {
            year: year,
            month: month,
            type: HRListOfTypeList.map((x: { ID: number; }) => x.ID),
            isLine: props.parentType,
            chainRatio: true,
        };
        if (currentT == props.currentT) {
            fetchDataMonthOverMonth(Object.assign({}, ParamsInfo, { chainRatio: true, }), props.parentType);
            fetchDataYearOverYear(Object.assign({}, ParamsInfo, { chainRatio: false, }), props.parentType);
        }
    }, [props.parentType, props.currentT]);

    /**
     * 单选
     * @param T
     * @param list 
     */
    const onChange = (T: Number, list: any) => {
        switch (T) {
            case 3:
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
            case 3:
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
            year: year,
            month: month,
            type: checkedList3,
            isLine: props.parentType,
        };
        fetchDataMonthOverMonth(Object.assign({}, ParamsInfo, { chainRatio: true, }), props.parentType);
        fetchDataYearOverYear(Object.assign({}, ParamsInfo, { chainRatio: false, }), props.parentType);
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
                        {/* 添加一个总人数的显示 */}
                        <Col span={4}>
                            <Form.Item label="总人数" style={{ color: "#C23531", }}>
                                {totalPeople}
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
                            <div id="MonthOverMonthChart" style={{ width: '100%', height: 800 }}></div>
                        </Col>
                        <Col span={12}>
                            <div id="YearOverYearChart" style={{ width: '100%', height: 800 }}></div>
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
                        <Checkbox indeterminate={indeterminate3} onChange={(e) => onCheckAllChange(3, e)} checked={checkAll3}>
                            全选
                        </Checkbox>
                    </Row>
                    <Checkbox.Group value={checkedList3} onChange={(list) => onChange(3, list)}>
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

export default YoYAndMoM;