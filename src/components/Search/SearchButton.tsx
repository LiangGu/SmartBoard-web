import React, { useState, useEffect, useContext, } from 'react';
import { useModel } from 'umi';
import { Button, Drawer, Checkbox, Row, Col, Radio, } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import styles from './index.less';
//引入自定义方法
import { getYearList, } from '@/utils/utils';
//引入基础数据
import { MonthList, BizType1List, BizType2List, OceanTransportTypeList, transfromToTag, } from '@/utils/baseData';

import ContextProps from '@/createContext';

const SearchButton: React.FC<{}> = ({}) => {
    const PropsInfo = useContext(ContextProps);     //得到父组件过来的值
    const { initialState, setInitialState } = useModel('@@initialState');
    const [ YearList, ] = useState(()=>{
        return getYearList();
    });
    const [ DrawerVisible, setDrawerVisible] = useState(false);
    //多选框值
    // YearList                     :1
    const [ checkedList1, setCheckedList1] = useState(()=>{
        return [2018,2019,2020];
    });
    const [ indeterminate1, setIndeterminate1] = useState(false);
    const [ checkAll1, setCheckAll1] = useState(true);

    const [ year, setYear] = useState(initialState?.searchInfo?.Year);

    // MonthList                    :2
    const [ checkedList2, setCheckedList2] = useState(()=>{
        return [1,2,3,4,5,6,7,8,9,10,11,12];
    });
    const [ indeterminate2, setIndeterminate2] = useState(false);
    const [ checkAll2, setCheckAll2] = useState(true);
    // BizType1List                 :3
    const [ checkedList3, setCheckedList3] = useState(()=>{
        return [1,2,3,4,5,6,10,11,12,13,14];
    });
    const [ indeterminate3, setIndeterminate3] = useState(false);
    const [ checkAll3, setCheckAll3] = useState(true);
    // BizType2List                 :4
    const [ checkedList4, setCheckedList4] = useState(()=>{
        return [1,2,3,4,5,6];
    });
    const [ indeterminate4, setIndeterminate4] = useState(false);
    const [ checkAll4, setCheckAll4] = useState(true);
    // OceanTransportTypeList       :5
    const [ checkedList5, setCheckedList5] = useState(()=>{
        return [1,2,3,6,7];
    });
    const [ indeterminate5, setIndeterminate5] = useState(false);
    const [ checkAll5, setCheckAll5] = useState(true);


    /**
     * 第2个参数传 [] 相当于 componentDidMount 钩子
     */
    useEffect(() =>{
        console.log(PropsInfo == 1? "Month" : PropsInfo == 2? "CashFlow" : "ICProfit")
    },[]);

    /**
     * 单选
     * @param T
     * @param list 
     */
    const onChange =(T:Number,list:any) =>{
        switch(T){
            case 1:
                setCheckedList1(list);
                setIndeterminate1(!!list.length && list.length < YearList.length);
                setCheckAll1(list.length === YearList.length);
            break;
            case 2:
                setCheckedList2(list);
                setIndeterminate2(!!list.length && list.length < MonthList.length);
                setCheckAll2(list.length === MonthList.length);
            break;
            case 3:
                setCheckedList3(list);
                setIndeterminate3(!!list.length && list.length < BizType1List.length);
                setCheckAll3(list.length === BizType1List.length);
            break;
            case 4:
                setCheckedList4(list);
                setIndeterminate4(!!list.length && list.length < BizType2List.length);
                setCheckAll4(list.length === BizType2List.length);
            break;
            case 5:
                setCheckedList5(list);
                setIndeterminate5(!!list.length && list.length < OceanTransportTypeList.length);
                setCheckAll5(list.length === OceanTransportTypeList.length);
            break;
            default: return;
        }
    }

    /**
     * 全选
     * @param T 
     * @param e 
     */
    const onCheckAllChange =(T:Number,e:any) =>{
        switch(T){
            case 1:
                setCheckedList1(e.target.checked ? [2018,2019,2020] : []);
                setIndeterminate1(false);
                setCheckAll1(e.target.checked);
            break;
            case 2:
                setCheckedList2(e.target.checked ? [1,2,3,4,5,6,7,8,9,10,11,12] : []);
                setIndeterminate2(false);
                setCheckAll2(e.target.checked);
            break;
            case 3:
                setCheckedList3(e.target.checked ? [1,2,3,4,5,6,10,11,12,13,14] : []);
                setIndeterminate3(false);
                setCheckAll3(e.target.checked);
            break;
            case 4:
                setCheckedList4(e.target.checked ? [1,2,3,4,5,6] : []);
                setIndeterminate4(false);
                setCheckAll4(e.target.checked);
            break;
            case 5:
                setCheckedList5(e.target.checked ? [1,2,3,6,7] : []);
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
        setDrawerVisible(false)
    }

    /**
     * 确定搜索条件
     * 1、保存 搜索信息 + Tag 标签
     * 2、搜索
     * 3、关闭 Drawer
     */
    const onSearch = () => {
        //Step 1 <*如果页面的搜索条件不同,则下面的 searchInfo 可以根据 PropsInfo 来判断赋值>
        let searchInfo:object = {
            Year: year,
            YearList: checkedList1,
            MonthList: checkedList2,
            BizType1List: checkedList3,
            BizType2List: checkedList4,
            OceanTransportTypeList: checkedList5,
        };
        let searchResultList:object = {
            Year: year,
            YearList: transfromToTag(1,checkedList1,YearList),
            MonthList: transfromToTag(2,checkedList2,MonthList),
            BizType1List: transfromToTag(3,checkedList3,BizType1List),
            BizType2List: transfromToTag(4,checkedList4,BizType2List),
            OceanTransportTypeList: transfromToTag(5,checkedList5,OceanTransportTypeList),
        };
        setInitialState({
            ...initialState,
            searchInfo,
            searchResultList,
        });
        //Step 2 <页面中 useEffect 根据 initialState 判断动态搜索>

        //Step 3
        setDrawerVisible(false)
    }

    /**
     * 年份单选
     * @param e 
     */
    const onYearRadioChange = (e:any) => {
        setYear(e.target.value);
    }

    return (
        <>
            <Button type="primary" icon={<SearchOutlined />} className={styles.searchBtn}  onClick={()=> setDrawerVisible(true)}/>
            <Drawer
                title="请选择搜索条件"
                placement={"right"}
                closable={false}
                onClose={onClose}
                visible={DrawerVisible}
                key={"right"}
                footer={
                    <Button type="primary" style={{width:"100%"}} onClick={onSearch}>
                        确定
                    </Button>
                }
            >
                <>
                    {/* <div className={styles.searchArea}>
                        <Row className={styles.searchAreaLable}>
                            <Col span={12} className={styles.searchAreaTitle}>年份</Col>
                            <Col span={12}>
                                <Checkbox indeterminate={indeterminate1} onChange={(e) =>onCheckAllChange(1,e)} checked={checkAll1}>
                                    全选
                                </Checkbox>
                            </Col>
                        </Row>
                        <Checkbox.Group value={checkedList1} onChange={(list) =>onChange(1,list)}>
                            <Row className={styles.searchAreaContent}>
                                {
                                    YearList && YearList.length > 0 ? YearList.map( x=>{
                                        return <Col span={8} key={x.Key} style={{marginBottom:5,}}><Checkbox value={x.Key}>{x.Value}</Checkbox></Col>
                                    }) : null
                                }
                            </Row>
                        </Checkbox.Group>
                    </div> */}

                    <div className={styles.searchArea}>
                        <Row className={styles.searchAreaLable}>
                            <Col span={12} className={styles.searchAreaTitle}>年份</Col>
                        </Row>
                        <Radio.Group buttonStyle="solid" size="small" onChange={onYearRadioChange} defaultValue={year}>
                            <Row className={styles.searchAreaContent}>
                                {
                                    YearList && YearList.length > 0 ? YearList.map(x =>{
                                        return <Col span={8} key={x.Key} style={{marginBottom:5,}}><Radio.Button style={{width:"100%"}} key={x.Key} value={x.Key}>{x.Value}</Radio.Button></Col>
                                    }) : null
                                }
                            </Row>
                        </Radio.Group>
                    </div>

                    <div className={styles.searchArea}>
                        <Row className={styles.searchAreaLable}>
                            <Col span={12} className={styles.searchAreaTitle}>月份</Col>
                            <Checkbox indeterminate={indeterminate2} onChange={(e) =>onCheckAllChange(2,e)} checked={checkAll2}>
                                全选
                            </Checkbox>
                        </Row>
                        <Checkbox.Group value={checkedList2} onChange={(list) =>onChange(2,list)}>
                            <Row className={styles.searchAreaContent}>
                                {
                                    MonthList && MonthList.length > 0 ? MonthList.map( x=>{
                                        return <Col span={8} key={x.Key} style={{marginBottom:5,}}><Checkbox value={x.Key}>{x.Value}</Checkbox></Col>
                                    }) : null
                                }
                            </Row>
                        </Checkbox.Group>
                    </div>

                    <div className={styles.searchArea}>
                        <Row className={styles.searchAreaLable}>
                            <Col span={12} className={styles.searchAreaTitle}>运输类型</Col>
                            <Checkbox indeterminate={indeterminate3} onChange={(e) =>onCheckAllChange(3,e)} checked={checkAll3}>
                                全选
                            </Checkbox>
                        </Row>
                        <Checkbox.Group value={checkedList3} onChange={(list) =>onChange(3,list)}>
                            <Row className={styles.searchAreaContent}>
                                {
                                    BizType1List && BizType1List.length > 0 ? BizType1List.map( x=>{
                                        return <Col span={12} key={x.Key} style={{marginBottom:5,}}><Checkbox value={x.Key}>{x.Value}</Checkbox></Col>
                                    }) : null
                                }
                            </Row>
                        </Checkbox.Group>
                    </div>

                    <div className={styles.searchArea}>
                        <Row className={styles.searchAreaLable}>
                            <Col span={12} className={styles.searchAreaTitle}>贸易类型</Col>
                            <Checkbox indeterminate={indeterminate4} onChange={(e) =>onCheckAllChange(4,e)} checked={checkAll4}>
                                全选
                            </Checkbox>
                        </Row>
                        <Checkbox.Group value={checkedList4} onChange={(list) =>onChange(4,list)}>
                            <Row className={styles.searchAreaContent}>
                                {
                                    BizType2List && BizType2List.length > 0 ? BizType2List.map( x=>{
                                        return <Col span={12} key={x.Key} style={{marginBottom:5,}}><Checkbox value={x.Key}>{x.Value}</Checkbox></Col>
                                    }) : null
                                }
                            </Row>
                        </Checkbox.Group>
                    </div>

                    <div className={styles.searchArea}>
                        <Row className={styles.searchAreaLable}>
                            <Col span={12} className={styles.searchAreaTitle}>货物类型</Col>
                            <Checkbox indeterminate={indeterminate5} onChange={(e) =>onCheckAllChange(5,e)} checked={checkAll5}>
                                全选
                            </Checkbox>
                        </Row>
                        <Checkbox.Group value={checkedList5} onChange={(list) =>onChange(5,list)}>
                            <Row className={styles.searchAreaContent}>
                                {
                                    OceanTransportTypeList && OceanTransportTypeList.length > 0 ? OceanTransportTypeList.map( x=>{
                                        return <Col span={12} key={x.Key} style={{marginBottom:5,}}><Checkbox value={x.Key}>{x.Value}</Checkbox></Col>
                                    }) : null
                                }
                            </Row>
                        </Checkbox.Group>
                    </div>

                </>
            </Drawer>
        </>
    )
}

export default SearchButton;