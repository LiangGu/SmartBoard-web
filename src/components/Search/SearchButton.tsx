import React,{ useState, useEffect } from 'react';
import { useModel } from 'umi';
import { Button,} from 'antd';
import styles from './index.less';
//引入基础数据
import { BranchList } from '@/utils/baseData';

const SearchButton: React.FC<{}> = () => {
    const { initialState, setInitialState } = useModel('@@initialState');
    const [ DrawerVisible, setDrawerVisible] = useState(false);
    const [ SelectBranchID, setSelectBranchID] = useState(initialState?.currentBranch?.BranchID);

    /**
     * 第2个参数传 [] 相当于 componentDidMount 钩子
     */
    useEffect(() =>{
        console.log(BranchList,initialState)
    },[]);


    return (
        <>
          <Button>
              搜索
          </Button>
        </>
    )
}

export default SearchButton;