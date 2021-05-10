import React, { useState, useEffect, } from 'react';
import { useModel } from 'umi';
import { Card, Spin, Row, Col, Button, Drawer, Checkbox, Select } from 'antd';
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
import 'echarts/lib/component/legend';
//调用API
import { getVolumeChartData, } from '@/services/volume';
//调用公式方法
import {
    getLineStackSeriesData,
    getLineStackLegendData,
    getYearList,
    GetBizType1List_RadioList,
    GetOceanTransportTypeList,
} from '@/utils/utils';
import {
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

const VolumeMonth: React.FC<{}> = () => {
    const { setValue, control, } = useForm();
    const { initialState, } = useModel('@@initialState');
    const [loading, setloading] = useState(false);
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
    let fetchData = async (ParamsInfo: any) => {
        setloading(true);
        //货量
        const resultVolume = await getVolumeChartData(ParamsInfo);
        if (!resultVolume) {
            return;
        }
        if (resultVolume) {
            //当前选择年的货量数据
            let SelectYearVolumeData: any = [];
            if (resultVolume.length > 0) {
                SelectYearVolumeData = resultVolume.filter((x: { Year: any; }) => x.Year == ParamsInfo.Year);
            }
            let titleName = '';
            titleName = OceanTransportTypeList_MultiSelect.find((x: { Key: any; }) => x.Key == parseInt(ParamsInfo.CargoTypes[0]))?.Value || '';

            //将值传给初始化图表的函数
            initChart(SelectYearVolumeData, titleName);
            setloading(false);
        }
    }

    //初始化图表
    let Chart_RT: any;
    let initChart = (SelectYearVolumeData: any, titleName: string) => {
        let Element_RT = document.getElementById('RTMonth');
        if (Chart_RT != null && Chart_RT != "" && Chart_RT != undefined) {
            Chart_RT.dispose();
        }
        let Option_RT: any;
        //单位
        let yAxisName = '';
        if (SelectYearVolumeData.length > 0) {
            yAxisName = SelectYearVolumeData[0].VolUnit;
        }

        if (Element_RT) {
            Chart_RT = echarts.init(Element_RT as HTMLDivElement);
            Option_RT = {
                title: {
                    text: `月度${titleName}货量`,
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'line',
                    },
                },
                legend: {
                    bottom: 'bottom',
                    textStyle: {
                        color: 'black',
                        fontSize: 16,
                    },
                    data: getLineStackLegendData(SelectYearVolumeData, 1),
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
                xAxis: [
                    {
                        type: 'category',
                        axisLabel: {
                            show: true,
                            color: 'black',
                            fontSize: 16,
                        },
                        data: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
                    },
                ],
                yAxis: {
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
                    type: 'value'
                },
                series: getLineStackSeriesData(SelectYearVolumeData, 1),
            };
            Chart_RT.setOption(Option_RT, true);
            Chart_RT.resize({ width: window.innerWidth - 72 });
            window.addEventListener('resize', () => { Chart_RT.resize({ width: window.innerWidth - 72 }) });
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
            Months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],        //***搜索条件中没有月份,默认传全部
            BizLines: [businessesLine],
            TransTypes: [bizType1List_Radio],
            TradeTypes: checkedList4,
            CargoTypes: (oceanTransportType == 'null' || oceanTransportType == null) ? [] : [oceanTransportType],
        };
        fetchData(ParamsInfo);
        //关闭 Drawer
        setDrawerVisible(false);
    }

    return <>
        <Spin tip="数据正在加载中,请稍等..." spinning={loading} >
            <Card style={{ marginBottom: 10 }}>
                <div id="RTMonth" style={{ width: '100%', height: 800 }}></div>
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
}

export default VolumeMonth;