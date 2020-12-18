import React, { useState, useEffect, useContext, } from 'react';
import { Button, Drawer, Checkbox, Row, Col, } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import styles from './index.less';
//引入自定义方法
import { getYearList, } from '@/utils/utils';
//引入基础数据
import { MonthList, BizType1List, BizType2List, OceanTransportTypeList, } from '@/utils/baseData';

import ContextProps from '@/createContext';

const SearchButton: React.FC<{}> = ({}) => {
    const PropsInfo = useContext(ContextProps);     //得到父组件过来的值
    const [ YearList, ] = useState(()=>{
        return getYearList();
    });
    const [ DrawerVisible, setDrawerVisible] = useState(false);

    /**
     * 第2个参数传 [] 相当于 componentDidMount 钩子
     */
    useEffect(() =>{
        console.log(PropsInfo == 1? "Month" : PropsInfo == 2? "CashFlow" : "ICProfit")
    },[]);

    /**
     * 关闭 Drawer
     */
    const onClose = () => {
        setDrawerVisible(false)
    }

    return (
        <>
            <Button type="primary" icon={<SearchOutlined />} className={styles.searchBtn}  onClick={ ()=> setDrawerVisible(true)}/>
            <Drawer
                title="请选择搜索条件"
                placement={"right"}
                closable={false}
                onClose={onClose}
                visible={DrawerVisible}
                key={"right"}
                footer={
                    <Button type="primary" style={{width:"100%"}}>
                        确定
                    </Button>
                }
            >
                <>
                    <Checkbox.Group className={styles.searchArea}>
                        <Row className={styles.searchAreaLable}>
                            <Col span={12} className={styles.searchAreaTitle}>年份</Col>
                            <Col span={12}>
                                全选
                            </Col>
                        </Row>
                        <Row className={styles.searchAreaContent}>
                            {
                                YearList && YearList.length > 0 ? YearList.map( x=>{
                                    return <Col span={8} key={x.key} style={{marginBottom:5,}}><Checkbox value={x.key}>{x.value}</Checkbox></Col>
                                }) : null
                            }
                        </Row>
                    </Checkbox.Group>

                    <Checkbox.Group className={styles.searchArea}>
                        <Row className={styles.searchAreaLable}>
                            <Col span={12} className={styles.searchAreaTitle}>月份</Col>
                            <Col span={12}>
                                全选
                            </Col>
                        </Row>
                        <Row className={styles.searchAreaContent}>
                            {
                                MonthList && MonthList.length > 0 ? MonthList.map( x=>{
                                    return <Col span={8} key={x.key} style={{marginBottom:5,}}><Checkbox value={x.key}>{x.value}</Checkbox></Col>
                                }) : null
                            }
                        </Row>
                    </Checkbox.Group>

                    <Checkbox.Group className={styles.searchArea}>
                        <Row className={styles.searchAreaLable}>
                            <Col span={12} className={styles.searchAreaTitle}>运输类型</Col>
                            <Col span={12}>
                                全选
                            </Col>
                        </Row>
                        <Row className={styles.searchAreaContent}>
                            {
                                BizType1List && BizType1List.length > 0 ? BizType1List.map( x=>{
                                    return <Col span={12} key={x.key} style={{marginBottom:5,}}><Checkbox value={x.key}>{x.value}</Checkbox></Col>
                                }) : null
                            }
                        </Row>
                    </Checkbox.Group>

                    <Checkbox.Group className={styles.searchArea}>
                        <Row className={styles.searchAreaLable}>
                            <Col span={12} className={styles.searchAreaTitle}>贸易类型</Col>
                            <Col span={12}>
                                全选
                            </Col>
                        </Row>
                        <Row className={styles.searchAreaContent}>
                            {
                                BizType2List && BizType2List.length > 0 ? BizType2List.map( x=>{
                                    return <Col span={12} key={x.key} style={{marginBottom:5,}}><Checkbox value={x.key}>{x.value}</Checkbox></Col>
                                }) : null
                            }
                        </Row>
                    </Checkbox.Group>

                    <Checkbox.Group className={styles.searchArea}>
                        <Row className={styles.searchAreaLable}>
                            <Col span={12} className={styles.searchAreaTitle}>货物类型</Col>
                            <Col span={12}>
                                全选
                            </Col>
                        </Row>
                        <Row className={styles.searchAreaContent}>
                            {
                                OceanTransportTypeList && OceanTransportTypeList.length > 0 ? OceanTransportTypeList.map( x=>{
                                    return <Col span={12} key={x.key} style={{marginBottom:5,}}><Checkbox value={x.key}>{x.value}</Checkbox></Col>
                                }) : null
                            }
                        </Row>
                    </Checkbox.Group>
                </>
            </Drawer>
        </>
    )
}

export default SearchButton;