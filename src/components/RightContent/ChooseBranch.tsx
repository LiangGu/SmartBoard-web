import React,{ useState, useEffect } from 'react';
import { useModel } from 'umi';
import { Drawer, Button, Radio, Row, Col, } from 'antd';
import styles from './index.less';
//引入基础数据
import { BranchList } from '@/utils/baseData';

const ChooseBranch: React.FC<{}> = () => {
    const { initialState, setInitialState } = useModel('@@initialState');
    const [ DrawerVisible, setDrawerVisible] = useState(false);
    const [ SelectBranchID, setSelectBranchID] = useState(initialState?.currentUser?.BranchID);

    /**
     * 第2个参数传 [] 相当于 componentDidMount 钩子
     */
    useEffect(() =>{
        console.log(BranchList,initialState)
    },[]);

    /**
     * 点击切换公司
     */
    const onMenuClick = () => {
        setDrawerVisible(true)
    }

    /**
     * 修改 BranchID 并关闭 Drawer
     */
    const onClose = () => {
        console.log(SelectBranchID,initialState)
        setInitialState({
            ...initialState,
            currentUser: Object.assign({},initialState?.currentUser,{BranchID:SelectBranchID})

        });
        setDrawerVisible(false)
    }

    /**
     * 点击选择公司
     */
    const onChange = (e:any) => {
        setSelectBranchID(e.target.value)
    }

    return (
        <div>
            <Button
                className={styles.switchBranchBtn}
                shape="round"
                type="dashed"
                onClick={onMenuClick}
            >
                切换公司
            </Button>

            <Drawer
                title="请选择公司"
                placement={"right"}
                closable={false}
                // maskClosable={false}
                onClose={onClose}
                visible={DrawerVisible}
                key={"right"}
                width={200}
            >
                <Radio.Group onChange={onChange} defaultValue={SelectBranchID}>
                    <Row>
                        {
                            BranchList && BranchList.length > 0 ? BranchList.map(x =>{
                                return <Col span={24} key={x.key} style={{marginBottom:10,}}><Radio.Button style={{width:"100%"}} key={x.key} value={x.key}>{x.value}</Radio.Button></Col>
                            }) : null
                        }
                    </Row>

                </Radio.Group>

            </Drawer>
        </div>
    )
}

export default ChooseBranch;