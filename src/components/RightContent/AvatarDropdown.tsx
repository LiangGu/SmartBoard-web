import React, { useCallback } from 'react';
import { LogoutOutlined,} from '@ant-design/icons';
import { Menu, Spin } from 'antd';
import { history, useModel } from 'umi';
import { outLogin } from '@/services/login';
import { setSystemMes, getUserName, getBranchID, getselectBranchName,} from '@/utils/auths';
import { stringify } from 'querystring';
import styles from './index.less';
//引入组件
import HeaderDropdown from '../HeaderDropdown';
import ChooseBranch from '../RightContent/ChooseBranch';


export interface GlobalHeaderRightProps {
  menu?: boolean;
}

/**
 * 退出登录,并且将当前的 url 保存
 */
const loginOut = async () => {
  await outLogin();
  const { query, pathname } = history.location;
  const redirect  = query?.redirect;
  // Note: There may be security issues, please note
  if (window.location.pathname !== '/user/login' && !redirect) {
    history.replace({
      pathname: '/user/login',
      search: stringify({
        redirect: pathname,
      }),
    });
  }
};

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu }) => {
  const { initialState, setInitialState } = useModel('@@initialState');

  const onMenuClick = useCallback(
    (event: {
      key: React.Key;
      keyPath: React.Key[];
      item: React.ReactInstance;
      domEvent: React.MouseEvent<HTMLElement>;
    }) => {
      const { key } = event;
      if (key === 'logout' && initialState) {
        // 清空 InitialState
        setInitialState({
          ...initialState,
          currentUser: undefined,
          searchInfo: undefined,
        });
        setSystemMes(undefined);
        loginOut();
        return;
      }
      history.push(`/account/${key}`);
    },
    [],
  );

  const loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin 
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }
  
  const displayName:string | null = getUserName();
  const branchID:string | null = getBranchID();
  const branchName:string | null = getselectBranchName();

  if (!displayName || !branchID || !branchName) {
    return loading;
  }

  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      <Menu.Item key="logout">
        <LogoutOutlined />
        退出登录
      </Menu.Item>
    </Menu>
  );
  return (
    <div className={styles.right}>
        {/* 总部人员登录可以选择公司 */}
        {/* {
          branchID == '1'?
          <>
            <ChooseBranch/>
          </> : null
        } */}
        <HeaderDropdown overlay={menuHeaderDropdown}>
          <span className={`${styles.action} ${styles.account}`}>
            <span className={`${styles.name} anticon`}>{displayName}</span>
          </span>
        </HeaderDropdown>
    </div>
  );
};

export default AvatarDropdown;