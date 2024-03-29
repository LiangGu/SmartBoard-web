import React, { useState, useEffect, } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Spin, Row, Col, Button, Drawer, Select, Form, } from 'antd';
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
import { getYearList, sumArray, } from '@/utils/utils';
//调用API
import { getChartDataOfBar, } from '@/services/hr';

//父组件传过来的Props
type Props = {
    parentType: number,
    currentT: string,
}

//日期
const date = new Date()

const Proportion: React.FC<Props> = (props) => {
    const [loading, setloading] = useState(false);
    const [DrawerVisible, setDrawerVisible] = useState(false);
    const [currentT,] = useState(props.currentT);
    const [totalPeople, setTotalPeople] = useState<any>('');

    //数据集
    const [YearList,] = useState(() => {
        return getYearList();
    });
    const [MonthListVO,] = useState(MonthList);

    /**
     *  单选
     * */
    // 年份
    const [year, setYear] = useState(date.getFullYear());

    // 月份
    const [month, setMonth] = useState(date.getMonth());

    //获取数据
    let fetchData = async (ParamsInfo: any, SelectType: number) => {
        setloading(true);
        const result = await getChartDataOfBar(ParamsInfo);
        let ProportionData: any = [];       //人力、职能数据
        let TotalProportionData: any = [];  //总数据
        if (!result) {
            return;
        }
        if (result) {
            if (result.length > 0) {
                //*后台返回的数据相同名称的会有不相邻的问题（注：后期手动添加过数据），所以需要在这边处理一下
                let correctData: any = result.sort((a: any, b: any) => b.BranchName.localeCompare(a.BranchName, 'zh'));
                ProportionData = correctData.filter((x: { Type: number; }) => x.Type == SelectType);
                // 全部：加总处理
                let keysArr = [...new Set(correctData.map((item: { BranchName: any; }) => item.BranchName))];
                keysArr.forEach(item => {
                    const arr = correctData.filter((x: { BranchName: string; }) => x.BranchName == item);
                    const sum = arr.reduce((a: any, b: { Num: number; }) => a + b.Num, 0)
                    TotalProportionData.push({
                        BranchName: item,
                        Num: sum,
                    });
                });
            }
            // 计算总人数
            let totalPeople = sumArray(Array.from(result, (x: { Num: number }) => x.Num));
            setTotalPeople(totalPeople);
            //将值传给初始化图表的函数
            initChart(ProportionData, TotalProportionData, SelectType);
            setloading(false);
        }
    }

    let Chart_Proportion_Bar: any;
    let initChart = (ProportionData: any, TotalProportionData: any, SelectType: number) => {
        let Element_Proportion_Bar = document.getElementById('ProportionChart');
        let Option_Proportion_Bar: any;
        if (Element_Proportion_Bar) {
            Chart_Proportion_Bar = echarts.init(Element_Proportion_Bar as HTMLDivElement);
            Option_Proportion_Bar = {
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
                    //* 要用 TotalProportionData 去 map 名称，因为有的公司没有职能或业务人员
                    data: TotalProportionData.map((x: { BranchName: string; }) => x.BranchName),
                },
                series: [
                    {
                        type: 'bar',
                        name: `${SelectType == 1 ? '职能人数' : SelectType == 2 ? '业务人数' : SelectType == 3 ? '管理层人数' : '全部人数'}`,
                        label: {
                            show: true,
                            position: 'right',
                            color: 'black',
                            fontSize: 16,
                            formatter: function (params: any) {
                                if (params.value > 0) { return params.value; } else { return ''; }
                            }
                        },
                        data: ProportionData.map((x: { Num: number; }) => x.Num),
                    },
                    {
                        type: 'bar',
                        name: `${SelectType > 0 ? '整体职工' : '全部人数'}`,
                        label: {
                            show: true,
                            position: 'right',
                            color: 'black',
                            fontSize: 16,
                            formatter: function (params: any) {
                                if (params.value > 0) { return params.value; } else { return ''; }
                            }
                        },
                        data: TotalProportionData.map((x: { Num: number; }) => x.Num),
                    },
                ]
            };
            Chart_Proportion_Bar.setOption(Option_Proportion_Bar, true);
            window.addEventListener('resize', () => { Chart_Proportion_Bar.resize() });
        }
    }

    useEffect(() => {
        let ParamsInfo: object = {
            year: [year],
            month: [month],
            company: HRBranchList.map(x => x.branchName),
        };
        if (currentT == props.currentT) {
            fetchData(ParamsInfo, props.parentType);
        }
    }, [props.parentType, props.currentT]);

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
        };
        fetchData(ParamsInfo, props.parentType);
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
                </Card>
                <Card>
                    <Row gutter={24}>
                        <div id="ProportionChart" style={{ width: '100%', height: 800 }}></div>
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
            </Drawer>

        </PageContainer>
    );
}

export default Proportion;