import React,{ useState, useEffect } from 'react';
import { useModel } from 'umi';
import { Drawer, Button, Radio, Row, Col, } from 'antd';
import styles from './index.less';
//引入基础数据
import { BranchList } from '@/utils/baseData';

const ChooseBranch: React.FC<{}> = () => {
    const { initialState, setInitialState } = useModel('@@initialState');
    const [ DrawerVisible, setDrawerVisible] = useState(false);
    const [ SelectBranchID, setSelectBranchID] = useState(initialState?.currentBranch?.BranchID);

    /**
     * 第2个参数传 [] 相当于 componentDidMount 钩子
     */
    useEffect(() =>{
        // console.log(BranchList,initialState)
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
        setDrawerVisible(false)
    }

    /**
     * 点击选择公司
     */
    const onChange = (e:any) => {
        const selectBranchName:string | undefined = BranchList.find( x => x.key == e.target.value)?.value;
        setInitialState({
            ...initialState,
            //保存总部人员选择的公司ID
            currentBranch: Object.assign({},initialState?.currentBranch,{BranchID:e.target.value,BranchName:selectBranchName},)
        });
        setDrawerVisible(false)

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