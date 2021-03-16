import React, { useState, useEffect, } from 'react';
import { useModel } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Spin, Button, Drawer, Checkbox, Row, Col, Select,} from 'antd';
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
import { getICProfitMonthData, } from '@/services/icprofit';
//调用公式方法
import {
    sortObjectArr,
    transIntOfArraay,
    getYearList,
} from '@/utils/utils';
import {
    getBranchList,
    getselectBranchID,
    getselectYear,
} from '@/utils/auths';
//引入基础数据
import {
    BusinessesLineList,
    BizType1List_MultiSelect,
    BizType2List,
    OceanTransportTypeList_MultiSelect,
} from '@/utils/baseData';

const ICProfitMonth: React.FC<{}> = () => {
    const { initialState, } = useModel('@@initialState');
    const [loading, setloading] = useState(false);
    const [DrawerVisible, setDrawerVisible] = useState(false);

    //数据集
    const [YearList,] = useState(() => {
        return getYearList();
    });
    const [BranchList,] = useState(() => {
        return getBranchList();
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

    // BranchList
    const [branch, setBranch] = useState(() => {
        // 惰性赋值 any 类型,要不默认值不起作用
        let selectBranch: any = getselectBranchID();
        return selectBranch;
    });

    /**
     *  多选
     * */ 
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
    let fetchData = async (ParamsInfo: any) => {
        setloading(true);
        const result = await getICProfitMonthData(ParamsInfo);
        if (!result) {
            return;
        }
        if (result) {
            let SortICProfitList: any = [];
            let TotalARList: any = [];
            let TotalAPList: any = [];
            let ProfitList: any = [];
            if (result.length > 0) {
                // 根据 FinanceMonth 排序
                SortICProfitList = result.sort(sortObjectArr('Month', 1));
                if (SortICProfitList && SortICProfitList.length > 0) {
                    SortICProfitList.map((x: { AmountAR: any; AmountAP: any; Profit: any }) => {
                        TotalARList.push((x.AmountAR / 10000).toFixed(2));
                        TotalAPList.push((x.AmountAP / 10000).toFixed(2));
                        ProfitList.push((x.Profit / 10000).toFixed(2));
                    });
                }
            }
            //将值传给初始化图表的函数
            initChart(TotalARList, TotalAPList, ProfitList);
            setloading(false);
        }
    }

    //初始化图表
    let myChart: any;
    let initChart = (TotalARList: [], TotalAPList: [], ProfitList: []) => {
        let element = document.getElementById('ICProfitMonth');
        if (myChart != null && myChart != "" && myChart != undefined) {
            myChart.dispose();
        }
        let option: any;
        if (element) {
            myChart = echarts.init(element as HTMLDivElement);
            option = {
                title: {
                    text: '月度收支毛利',
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
                },
                xAxis: {
                    axisLabel: {
                        show: true,
                        color: 'black',
                        fontSize: 16,
                    },
                    data: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
                },
                yAxis: {
                    name: '单位: CNY(万)',
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
                        name: '收入',
                        type: 'bar',
                        color: 'green',
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
                        data: transIntOfArraay(TotalARList),
                    },
                    {
                        type: 'bar',
                        name: '支出',
                        color: '#C23531',
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
                        data: transIntOfArraay(TotalAPList),
                    },
                    {
                        type: 'line',
                        name: '毛利',
                        color: '#FF7C00',
                        data: transIntOfArraay(ProfitList),
                    },
                ]
            };
            myChart.setOption(option, true);
            myChart.resize({ width: window.innerWidth - 72 });
            window.addEventListener('resize', () => { myChart.resize({ width: window.innerWidth - 72 }) });
        }
    };

    /**
     * 第2个参数传 [] 相当于 componentDidUpdate 钩子
     */
    useEffect(() => {
        let ParamsInfo: object = {
            BranchID: getselectBranchID(),
            Year: getselectYear(),
            BizLines: initialState?.searchInfo?.BusinessesLineList || [1, 2, 3, 4, 5],
            TransTypes: initialState?.searchInfo?.BizType1List_MultiSelect || [1, 2, 3, 4, 5, 6, 10, 11, 12, 13, 14],
            TradeTypes: initialState?.searchInfo?.BizType2List || [1, 2, 3, 4, 5, 6],
            CargoTypes: initialState?.searchInfo?.OceanTransportTypeList_MultiSelect || [1, 2, 3, 6, 7],
        };
        fetchData(ParamsInfo);
    }, []);

    /**
     * 下拉选择
     * @param T:1.年份 2.业务线 3.运输类型 4.货物类型 5.公司
     * @param list 
     */
    const onSelect = (e: any, T: Number,) => {
        switch (T) {
            case 1:
                setYear(e);
                break;
            case 5:
                setBranch(e);
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
            BranchID: branch,
            Year: year,
            BizLines: checkedList2,
            TransTypes: checkedList3,
            TradeTypes: checkedList4,
            CargoTypes: checkedList5,
        };
        fetchData(ParamsInfo);
        //关闭 Drawer
        setDrawerVisible(false);
    }

    return (
        <PageContainer>
            <Spin tip="数据正在加载中,请稍等..." spinning={loading}>
                <Card>
                    <div id="ICProfitMonth" style={{ width: '100%', height: 800 }}></div>
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
                        <Col span={12} className={styles.searchAreaTitle}>公司</Col>
                    </Row>
                    <Row className={styles.searchAreaContent}>
                        <Select
                            style={{ width: "100%" }}
                            defaultValue={parseInt(branch)}
                            onChange={(e) => onSelect(e, 5)}
                        >
                            {
                                BranchList && BranchList.length > 0 ? BranchList.map((x: any) => {
                                    return <Select.Option key={x.BranchID} value={x.BranchID}>{x.BranchName}</Select.Option>
                                }) : null
                            }
                        </Select>
                    </Row>
                </div>
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

export default ICProfitMonth;