import Global from '@/global.d';
import React,{ useState, } from 'react';
import { Drawer, Button, Radio, Row, Col, } from 'antd';
import styles from './index.less';
//引入基础数据
import { BranchList } from '@/utils/baseData';
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
} from '@/utils/auths';
const ChooseBranch: React.FC<{}> = () => {
    const [ DrawerVisible, setDrawerVisible] = useState(false);
    const [ SelectBranchID,] = useState(() =>{
        // 惰性赋值 any 类型,要不默认值不起作用
        let selectBranchID:any = getselectBranchID();
        return selectBranchID;
    });

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
        // 重置 Session 中的数据
        let userName:any = getUserName();
        let userID:any = getUserID();
        let branchID:any = getBranchID();
        let branchCode:any = getBranchCode();
        let token:any = getToken();
        let funcCurrency:any = getFuncCurr();
        let selectYear:any = getselectYear();
        let sysSaveData: Global.SessionSysSave = {
            userName: userName,
            userID: userID,
            branchID: branchID,
            branchCode: branchCode,
            token: token,
            funcCurrency: funcCurrency,
            // 保存到 Session 中,防止页面刷新数据丢失
            selectBranchID: e.target.value,
            selectBranchName: BranchList.find( x => x.Key == e.target.value)?.Value || '',
            selectYear: selectYear,
        }
        setSystemMes(sysSaveData);
        setDrawerVisible(false)
    }
    
    console.log(SelectBranchID)

    return (
        <div>
            <Button
                className={styles.switchBranchBtn}
                shape="round"
                type="dashed"
                onClick={onMenuClick}
            >
                {getselectBranchName()}
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
                <Radio.Group buttonStyle="solid" onChange={onChange} defaultValue={parseInt(SelectBranchID)}>
                    <Row>
                        {
                            BranchList && BranchList.length > 0 ? BranchList.map(x =>{
                                return <Col span={24} key={x.Key} style={{marginBottom:10,}}><Radio.Button style={{width:"100%"}} key={x.Key} value={x.Key}>{x.Value}</Radio.Button></Col>
                            }) : null
                        }
                    </Row>
                </Radio.Group>

            </Drawer>
        </div>
    )
}

export default ChooseBranch;