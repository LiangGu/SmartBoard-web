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
     * 保存选择的公司
     * 修改 BranchID 并关闭 Drawer
     */
    const onSaveChooseBranch = () => {
        console.log(SelectBranchID,initialState)



        setInitialState({
            // SelectBranchID,

        });
        setDrawerVisible(false);
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
                placement={"left"}
                closable={false}
                maskClosable={false}
                visible={DrawerVisible}
                key={"left"}
                width={200}
                footer={
                    <Button className={styles.saveBranchBtn} onClick={onSaveChooseBranch}>确定</Button>
                }
            >
                <Radio.Group onChange={onChange} defaultValue={SelectBranchID}>
                    <Row>
                        {
                            BranchList && BranchList.length > 0 ? BranchList.map(x =>{
                                return <Col span={24} key={x.key} style={{marginBottom:10}}><Radio.Button key={x.key} value={x.key}>{x.value}</Radio.Button></Col>
                            }) : null
                        }
                    </Row>

                </Radio.Group>

            </Drawer>
        </div>
    )
}

export default ChooseBranch;