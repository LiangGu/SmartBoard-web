import Global from '@/global.d';
import React, { useState, useContext, } from 'react';
import { useModel } from 'umi';
import { Button, Drawer, Checkbox, Row, Col, Select, } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import styles from './index.less';
//引入自定义方法
import { getYearList, } from '@/utils/utils';
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
    getselectOceanTransportType,
} from '@/utils/auths';
//引入基础数据
import { MonthList, BizType1List, BizType2List, OceanTransportTypeList, } from '@/utils/baseData';

import ContextProps from '@/createContext';

const SearchButton: React.FC<{}> = ({ }) => {
    const PropsState = useContext(ContextProps);     //得到父组件过来的值
    const { initialState, setInitialState } = useModel('@@initialState');
    const [YearList,] = useState(() => {
        return getYearList();
    });
    const [DrawerVisible, setDrawerVisible] = useState(false);
    //多选框值
    // YearList                     :1
    const [year, setYear] = useState(() => {
        // 惰性赋值 any 类型,要不默认值不起作用
        let selectYear: any = getselectYear();
        return selectYear;
    });

    // MonthList                    :2
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
    // BizType1List                 :3
    const [checkedList3, setCheckedList3] = useState(() => {
        let searchInfoBizType1List: any = initialState?.searchInfo?.BizType1List;
        if (searchInfoBizType1List) {
            return searchInfoBizType1List;
        } else {
            return [1, 2, 3, 4, 5, 6, 10, 11, 12, 13, 14];
        }
    });
    const [indeterminate3, setIndeterminate3] = useState(false);
    const [checkAll3, setCheckAll3] = useState(() => {
        return initialState?.searchInfo?.BizType1List ? initialState?.searchInfo?.BizType1List?.length == BizType1List.length : true;
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

    // OceanTransportTypeList        :5
    const [oceanTransportType, setOceanTransportType] = useState(() => {
        // 惰性赋值 any 类型,要不默认值不起作用
        let selectOceanTransportType: any = getselectOceanTransportType();
        return selectOceanTransportType;
    });

    /**
     * 下拉选择
     * @param T
     * @param list 
     */
    const onSelect = (value: any, e: any, T: Number,) => {
        switch (T) {
            case 1:
                setYear(e.key);
                break;
            case 2:
                setOceanTransportType(e.key);
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
                setIndeterminate3(!!list.length && list.length < BizType1List.length);
                setCheckAll3(list.length === BizType1List.length);
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
            BizType1List: checkedList3,
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

                {/* 年份 */}
                {
                    [1.1, 1.2, 1.3, 2.1, 3.1, 5.1].includes(PropsState) ?
                        <>
                            <div className={styles.searchArea}>
                                <Row className={styles.searchAreaLable}>
                                    <Col span={12} className={styles.searchAreaTitle}>年份</Col>
                                </Row>
                                <Row className={styles.searchAreaContent}>
                                    <Select
                                        style={{ width: "100%" }}
                                        allowClear={false}
                                        defaultValue={YearList.find(x=>x.Key == parseInt(year))?.Value}
                                        onChange={(value,e) => onSelect(value, e, 1)}
                                    >
                                        {
                                            YearList && YearList.length > 0 ? YearList.map((x) => {
                                                return <Select.Option key={x.Key} value={x.Value}>{x.Value}</Select.Option>
                                            }) : null
                                        }
                                    </Select>
                                </Row>
                            </div>
                        </> : null
                }

                {/* 月份 */}
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

                {/* 运输类型 */}
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
                                            BizType1List && BizType1List.length > 0 ? BizType1List.map(x => {
                                                return <Col span={12} key={x.Key} style={{ marginBottom: 5, }}><Checkbox value={x.Key}>{x.Value}</Checkbox></Col>
                                            }) : null
                                        }
                                    </Row>
                                </Checkbox.Group>
                            </div>
                        </> : null
                }

                {/* 贸易类型 */}
                {
                    [1.2, 1.3, 2.1, 2.2, 5.1].includes(PropsState) ?
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

                {/* 货物类型 */}
                {
                    [1.2, 2.1, 2.2, 5.1].includes(PropsState) ?
                        <>
                            <div className={styles.searchArea}>
                                <Row className={styles.searchAreaLable}>
                                    <Col span={12} className={styles.searchAreaTitle}>货物类型</Col>
                                </Row>
                                <Row className={styles.searchAreaContent}>
                                    <Select
                                        style={{ width: "100%" }}
                                        allowClear={false}
                                        defaultValue={OceanTransportTypeList.find(x=>x.Key == parseInt(oceanTransportType))?.Value}
                                        onChange={(value,e) => onSelect(value, e, 2)}
                                    >
                                        {
                                            OceanTransportTypeList && OceanTransportTypeList.length > 0 ? OceanTransportTypeList.map((x) => {
                                                return <Select.Option key={x.Key} value={x.Value}>{x.Value}</Select.Option>
                                            }) : null
                                        }
                                    </Select>
                                </Row>
                            </div>
                        </> : null
                }
            </Drawer>
        </>
    )
}

export default SearchButton;