import React, { useState, useEffect, } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Spin, Row, Col, Button, Drawer, Checkbox, } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import styles from '@/components/Search/index.less';
//引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入需要用到的图表
import 'echarts/lib/chart/pie';
// 引入提示框和标题组件
import 'echarts/lib/component/title';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import { HRBranchList, MonthList, } from '@/utils/baseData';
import { getHRListVO, } from '@/utils/auths';
import { getYearList, } from '@/utils/utils';
//调用API
import { getMonthChartData, } from '@/services/hr';


const Ratio: React.FC<{}> = () => {
    const [loading, setloading] = useState(false);
    const [DrawerVisible, setDrawerVisible] = useState(false);

    //数据集
    const [HRListOfType,] = useState(() => {
        return getHRListVO().filter((x: { Type: number; }) => x.Type == 2);
    });

    /**
     *  多选
     * */
    // 年份                    :1
    const [checkedList1, setCheckedList1] = useState(() => {
        return getYearList().map(x => x.Key);
    });
    const [indeterminate1, setIndeterminate1] = useState(false);
    const [checkAll1, setCheckAll1] = useState(true);

    // 月份                    :2
    const [checkedList2, setCheckedList2] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    const [indeterminate2, setIndeterminate2] = useState(false);
    const [checkAll2, setCheckAll2] = useState(true);

    // 业务线                   :3
    const [checkedList3, setCheckedList3] = useState(() => {
        return HRListOfType.map((x: { ID: number; }) => x.ID);
    });
    const [indeterminate3, setIndeterminate3] = useState(false);
    const [checkAll3, setCheckAll3] = useState(true);

    //获取数据
    let fetchData = async (ParamsInfo: any,) => {
        setloading(true);
        const result = await getMonthChartData(ParamsInfo);
        let RatioChartData: any = [];
        if (!result) {
            return;
        }
        if (result) {
            if (result.length > 0) {
                RatioChartData = result.filter((x: { Type: number; }) => x.Type == 2);
            }
            //将值传给初始化图表的函数
            initChart(RatioChartData);
            setloading(false);
        }
    }

    let Chart_RatioChart_Pie: any;
    let initChart = (RatioChartData: any) => {
        let Element_RatioChart_Pie = document.getElementById('RatioChart');
        let Option_RatioChart_Pie: any;
        let seriesData: any = [];
        if (RatioChartData && RatioChartData.length > 0) {
            RatioChartData.map((x: { BranchName: string; Num: number }) => {
                seriesData.push({
                    value: x.Num,
                    name: x.BranchName,
                });
            });
        }
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
                    right: 'right',
                    textStyle: {
                        color: 'black',
                        fontSize: 16,
                    },
                    data: RatioChartData.map((x: { BranchName: string; }) => x.BranchName),
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
                            fontSize: 16,
                        },
                    },
                ]
            };
            Chart_RatioChart_Pie.setOption(Option_RatioChart_Pie, true);
            window.addEventListener('resize', () => { Chart_RatioChart_Pie.resize() });
        }
    }

    /**
     * 第2个参数传 [] 相当于 componentDidUpdate 钩子
     */
    useEffect(() => {
        let ParamsInfo: object = {
            year: getYearList().map(x => x.Key),
            month: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            company: HRBranchList.map(x => x.branchName),
            type: HRListOfType.map((x: { ID: number; }) => x.ID),
        };
        fetchData(ParamsInfo);
    }, []);

    /**
     * 单选
     * @param T
     * @param list 
     */
    const onChange = (T: Number, list: any) => {
        switch (T) {
            case 1:
                setCheckedList1(list);
                setIndeterminate1(!!list.length && list.length < getYearList().length);
                setCheckAll1(list.length === getYearList().length);
                break;
            case 2:
                setCheckedList2(list);
                setIndeterminate2(!!list.length && list.length < MonthList.length);
                setCheckAll2(list.length === MonthList.length);
                break;
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
            case 1:
                setCheckedList1(e.target.checked ? getYearList().map(x => x.Key) : []);
                setIndeterminate1(false);
                setCheckAll1(e.target.checked);
                break;
            case 2:
                setCheckedList2(e.target.checked ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] : []);
                setIndeterminate2(false);
                setCheckAll2(e.target.checked);
                break;
            case 3:
                setCheckedList3(e.target.checked ? HRListOfType.map((y: { Name: any; }) => y.Name) : []);
                setIndeterminate3(false);
                setCheckAll3(e.target.checked);
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
            year: checkedList1,
            month: checkedList2,
            company: HRBranchList.map(x => x.branchName),       //前台不用添加公司的搜索条件，默认传过去
            type: checkedList3,
        };
        fetchData(ParamsInfo);
        //关闭 Drawer
        setDrawerVisible(false);
    }

    return (
        <PageContainer>
            <Spin tip="数据正在加载中,请稍等..." spinning={loading}>
                <Card>
                    <div id="RatioChart" style={{ width: '100%', height: 800 }}></div>
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
                        <Checkbox indeterminate={indeterminate1} onChange={(e) => onCheckAllChange(1, e)} checked={checkAll1}>
                            全选
                    </Checkbox>
                    </Row>
                    <Checkbox.Group value={checkedList1} onChange={(list) => onChange(1, list)}>
                        <Row className={styles.searchAreaContent}>
                            {
                                getYearList() && getYearList().length > 0 ? getYearList().map(x => {
                                    return <Col span={8} key={x.Key} style={{ marginBottom: 5, }}><Checkbox value={x.Key}>{x.Value}</Checkbox></Col>
                                }) : null
                            }
                        </Row>
                    </Checkbox.Group>
                </div>
                <div className={styles.searchArea}>
                    <Row className={styles.searchAreaLable}>
                        <Col span={12} className={styles.searchAreaTitle}>月份</Col>
                        <Checkbox indeterminate={indeterminate2} onChange={(e) => onCheckAllChange(2, e)} checked={checkAll2}>
                            全选
                    </Checkbox>
                    </Row>
                    <Checkbox.Group value={checkedList2} onChange={(list) => onChange(2, list)}>
                        <Row className={styles.searchAreaContent}>
                            {
                                MonthList && MonthList.length > 0 ? MonthList.map(x => {
                                    return <Col span={8} key={x.Key} style={{ marginBottom: 5, }}><Checkbox value={x.Key}>{x.Value}</Checkbox></Col>
                                }) : null
                            }
                        </Row>
                    </Checkbox.Group>
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

export default Ratio;