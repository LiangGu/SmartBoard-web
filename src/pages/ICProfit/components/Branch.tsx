import React, { useState, useEffect, } from 'react';
import { useModel } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Radio, Spin, Button, Drawer, Checkbox, Row, Col, Select,} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import styles from '@/components/Search/index.less';
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
import { getICProfitBranchData, } from '@/services/icprofit';
//调用公式方法
import {
    sortObjectArr,
    transIntOfArraay,
    getYearList,
} from '@/utils/utils';
import {
    getselectBranchID,
    getselectYear,
    getselectBusinessesLine,
} from '@/utils/auths';
//引入基础数据
import {
    MonthList,
    BusinessesLineList,
    BizType1List_MultiSelect,
    BizType2List,
    OceanTransportTypeList_MultiSelect,
} from '@/utils/baseData';

const ICProfitBranch: React.FC<{}> = () => {
    const { initialState, } = useModel('@@initialState');
    const [loading, setloading] = useState(false);
    const [type, setType] = useState('收入');
    const [result, setResult] = useState([]);
    const [DrawerVisible, setDrawerVisible] = useState(false);

    //数据集
    const [YearList,] = useState(() => {
        return getYearList();
    });

    /**
     *  单选
     * */
    // YearList                     :1
    const [year, setYear] = useState(() => {
        // 惰性赋值 any 类型,要不默认值不起作用
        let selectYear: any = getselectYear();
        return selectYear;
    });


    /**
     *  多选
     * */ 
    // MonthList                    :1
    const [checkedList1, setCheckedList1] = useState(() => {
        let searchInfoMonthList: any = initialState?.searchInfo?.MonthList;
        if (searchInfoMonthList) {
            return searchInfoMonthList;
        } else {
            return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        }
    });
    const [indeterminate1, setIndeterminate1] = useState(false);
    const [checkAll1, setCheckAll1] = useState(() => {
        return initialState?.searchInfo?.MonthList ? initialState?.searchInfo?.MonthList?.length == MonthList.length : true;
    });

    //BusinessesLineList            :2
    const [checkedList2, setCheckedList2] = useState(() => {
        let searchInfoBusinessesLineList: any = initialState?.searchInfo?.BusinessesLineList;
        if (searchInfoBusinessesLineList) {
            return searchInfoBusinessesLineList;
        } else {
            return [1, 2, 3, 4, 5];
        }
    });
    const [indeterminate2, setIndeterminate2] = useState(false);
    const [checkAll2, setCheckAll2] = useState(() => {
        return initialState?.searchInfo?.BusinessesLineList ? initialState?.searchInfo?.BusinessesLineList?.length == BusinessesLineList.length : true;
    });
    // BizType1List_MultiSelect      :3
    const [checkedList3, setCheckedList3] = useState(() => {
        let searchInfoBizType1List_MultiSelect: any = initialState?.searchInfo?.BizType1List_MultiSelect;
        if (searchInfoBizType1List_MultiSelect) {
            return searchInfoBizType1List_MultiSelect;
        } else {
            return [1, 2, 3, 4, 5, 6, 10, 11, 12, 13, 14];
        }
    });
    const [indeterminate3, setIndeterminate3] = useState(false);
    const [checkAll3, setCheckAll3] = useState(() => {
        return initialState?.searchInfo?.BizType1List_MultiSelect ? initialState?.searchInfo?.BizType1List_MultiSelect?.length == BizType1List_MultiSelect.length : true;
    });
    // BizType2List                 :4
    const [checkedList4, setCheckedList4] = useState(() => {
        let searchInfoBizType2List: any = initialState?.searchInfo?.BizType2List;
        if (searchInfoBizType2List) {
            return searchInfoBizType2List;
        } else {
            return [1, 2, 3, 4, 5, 6];
        }
    });
    const [indeterminate4, setIndeterminate4] = useState(false);
    const [checkAll4, setCheckAll4] = useState(() => {
        return initialState?.searchInfo?.BizType2List ? initialState?.searchInfo?.BizType2List?.length == BizType2List.length : true;
    });
    // OceanTransportTypeList_MultiSelect      :5
    const [checkedList5, setCheckedList5] = useState(() => {
        let searchInfoOceanTransportTypeList_MultiSelect: any = initialState?.searchInfo?.OceanTransportTypeList_MultiSelect;
        if (searchInfoOceanTransportTypeList_MultiSelect) {
            return searchInfoOceanTransportTypeList_MultiSelect;
        } else {
            return [1, 2, 3, 6, 7];
        }
    });
    const [indeterminate5, setIndeterminate5] = useState(false);
    const [checkAll5, setCheckAll5] = useState(() => {
        return initialState?.searchInfo?.OceanTransportTypeList_MultiSelect ? initialState?.searchInfo?.OceanTransportTypeList_MultiSelect?.length == OceanTransportTypeList_MultiSelect.length : true;
    });

    //获取数据
    let fetchData = async (ParamsInfo: any, T: string) => {
        setloading(true);
        const result = await getICProfitBranchData(ParamsInfo);
        if (!result || getselectBranchID() == '') {
            return;
        }
        if (result) {
            if (result.length > 0) {
                setResult(result);
            }
            //将值传给初始化图表的函数
            initChart(result, T);
            setloading(false);
        }
    }

    //初始化图表
    let myChart: any;
    let initChart = (result: any, type: string) => {
        let element = document.getElementById('ICProfitBranch');
        if (myChart != null && myChart != "" && myChart != undefined) {
            myChart.dispose();
        }
        let option: any;

        // 根据 type 排序
        let SortICProfitList: any = [];
        let TotalARList: any = [];
        let TotalAPList: any = [];
        let ProfitList: any = [];
        let yAxisData: any = [];

        if (type == '收入') {
            SortICProfitList = result.sort(sortObjectArr('AmountAR', 1));
        } else {
            SortICProfitList = result.sort(sortObjectArr('Profit', 1));
        }
        if (SortICProfitList && SortICProfitList.length > 0) {
            SortICProfitList.map((x: { AmountAR: any; AmountAP: any; Profit: any; BranchName: any }) => {
                TotalARList.push((x.AmountAR / 10000).toFixed(2));
                // 支出转换成负数
                TotalAPList.push((x.AmountAP * -1 / 10000).toFixed(2));
                ProfitList.push((x.Profit / 10000).toFixed(2));
                yAxisData.push(`${x.BranchName}`);
            });
        }

        if (element) {
            myChart = echarts.init(element as HTMLDivElement);
            option = {
                title: {
                    text: '公司收支毛利',
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
                    data: ['收入', '支出', '毛利'],
                    selected: {
                        '支出': false,
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
                        name: '单位: CNY(万)',
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
                    }
                ],
                series: [
                    {
                        name: '毛利',
                        type: 'bar',
                        color: '#FF7C00',
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
                        data: transIntOfArraay(ProfitList),
                    },
                    {
                        name: '收入',
                        type: 'bar',
                        stack: '总量',
                        color: 'green',
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
                        data: transIntOfArraay(TotalARList),
                    },
                    {
                        name: '支出',
                        type: 'bar',
                        stack: '总量',
                        color: '#C23531',
                        label: {
                            show: true,
                            position: 'left',
                            color: 'black',
                            fontSize: 16,
                        },
                        data: transIntOfArraay(TotalAPList),
                    }
                ]
            };
            myChart.setOption(option, true);
            myChart.resize({ width: window.innerWidth - 72 });
            window.addEventListener('resize', () => { myChart.resize({ width: window.innerWidth - 72 }) });
        }
    };

    /**
     * 第2个参数传 [initialState] 相当于 componentDidUpdate 钩子
     */
    useEffect(() => {
        let ParamsInfo: object = {
            BranchID: getselectBranchID(),
            Year: getselectYear(),
            Months: initialState?.searchInfo?.MonthList || [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            BizLines: initialState?.searchInfo?.BusinessesLineList || [1, 2, 3, 4, 5],
            TransTypes: initialState?.searchInfo?.BizType1List_MultiSelect || [1, 2, 3, 4, 5, 6, 10, 11, 12, 13, 14],
            TradeTypes: initialState?.searchInfo?.BizType2List || [1, 2, 3, 4, 5, 6],
            CargoTypes: initialState?.searchInfo?.OceanTransportTypeList_MultiSelect || [1, 2, 3, 6, 7],
        };
        if (getselectBranchID() !== '') {
            fetchData(ParamsInfo, type);
        }
    }, []);

    /**
     * 点击切换统计图表类型
     */
    const onChangeType = (e: any) => {
        setType(e.target.value);
        initChart(result, e.target.value);
    }

    /**
     * 下拉选择
     * @param T:1.年份 2.业务线 3.运输类型 4.货物类型
     * @param list 
     */
    const onSelect = (e: any, T: Number,) => {
        switch (T) {
            case 1:
                setYear(e);
                break;
            default: return;
        }
    }

    /**
     * 单选
     * @param T
     * @param list 
     */
    const onChange = (T: Number, list: any) => {
        switch (T) {
            case 1:
                setCheckedList1(list);
                setIndeterminate1(!!list.length && list.length < MonthList.length);
                setCheckAll1(list.length === MonthList.length);
                break;
            case 2:
                setCheckedList2(list);
                setIndeterminate2(!!list.length && list.length < BusinessesLineList.length);
                setCheckAll2(list.length === BusinessesLineList.length);
                break;
            case 3:
                setCheckedList3(list);
                setIndeterminate3(!!list.length && list.length < BizType1List_MultiSelect.length);
                setCheckAll3(list.length === BizType1List_MultiSelect.length);
                break;
            case 4:
                setCheckedList4(list);
                setIndeterminate4(!!list.length && list.length < BizType2List.length);
                setCheckAll4(list.length === BizType2List.length);
                break;
            case 5:
                setCheckedList5(list);
                setIndeterminate5(!!list.length && list.length < OceanTransportTypeList_MultiSelect.length);
                setCheckAll5(list.length === OceanTransportTypeList_MultiSelect.length);
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
                setCheckedList1(e.target.checked ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] : []);
                setIndeterminate1(false);
                setCheckAll1(e.target.checked);
                break;
            case 2:
                setCheckedList2(e.target.checked ? [1, 2, 3, 4, 5] : []);
                setIndeterminate2(false);
                setCheckAll2(e.target.checked);
                break;
            case 3:
                setCheckedList3(e.target.checked ? [1, 2, 3, 4, 5, 6, 10, 11, 12, 13, 14] : []);
                setIndeterminate3(false);
                setCheckAll3(e.target.checked);
                break;
            case 4:
                setCheckedList4(e.target.checked ? [1, 2, 3, 4, 5, 6] : []);
                setIndeterminate4(false);
                setCheckAll4(e.target.checked);
                break;
            case 5:
                setCheckedList5(e.target.checked ? [1, 2, 3, 6, 7] : []);
                setIndeterminate5(false);
                setCheckAll5(e.target.checked);
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
            BranchID: getselectBranchID(),
            Year: year,
            Months: checkedList1,
            BizLines: checkedList2,
            TransTypes: checkedList3,
            TradeTypes: checkedList4,
            CargoTypes: checkedList5,
        };
        if (getselectBranchID() !== '') {
            fetchData(ParamsInfo, type);
        }
        //关闭 Drawer
        setDrawerVisible(false);
    }

    return (
        <PageContainer>
            <Spin tip="数据正在加载中,请稍等..." spinning={loading}>
                <Card
                    extra={
                        <>
                            <Radio.Group defaultValue={type} buttonStyle="solid" onChange={onChangeType}>
                                <Radio.Button value="收入">收入</Radio.Button>
                                <Radio.Button value="毛利">毛利</Radio.Button>
                            </Radio.Group>
                        </>
                    }
                >
                    <div id="ICProfitBranch" style={{ width: '100%', height: 800 }}></div>
                </Card>
            </Spin>

            <Button type="primary" icon={<SearchOutlined />} className={styles.searchBtn} onClick={() => setDrawerVisible(true)} />
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
                            defaultValue={parseInt(year)}
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
                        <Checkbox indeterminate={indeterminate1} onChange={(e) => onCheckAllChange(1, e)} checked={checkAll1}>
                            全选
                    </Checkbox>
                    </Row>
                    <Checkbox.Group value={checkedList1} onChange={(list) => onChange(1, list)}>
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
                        <Col span={12} className={styles.searchAreaTitle}>业务线</Col>
                        <Checkbox indeterminate={indeterminate2} onChange={(e) => onCheckAllChange(2, e)} checked={checkAll2}>
                            全选
                    </Checkbox>
                    </Row>
                    <Checkbox.Group value={checkedList2} onChange={(list) => onChange(2, list)}>
                        <Row className={styles.searchAreaContent}>
                            {
                                BusinessesLineList && BusinessesLineList.length > 0 ? BusinessesLineList.map(x => {
                                    return <Col span={12} key={x.Key} style={{ marginBottom: 5, }}><Checkbox value={x.Key}>{x.Value}</Checkbox></Col>
                                }) : null
                            }
                        </Row>
                    </Checkbox.Group>
                </div>
                <div className={styles.searchArea}>
                    <Row className={styles.searchAreaLable}>
                        <Col span={12} className={styles.searchAreaTitle}>运输类型</Col>
                        <Checkbox indeterminate={indeterminate3} onChange={(e) => onCheckAllChange(3, e)} checked={checkAll3}>
                            全选
                    </Checkbox>
                    </Row>
                    <Checkbox.Group value={checkedList3} onChange={(list) => onChange(3, list)}>
                        <Row className={styles.searchAreaContent}>
                            {
                                BizType1List_MultiSelect && BizType1List_MultiSelect.length > 0 ? BizType1List_MultiSelect.map(x => {
                                    return <Col span={12} key={x.Key} style={{ marginBottom: 5, }}><Checkbox value={x.Key}>{x.Value}</Checkbox></Col>
                                }) : null
                            }
                        </Row>
                    </Checkbox.Group>
                </div>
                <div className={styles.searchArea}>
                    <Row className={styles.searchAreaLable}>
                        <Col span={12} className={styles.searchAreaTitle}>贸易类型</Col>
                        <Checkbox indeterminate={indeterminate4} onChange={(e) => onCheckAllChange(4, e)} checked={checkAll4}>
                            全选
                    </Checkbox>
                    </Row>
                    <Checkbox.Group value={checkedList4} onChange={(list) => onChange(4, list)}>
                        <Row className={styles.searchAreaContent}>
                            {
                                BizType2List && BizType2List.length > 0 ? BizType2List.map(x => {
                                    return <Col span={12} key={x.Key} style={{ marginBottom: 5, }}><Checkbox value={x.Key}>{x.Value}</Checkbox></Col>
                                }) : null
                            }
                        </Row>
                    </Checkbox.Group>
                </div>
                <div className={styles.searchArea}>
                    <Row className={styles.searchAreaLable}>
                        <Col span={12} className={styles.searchAreaTitle}>货物类型</Col>
                        <Checkbox indeterminate={indeterminate5} onChange={(e) => onCheckAllChange(5, e)} checked={checkAll5}>
                            全选
                    </Checkbox>
                    </Row>
                    <Checkbox.Group value={checkedList5} onChange={(list) => onChange(5, list)}>
                        <Row className={styles.searchAreaContent}>
                            {
                                OceanTransportTypeList_MultiSelect && OceanTransportTypeList_MultiSelect.length > 0 ? OceanTransportTypeList_MultiSelect.map(x => {
                                    return <Col span={12} key={x.Key} style={{ marginBottom: 5, }}><Checkbox value={x.Key}>{x.Value}</Checkbox></Col>
                                }) : null
                            }
                        </Row>
                    </Checkbox.Group>
                </div>
            </Drawer>

        </PageContainer>
    )
};

export default ICProfitBranch;