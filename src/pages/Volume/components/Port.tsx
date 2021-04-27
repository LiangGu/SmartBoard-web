import React, { useState, useEffect, } from 'react';
import { useModel } from 'umi';
import { Card, Spin, Radio, Row, Col, Button, Drawer, Checkbox, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import styles from '@/components/Search/index.less';
import { useForm, Controller, } from 'react-hook-form';
//引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入需要用到的图表
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/bar';
// 引入提示框和标题组件
import 'echarts/lib/component/title';
import 'echarts/lib/component/tooltip';
//调用API
import { getPortChartData, } from '@/services/volume';
//调用公式方法
import {
    sortObjectArr,
    transIntOfArraay,
    FilterZeroOfArraay,
    getYearList,
    GetBizType1List_RadioList,
    GetOceanTransportTypeList,
} from '@/utils/utils';
import {
    MonthList,
    BusinessesLineList,
    BizType2List,
    OceanTransportTypeList_MultiSelect,
} from '@/utils/baseData';
import {
    getBranchList,
    getselectBranchID,
    getselectYear,
    getselectBusinessesLine,
    getselectBizType1List_Radio,
    getselectOceanTransportType,
} from '@/utils/auths';

const VolumePort: React.FC<{}> = () => {
    const { setValue, control, } = useForm();
    const { initialState, } = useModel('@@initialState');
    const [loading, setloading] = useState(false);
    const [title, setTitle] = useState('');
    const [top, setTop] = useState(10);
    const [result, setResult] = useState([]);
    const [domHeight, setDomHeight] = useState(800);
    const [DrawerVisible, setDrawerVisible] = useState(false);

    //数据集
    const [YearList,] = useState(() => {
        return getYearList();
    });
    //根据业务线动态获取运输类型数据
    const [BizType1List_RadioList, setBizType1List_RadioList,] = useState(() => {
        return GetBizType1List_RadioList(getselectBusinessesLine());
    });
    //根据业务线和运输类型动态获取获取类型
    const [OceanTransportTypeList, setOceanTransportTypeList,] = useState(() => {
        return GetOceanTransportTypeList(getselectBusinessesLine(), getselectBizType1List_Radio());
    });
    const [BranchList,] = useState(() => {
        return getBranchList();
    });


    /**
     *  单选
     * */
    // YearList
    const [year, setYear] = useState(() => {
        // 惰性赋值 any 类型,要不默认值不起作用
        let selectYear: any = getselectYear();
        return selectYear;
    });

    // BusinessesLineList
    const [businessesLine, setBusinessesLine] = useState(() => {
        // 惰性赋值 any 类型,要不默认值不起作用
        let selectBusinessesLine: any = getselectBusinessesLine();
        return selectBusinessesLine;
    });

    // BizType1List_Radio
    const [bizType1List_Radio, setBizType1List_Radio] = useState(() => {
        // 惰性赋值 any 类型,要不默认值不起作用
        let selectBizType1List_Radio: any = getselectBizType1List_Radio();
        return selectBizType1List_Radio;
    });

    // OceanTransportTypeList
    const [oceanTransportType, setOceanTransportType] = useState(() => {
        // 惰性赋值 any 类型,要不默认值不起作用
        let selectOceanTransportType: any = getselectOceanTransportType();
        return selectOceanTransportType;
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

    //获取数据
    let fetchData = async (ParamsInfo: any, Top: Number, domHeight: Number) => {
        setloading(true);
        const result = await getPortChartData(ParamsInfo);
        if (!result) {
            return;
        }
        if (result) {
            if (result.length > 0) {
                setResult(result);
            }
            let titleName = '';
            titleName = OceanTransportTypeList_MultiSelect.find((x: { Key: any; }) => x.Key == parseInt(ParamsInfo.CargoTypes[0]))?.Value || '';
            setTitle(titleName);
            //将值传给初始化图表的函数
            initChart(result, titleName, Top, domHeight);
            setloading(false);
        }
    }

    //初始化图表
    let myChart: any;
    let initChart = (result: any, titleName: string, top: Number, domHeight: Number) => {
        let element = document.getElementById('VolumePort');
        if (myChart != null && myChart != "" && myChart != undefined) {
            myChart.dispose();
        }
        let option: any;

        //处理数据
        let PortTopList: any = [];
        let PortTopTotalVolumeList: any = [];
        let PortTopPortNameList: any = [];
        PortTopList = FilterZeroOfArraay((result.sort(sortObjectArr('Volume', 2)).slice(0, top)).sort(sortObjectArr('Volume', 1)), 0, 'Volume');
        if (PortTopList.length > 0) {
            PortTopList.map((x: { Volume: any; PortName: string; }) => {
                PortTopTotalVolumeList.push(x.Volume);
                PortTopPortNameList.push(x.PortName);
            });
        }
        //单位
        let yAxisName = '';
        if (PortTopList.length > 0) {
            yAxisName = PortTopList[0].VolUnit;
        }

        if (element) {
            myChart = echarts.init(element as HTMLDivElement);
            option = {
                title: {
                    text: `前${top}港口${titleName}排名`,
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
                xAxis: {
                    type: 'value',
                    axisLabel: {
                        show: true,
                        color: 'black',
                        fontSize: 16,
                    },
                    boundaryGap: [0, 0.01],
                },
                yAxis: {
                    type: 'category',
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
                    data: [...PortTopPortNameList],
                },
                series: [
                    {
                        type: 'bar',
                        name: yAxisName,
                        color: '#C23531',
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
                        data: transIntOfArraay(PortTopTotalVolumeList),
                    }
                ],
            };
            myChart.setOption(option, true);
            myChart.resize({ width: window.innerWidth - 72, height: domHeight });
            window.addEventListener('resize', () => { myChart.resize({ width: window.innerWidth - 72, height: domHeight }) });
        }
    };

    /**
     * 第2个参数传 [initialState] 相当于 componentDidMount 钩子
     */
    useEffect(() => {
        let ParamsInfo: object = {
            BranchID: getselectBranchID(),
            Year: getselectYear(),
            Months: initialState?.searchInfo?.MonthList || [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            BizLines: [getselectBusinessesLine()],
            TransTypes: [getselectBizType1List_Radio()],
            TradeTypes: initialState?.searchInfo?.BizType2List || [1, 2, 3, 4, 5, 6],
            CargoTypes: (getselectOceanTransportType() == 'null' || getselectOceanTransportType() == null) ? [] : [getselectOceanTransportType()],
        };
        fetchData(ParamsInfo, top, domHeight);
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
            case 2:
                setBusinessesLine(e);

                /**
                 * 步骤1
                 */
                //动态获取运输类型数组
                setBizType1List_RadioList(GetBizType1List_RadioList(e));
                //赋值运输类型
                setBizType1List_Radio(GetBizType1List_RadioList(e)[0]?.Key || null);
                //赋值运输类型显示值
                setValue('bizType1List_Radio', GetBizType1List_RadioList(e)[0]?.Value || '');

                /**
                 * 步骤2
                 */
                //动态获取货物类型数组
                setOceanTransportTypeList(GetOceanTransportTypeList(e, GetBizType1List_RadioList(e)[0]?.Key));
                //赋值货物类型
                setOceanTransportType(GetOceanTransportTypeList(e, GetBizType1List_RadioList(e)[0]?.Key)[0]?.Key || null);
                //赋值货物类型显示值
                setValue('oceanTransportType', GetOceanTransportTypeList(e, GetBizType1List_RadioList(e)[0]?.Key)[0]?.Value || '');

                break;
            case 3:
                setBizType1List_Radio(e);

                /**
                 * 步骤1
                 */
                //动态获取货物类型数组
                setOceanTransportTypeList(GetOceanTransportTypeList(businessesLine, e));
                //赋值货物类型
                setOceanTransportType(GetOceanTransportTypeList(businessesLine, e)[0]?.Key || null);
                //赋值货物类型显示值
                setValue('oceanTransportType', GetOceanTransportTypeList(businessesLine, e)[0]?.Value || '');

                break;
            case 4:
                setOceanTransportType(e);
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
            case 1:
                setCheckedList1(list);
                setIndeterminate1(!!list.length && list.length < MonthList.length);
                setCheckAll1(list.length === MonthList.length);
                break;
            case 4:
                setCheckedList4(list);
                setIndeterminate4(!!list.length && list.length < BizType2List.length);
                setCheckAll4(list.length === BizType2List.length);
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
            case 4:
                setCheckedList4(e.target.checked ? [1, 2, 3, 4, 5, 6] : []);
                setIndeterminate4(false);
                setCheckAll4(e.target.checked);
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
            Months: checkedList1,
            BizLines: [businessesLine],
            TransTypes: [bizType1List_Radio],
            TradeTypes: checkedList4,
            CargoTypes: (oceanTransportType == 'null' || oceanTransportType == null) ? [] : [oceanTransportType],
        };
        fetchData(ParamsInfo, top, domHeight);
        //关闭 Drawer
        setDrawerVisible(false);
    }

    /**
     * 点击切换统计图表类型
     */
    const onChangeTop = (e: any) => {
        setTop(e.target.value);
        let DomHeight = domHeight;
        if (e && e.target.value) {
            if (e.target.value == 10) {
                DomHeight = 800;
            } else if (e.target.value == 20) {
                DomHeight = 1000;
            } else if (e.target.value == 30) {
                DomHeight = 1200;
            } else if (e.target.value == 40) {
                DomHeight = 1400;
            } else if (e.target.value == 50) {
                DomHeight = 1600;
            }
        }
        setDomHeight(DomHeight);
        initChart(result, title, e.target.value, DomHeight);
    }

    return <>
        <Spin tip="数据正在加载中,请稍等..." spinning={loading}>
            <Card
                extra={
                    <>
                        <Radio.Group defaultValue={top} buttonStyle="solid" onChange={onChangeTop} style={{ marginRight: 20 }}>
                            <Radio.Button value={10}>前10</Radio.Button>
                            <Radio.Button value={20}>前20</Radio.Button>
                            <Radio.Button value={30}>前30</Radio.Button>
                            <Radio.Button value={40}>前40</Radio.Button>
                            <Radio.Button value={50}>前50</Radio.Button>
                        </Radio.Group>
                    </>
                }
            >
                <div id="VolumePort" style={{ width: '100%', height: domHeight }}></div>
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
            {
                getselectBranchID() == '0' ?
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
                    </div> : null
            }

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
                </Row>
                <Row className={styles.searchAreaContent}>
                    <Select
                        style={{ width: "100%" }}
                        defaultValue={parseInt(businessesLine)}
                        onChange={(e) => onSelect(e, 2)}
                    >
                        {
                            BusinessesLineList && BusinessesLineList.length > 0 ? BusinessesLineList.map((x) => {
                                return <Select.Option key={x.Key} value={x.Key}>{x.Value}</Select.Option>
                            }) : null
                        }
                    </Select>
                </Row>
            </div>
            <div className={styles.searchArea}>
                <Row className={styles.searchAreaLable}>
                    <Col span={12} className={styles.searchAreaTitle}>运输类型</Col>
                </Row>
                <Row className={styles.searchAreaContent}>
                    <form style={{ width: "100%" }}>
                        <Controller
                            defaultValue={parseInt(bizType1List_Radio)}
                            name="bizType1List_Radio"
                            control={control}
                            render={() => (
                                <Select
                                    style={{ width: "100%" }}
                                    value={parseInt(bizType1List_Radio)}
                                    onChange={(e) => onSelect(e, 3)}
                                >
                                    {
                                        BizType1List_RadioList && BizType1List_RadioList.length > 0 ? BizType1List_RadioList.map((x) => {
                                            return <Select.Option key={x.Key} value={x.Key}>{x.Value}</Select.Option>
                                        }) : null
                                    }
                                </Select>
                            )}
                        />
                    </form>
                </Row>
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
            {
                oceanTransportType == 'null' || oceanTransportType == null ? null :
                    <div className={styles.searchArea}>
                        <Row className={styles.searchAreaLable}>
                            <Col span={12} className={styles.searchAreaTitle}>货物类型</Col>
                        </Row>
                        <Row className={styles.searchAreaContent}>
                            <form style={{ width: "100%" }}>
                                <Controller
                                    defaultValue={parseInt(oceanTransportType)}
                                    name="oceanTransportType"
                                    control={control}
                                    render={() => (
                                        <Select
                                            style={{ width: "100%" }}
                                            value={parseInt(oceanTransportType)}
                                            onChange={(e) => onSelect(e, 4)}
                                        >
                                            {
                                                OceanTransportTypeList && OceanTransportTypeList.length > 0 ? OceanTransportTypeList.map((x) => {
                                                    return <Select.Option key={x.Key} value={x.Key}>{x.Value}</Select.Option>
                                                }) : null
                                            }
                                        </Select>
                                    )}
                                />
                            </form>
                        </Row>
                    </div>
            }

        </Drawer>

    </>
};

export default VolumePort;