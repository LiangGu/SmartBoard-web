import { Alert, message } from 'antd';
import React, { useState } from 'react';
import { Link, useModel, history, History } from 'umi';
import logo from '@/assets/logo.svg';
import { LoginParamsType, fakeAccountLogin } from '@/services/login';
import Footer from '@/components/Footer';
import LoginFrom from './components/Login';
import styles from './style.less';
import menu from '@/../config/menu';
import { MenuDataItem } from '@umijs/route-utils';

const { Username, Password, Submit } = LoginFrom;

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

/**
 * 此方法会跳转到 redirect 参数所在的位置
 */
const replaceGoto = () => {
  setTimeout(() => {
    const { query } = history.location;
    const { redirect } = query as { redirect: string };
    if (!redirect) {
      history.replace('/');
      return;
    }
    (history as History).replace(redirect);
  }, 10);
};

const Login: React.FC<{}> = () => {
  const [userLoginState, setUserLoginState] = useState<API.LoginStateType>({});
  const [submitting, setSubmitting] = useState(false);
  const { initialState, setInitialState } = useModel('@@initialState');
  const [type, setType] = useState<string>('account');
  const handleSubmit = async (values: LoginParamsType) => {
    setSubmitting(true);
    try {
      // 登录
      const msg = await fakeAccountLogin({ ...values, type });
      if (msg.status === 'ok' && initialState) {
        message.success('登录成功！');
        const currentUser = await initialState?.fetchUserInfo();
        let menuData:MenuDataItem[] = menu.menuData;
        setInitialState({
          ...initialState,
          currentUser,
          ...Object.assign(menuData), //在登录时，先存上MenuData到State中，后期触发事件去更改State中的MenuData以刷新页面菜单内容。
        });
        replaceGoto();
        return;
      }
      // 如果失败去设置用户错误信息
      setUserLoginState(msg);
    } catch (error) {
      message.error('登录失败，请重试！');
    }
    setSubmitting(false);
  };

  const { status, type: loginType } = userLoginState;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.top}>
          <div className={styles.header}>
            <Link to="/">
              <img alt="logo" className={styles.logo} src={logo} />
              <span className={styles.title}>PTS</span>
            </Link>
          </div>
          <div className={styles.desc}>Pack Transportation System</div>
        </div>

        <div className={styles.main}>
          <LoginFrom activeKey={type} onTabChange={setType} onSubmit={handleSubmit}>
            <div>
              {status === 'error' && loginType === 'account' && !submitting && (
                <LoginMessage content="账户或密码错误" />
              )}

              <Username
                name="username"
                placeholder="用户名"
                rules={[
                  {
                    required: true,
                    message: '请输入用户名!',
                  },
                ]}
              />
              <Password
                name="password"
                placeholder="密码"
                rules={[
                  {
                    required: true,
                    message: '请输入密码！',
                  },
                ]}
              />
            </div>
            <Submit loading={submitting} style={{top:-20}}>登录</Submit>
          </LoginFrom>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
