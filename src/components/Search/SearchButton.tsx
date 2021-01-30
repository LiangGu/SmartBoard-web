import Global from '@/global.d';
import React, { useState, useContext, } from 'react';
import { useModel } from 'umi';
import { Button, Drawer, Checkbox, Row, Col, Select,} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import styles from './index.less';
import { useForm, Controller, } from 'react-hook-form';
//引入自定义方法
import { getYearList, GetBizType1List_RadioList, GetOceanTransportTypeList,} from '@/utils/utils';
import {
    setSystemMes,
    getUserName,
    getUserID,
    getBranchID,
    getBranchCode,
    getToken,
    getFuncCurr,

    getselectBranchID,
    getselectBranchName,
    getselectYear,
    getselectBusinessesLine,
    getselectBizType1List_Radio,
    getselectOceanTransportType,
} from '@/utils/auths';
//引入基础数据
import { MonthList, BusinessesLineList, BizType1List_MultiSelect, BizType2List, } from '@/utils/baseData';

import ContextProps from '@/createContext';

const SearchButton: React.FC<{}> = ({ }) => {
    const { setValue, control, } = useForm();
    const PropsState = useContext(ContextProps);     //得到父组件过来的值
    const { initialState, setInitialState } = useModel('@@initialState');
    const [YearList,] = useState(() => {
        return getYearList();
    });
    //根据业务线动态获取运输类型数据
    const [BizType1List_RadioList, setBizType1List_RadioList,] = useState(() => {
        return GetBizType1List_RadioList(getselectBusinessesLine());
    });
    //根据业务线和运输类型动态获取获取类型
    const [OceanTransportTypeList, setOceanTransportTypeList,] = useState(() => {
        return GetOceanTransportTypeList(getselectBusinessesLine(),getselectBizType1List_Radio());
    });


    const [DrawerVisible, setDrawerVisible] = useState(false);

    // 单选
    // YearList                     :1
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







    
    
    // 多选
    // MonthList                    :1
    const [checkedList2, setCheckedList2] = useState(() => {
        let searchInfoMonthList: any = initialState?.searchInfo?.MonthList;
        if (searchInfoMonthList) {
            return searchInfoMonthList;
        } else {
            return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        }
    });
    const [indeterminate2, setIndeterminate2] = useState(false);
    const [checkAll2, setCheckAll2] = useState(() => {
        return initialState?.searchInfo?.MonthList ? initialState?.searchInfo?.MonthList?.length == MonthList.length : true;
    });
    // BizType1List_MultiSelect                 :2
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
    // BizType2List                 :3
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
                setValue('bizType1List_Radio',GetBizType1List_RadioList(e)[0]?.Value || '');

                /**
                 * 步骤2
                 */
                //动态获取货物类型数组
                setOceanTransportTypeList(GetOceanTransportTypeList(businessesLine, bizType1List_Radio));
                //赋值货物类型
                setOceanTransportType(GetOceanTransportTypeList(businessesLine, bizType1List_Radio)[0]?.Key || null);
                //赋值货物类型显示值
                setValue('oceanTransportType',GetOceanTransportTypeList(businessesLine, bizType1List_Radio)[0]?.Value || '');

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
                setValue('oceanTransportType',GetOceanTransportTypeList(businessesLine, e)[0]?.Value || '');

                break;
            case 4:
                setOceanTransportType(e);
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
                setCheckedList2(list);
                setIndeterminate2(!!list.length && list.length < MonthList.length);
                setCheckAll2(list.length === MonthList.length);
                break;
            case 2:
                setCheckedList3(list);
                setIndeterminate3(!!list.length && list.length < BizType1List_MultiSelect.length);
                setCheckAll3(list.length === BizType1List_MultiSelect.length);
                break;
            case 3:
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
                setCheckedList2(e.target.checked ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] : []);
                setIndeterminate2(false);
                setCheckAll2(e.target.checked);
                break;
            case 2:
                setCheckedList3(e.target.checked ? [1, 2, 3, 4, 5, 6, 10, 11, 12, 13, 14] : []);
                setIndeterminate3(false);
                setCheckAll3(e.target.checked);
                break;
            case 3:
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
        setDrawerVisible(false)
    }

    /**
     * 确定搜索条件
     * 1、保存 搜索信息 + Tag 标签
     * 2、搜索
     * 3、关闭 Drawer
     */
    const onSearch = () => {
        //Step 1 <*如果页面的搜索条件不同,则下面的 searchInfo 可以根据 PropsState 来判断赋值>
        let searchInfo: object = {
            UpdateIndex: new Date().getTime(),
            MonthList: checkedList2,
            BizType1List_MultiSelect: checkedList3,
            BizType2List: checkedList4,
        };
        setInitialState({
            ...initialState,
            searchInfo,
        });
        // 重置 Session 中的数据
        let userName: any = getUserName();
        let userID: any = getUserID();
        let branchID: any = getBranchID();
        let branchCode: any = getBranchCode();
        let token: any = getToken();
        let funcCurrency: any = getFuncCurr();
        let selectBranchID: any = getselectBranchID();
        let selectBranchName: any = getselectBranchName();
        let sysSaveData: Global.SessionSysSave = {
            userName: userName,
            userID: userID,
            branchID: branchID,
            branchCode: branchCode,
            token: token,
            funcCurrency: funcCurrency,
            // 保存到 Session 中,防止页面刷新数据丢失
            selectBranchID: selectBranchID,
            selectBranchName: selectBranchName,
            selectYear: year,
            selectBusinessesLine: businessesLine,
            selectBizType1List_Radio: bizType1List_Radio,
            selectOceanTransportType: oceanTransportType,
        }
        setSystemMes(sysSaveData);
        //Step 2 <页面中 useEffect 根据 initialState 判断动态搜索>

        //Step 3
        setDrawerVisible(false)
    }

    return (
        <>
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

                {/* 
                    1.1、货量分析-公司
                    1.2、货量分析-月份
                    1.3、货量分析-港口
                    2.1、收支利润-公司
                    2.2、收支利润-月份
                    3.1、现金流
                    5.1、客户排名 
                */}

                {/* 年份<单选> */}
                {
                    [1.1, 1.2, 1.3, 2.1, 5.1].includes(PropsState) ?
                        <>
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
                        </> : null
                }

                {/* 月份<单选> */}
                {
                    [1.1, 1.3, 2.1, 5.1].includes(PropsState) ?
                        <>
                            <div className={styles.searchArea}>
                                <Row className={styles.searchAreaLable}>
                                    <Col span={12} className={styles.searchAreaTitle}>月份</Col>
                                    <Checkbox indeterminate={indeterminate2} onChange={(e) => onCheckAllChange(1, e)} checked={checkAll2}>
                                        全选
                                </Checkbox>
                                </Row>
                                <Checkbox.Group value={checkedList2} onChange={(list) => onChange(1, list)}>
                                    <Row className={styles.searchAreaContent}>
                                        {
                                            MonthList && MonthList.length > 0 ? MonthList.map(x => {
                                                return <Col span={8} key={x.Key} style={{ marginBottom: 5, }}><Checkbox value={x.Key}>{x.Value}</Checkbox></Col>
                                            }) : null
                                        }
                                    </Row>
                                </Checkbox.Group>
                            </div>
                        </> : null
                }

                {/* 业务线<单选> */}
                {
                    [1.1, 1.2, 1.3, 2.1, 5.1].includes(PropsState) ?
                        <>
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
                        </> : null
                }

                {/* 运输类型<单选> */}
                {
                    [1.1, 1.2, 1.3, 2.1, 5.1].includes(PropsState) ?
                        <>
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
                        </> : null
                }

                {/* 运输类型<多选> */}
                {
                    [1.2, 1.3, 2.1, 2.2, 5.1].includes(PropsState) ?
                        <>
                            <div className={styles.searchArea}>
                                <Row className={styles.searchAreaLable}>
                                    <Col span={12} className={styles.searchAreaTitle}>运输类型</Col>
                                    <Checkbox indeterminate={indeterminate3} onChange={(e) => onCheckAllChange(2, e)} checked={checkAll3}>
                                        全选
                                </Checkbox>
                                </Row>
                                <Checkbox.Group value={checkedList3} onChange={(list) => onChange(2, list)}>
                                    <Row className={styles.searchAreaContent}>
                                        {
                                            BizType1List_MultiSelect && BizType1List_MultiSelect.length > 0 ? BizType1List_MultiSelect.map(x => {
                                                return <Col span={12} key={x.Key} style={{ marginBottom: 5, }}><Checkbox value={x.Key}>{x.Value}</Checkbox></Col>
                                            }) : null
                                        }
                                    </Row>
                                </Checkbox.Group>
                            </div>
                        </> : null
                }

                {/* 贸易类型<多选> */}
                {
                    [1.1, 1.2, 1.3, 2.1, 2.2, 5.1].includes(PropsState) ?
                        <>
                            <div className={styles.searchArea}>
                                <Row className={styles.searchAreaLable}>
                                    <Col span={12} className={styles.searchAreaTitle}>贸易类型</Col>
                                    <Checkbox indeterminate={indeterminate4} onChange={(e) => onCheckAllChange(3, e)} checked={checkAll4}>
                                        全选
                                </Checkbox>
                                </Row>
                                <Checkbox.Group value={checkedList4} onChange={(list) => onChange(3, list)}>
                                    <Row className={styles.searchAreaContent}>
                                        {
                                            BizType2List && BizType2List.length > 0 ? BizType2List.map(x => {
                                                return <Col span={12} key={x.Key} style={{ marginBottom: 5, }}><Checkbox value={x.Key}>{x.Value}</Checkbox></Col>
                                            }) : null
                                        }
                                    </Row>
                                </Checkbox.Group>
                            </div>
                        </> : null
                }

                {/* 货物类型<单选> */}
                {
                    [1.1, 1.2, 2.1, 2.2, 5.1].includes(PropsState) && OceanTransportTypeList.length > 0?
                        <>
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

                                    {/* <Select
                                        style={{ width: "100%" }}
                                        defaultValue={parseInt(oceanTransportType)}
                                        onChange={(e) => onSelect(e, 4)}
                                    >
                                        {
                                            OceanTransportTypeList && OceanTransportTypeList.length > 0 ? OceanTransportTypeList.map((x) => {
                                                return <Select.Option key={x.Key} value={x.Key}>{x.Value}</Select.Option>
                                            }) : null
                                        }
                                    </Select> */}
                                </Row>
                            </div>
                        </> : null
                }
            </Drawer>
        </>
    )
}

export default SearchButton;