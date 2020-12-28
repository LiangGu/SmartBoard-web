import Global from '@/global.d';
import React, { useState, useContext, } from 'react';
import { useModel } from 'umi';
import { Button, Drawer, Checkbox, Row, Col, Radio, } from 'antd';
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
    const [year, setYear] = useState(() =>{
        // 惰性赋值 any 类型,要不默认值不起作用
        let selectYear:any = getselectYear();
        return selectYear;
    });

    // MonthList                    :2
    const [checkedList2, setCheckedList2] = useState(() => {
        if(initialState?.searchInfo?.MonthList){
            return initialState?.searchInfo?.MonthList;
        }else{
            return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        }
    });
    const [indeterminate2, setIndeterminate2] = useState(false);
    const [checkAll2, setCheckAll2] = useState(() =>{
        if(initialState?.searchInfo?.MonthList?.length == MonthList.length){
            return false;
        }else{
            return true;
        }
    });
    // BizType1List                 :3
    const [checkedList3, setCheckedList3] = useState(() => {
        if(initialState?.searchInfo?.BizType1List){
            return initialState?.searchInfo?.BizType1List;
        }else{
            return [1, 2, 3, 4, 5, 6, 10, 11, 12, 13, 14];
        } 
    });
    const [indeterminate3, setIndeterminate3] = useState(false);
    const [checkAll3, setCheckAll3] = useState(() =>{
        if(initialState?.searchInfo?.BizType1List?.length == BizType1List.length){
            return false;
        }else{
            return true;
        }
    });
    // BizType2List                 :4
    const [checkedList4, setCheckedList4] = useState(() => {
        if(initialState?.searchInfo?.BizType2List){
            return initialState?.searchInfo?.BizType2List;
        }else{
            return [1, 2, 3, 4, 5, 6];
        } 
    });
    const [indeterminate4, setIndeterminate4] = useState(false);
    const [checkAll4, setCheckAll4] = useState(() =>{
        if(initialState?.searchInfo?.BizType2List?.length == BizType2List.length){
            return false;
        }else{
            return true;
        }
    });

    // OceanTransportTypeList                 :5
    const [oceanTransportType, setOceanTransportType] = useState(() =>{
        // 惰性赋值 any 类型,要不默认值不起作用
        let selectOceanTransportType:any = getselectOceanTransportType();
        return selectOceanTransportType;
    });

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
        let userName:any = getUserName();
        let userID:any = getUserID();
        let branchID:any = getBranchID();
        let branchCode:any = getBranchCode();
        let token:any = getToken();
        let funcCurrency:any = getFuncCurr();
        let selectBranchID:any = getselectBranchID();
        let selectBranchName:any = getselectBranchName();
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

    /**
     * 年份单选
     * * @param T 
     * @param e 
     */
    const onRadioChange = (T: Number, e: any) => {
        switch (T) {
            case 1:
                setYear(e.target.value);
                break;
            case 2:
                setOceanTransportType(e.target.value);
                break;
            default: return;
        }
    }

    return (
        <>
            <Button type="primary" icon={<SearchOutlined />} className={styles.searchBtn} onClick={() => setDrawerVisible(true)} />
            <Drawer
                title="请选择搜索条件"
                placement={"right"}
                closable={false}
                onClose={onClose}
                visible={DrawerVisible}
                key={"right"}
                footer={
                    <Button type="primary" icon={<SearchOutlined />} style={{ width: "100%" }} onClick={onSearch}>
                        确定
                    </Button>
                }
            >

                {
                    // 月份货量和收支利润没有月份的搜索条件
                    PropsState && PropsState == 1 || PropsState && PropsState == 5 ?
                        <>
                            <div className={styles.searchArea}>
                                <Row className={styles.searchAreaLable}>
                                    <Col span={12} className={styles.searchAreaTitle}>年份</Col>
                                </Row>
                                <Radio.Group buttonStyle="solid" size="small" onChange={(e) => onRadioChange(1, e)} defaultValue={parseInt(year)}>
                                    <Row className={styles.searchAreaContent}>
                                        {
                                            YearList && YearList.length > 0 ? YearList.map(x => {
                                                // YearList 变化时要修改下方 <Col span={8}>
                                                return <Col span={24} key={x.Key} style={{ marginBottom: 5, }}><Radio.Button style={{ width: "100%" , textAlign: "center"}} key={x.Key} value={x.Key}>{x.Value}</Radio.Button></Col>
                                            }) : null
                                        }
                                    </Row>
                                </Radio.Group>
                            </div>

                            <div className={styles.searchArea}>
                                <Row className={styles.searchAreaLable}>
                                    <Col span={12} className={styles.searchAreaTitle}>运输类型</Col>
                                    <Checkbox indeterminate={indeterminate3} onChange={(e) => onCheckAllChange(2, e)} checked={checkAll3}>
                                        全选
                                    </Checkbox>
                                </Row>
                                <Checkbox.Group value={checkedList3} onChange={(list) => onChange(3, list)}>
                                    <Row className={styles.searchAreaContent}>
                                        {
                                            BizType1List && BizType1List.length > 0 ? BizType1List.map(x => {
                                                return <Col span={12} key={x.Key} style={{ marginBottom: 5, }}><Checkbox value={x.Key}>{x.Value}</Checkbox></Col>
                                            }) : null
                                        }
                                    </Row>
                                </Checkbox.Group>
                            </div>

                            <div className={styles.searchArea}>
                                <Row className={styles.searchAreaLable}>
                                    <Col span={12} className={styles.searchAreaTitle}>贸易类型</Col>
                                    <Checkbox indeterminate={indeterminate4} onChange={(e) => onCheckAllChange(3, e)} checked={checkAll4}>
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
                                </Row>
                                <Radio.Group buttonStyle="solid" size="small" onChange={(e) => onRadioChange(2, e)} defaultValue={parseInt(oceanTransportType)}>
                                    <Row className={styles.searchAreaContent}>
                                        {
                                            OceanTransportTypeList && OceanTransportTypeList.length > 0 ? OceanTransportTypeList.map(x => {
                                                return <Col span={6} key={x.Key} style={{ marginBottom: 5, }}><Radio.Button style={{ width: "100%" , textAlign: "center"}} key={x.Key} value={x.Key}>{x.Value}</Radio.Button></Col>
                                            }) : null
                                        }
                                    </Row>
                                </Radio.Group>
                            </div>
                        </> :
                    // 现金流只有年份的搜索条件
                    PropsState && PropsState == 4 ?
                        <>
                            <div className={styles.searchArea}>
                                <Row className={styles.searchAreaLable}>
                                    <Col span={12} className={styles.searchAreaTitle}>年份</Col>
                                </Row>
                                <Radio.Group buttonStyle="solid" size="small" onChange={(e) => onRadioChange(1, e)} defaultValue={parseInt(year)}>
                                    <Row className={styles.searchAreaContent}>
                                        {
                                            YearList && YearList.length > 0 ? YearList.map(x => {
                                                // YearList 变化时要修改下方 <Col span={8}>
                                                return <Col span={24} key={x.Key} style={{ marginBottom: 5, }}><Radio.Button style={{ width: "100%" , textAlign: "center"}} key={x.Key} value={x.Key}>{x.Value}</Radio.Button></Col>
                                            }) : null
                                        }
                                    </Row>
                                </Radio.Group>
                            </div>
                        </> :
                        <>
                            <div className={styles.searchArea}>
                                <Row className={styles.searchAreaLable}>
                                    <Col span={12} className={styles.searchAreaTitle}>年份</Col>
                                </Row>
                                <Radio.Group buttonStyle="solid" size="small" onChange={(e) => onRadioChange(1, e)} defaultValue={parseInt(year)}>
                                    <Row className={styles.searchAreaContent}>
                                        {
                                            YearList && YearList.length > 0 ? YearList.map(x => {
                                                // YearList 变化时要修改下方 <Col span={8}>
                                                return <Col span={24} key={x.Key} style={{ marginBottom: 5, }}><Radio.Button style={{ width: "100%" , textAlign: "center"}} key={x.Key} value={x.Key}>{x.Value}</Radio.Button></Col>
                                            }) : null
                                        }
                                    </Row>
                                </Radio.Group>
                            </div>

                            <div className={styles.searchArea}>
                                <Row className={styles.searchAreaLable}>
                                    <Col span={12} className={styles.searchAreaTitle}>月份</Col>
                                    <Checkbox indeterminate={indeterminate2} onChange={(e) => onCheckAllChange(1, e)} checked={checkAll2}>
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
                                    <Col span={12} className={styles.searchAreaTitle}>运输类型</Col>
                                    <Checkbox indeterminate={indeterminate3} onChange={(e) => onCheckAllChange(2, e)} checked={checkAll3}>
                                        全选
                                    </Checkbox>
                                </Row>
                                <Checkbox.Group value={checkedList3} onChange={(list) => onChange(3, list)}>
                                    <Row className={styles.searchAreaContent}>
                                        {
                                            BizType1List && BizType1List.length > 0 ? BizType1List.map(x => {
                                                return <Col span={12} key={x.Key} style={{ marginBottom: 5, }}><Checkbox value={x.Key}>{x.Value}</Checkbox></Col>
                                            }) : null
                                        }
                                    </Row>
                                </Checkbox.Group>
                            </div>

                            <div className={styles.searchArea}>
                                <Row className={styles.searchAreaLable}>
                                    <Col span={12} className={styles.searchAreaTitle}>贸易类型</Col>
                                    <Checkbox indeterminate={indeterminate4} onChange={(e) => onCheckAllChange(3, e)} checked={checkAll4}>
                                        全选
                                    </Checkbox>
                                </Row>
                                <Checkbox.Group value={[...checkedList4]} onChange={(list) => onChange(4, list)}>
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
                                </Row>
                                <Radio.Group buttonStyle="solid" size="small" onChange={(e) => onRadioChange(2, e)} defaultValue={parseInt(oceanTransportType)}>
                                    <Row className={styles.searchAreaContent}>
                                        {
                                            OceanTransportTypeList && OceanTransportTypeList.length > 0 ? OceanTransportTypeList.map(x => {
                                                return <Col span={6} key={x.Key} style={{ marginBottom: 5, }}><Radio.Button style={{ width: "100%" , textAlign: "center"}} key={x.Key} value={x.Key}>{x.Value}</Radio.Button></Col>
                                            }) : null
                                        }
                                    </Row>
                                </Radio.Group>
                            </div>
                        </>
                }
            </Drawer>
        </>
    )
}

export default SearchButton;