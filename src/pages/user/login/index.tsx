import { Alert, message } from 'antd';
import React, { useState } from 'react';
import { useModel, history, History } from 'umi';
import { LoginParamsType, login } from '@/services/login';
import LoginFrom from './components/Login';
import styles from './style.less';
import menu from '@/../config/menu';
import { MenuDataItem } from '@umijs/route-utils';
// 引入图标
import logo from '@/assets/logo.svg';
import CN from '@/assets/loginPage/SMARTBOARDCN.svg';
import EN from '@/assets/loginPage/SMARTBOARDEN.svg';

const { Username, Password, Submit } = LoginFrom;

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{marginBottom: 24,}}
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
  const [ response, setResponse] = useState<API.ResponseType>({});
  const [ submitting, setSubmitting] = useState(false);
  const { initialState, setInitialState } = useModel('@@initialState');
  
  const handleSubmit = async (values: LoginParamsType) => {
    setSubmitting(true);
    let res:API.ResponseType;
    try {
      // 登录
      values.SystemID = 9;
      res = await login({ ...values});
      console.log('res => ', res);
      if (res.Result == true && initialState) {
        message.success('登录成功！');
        let currentUser: API.CurrentUser | undefined = res.Content;
        let menuData:MenuDataItem[] = menu.menuData;
        
        setInitialState({
          ...initialState,
          currentUser,
          ...Object.assign(menuData),
        });
        sessionStorage.setItem('TOKEN', currentUser?.Token??'')
        replaceGoto();
        return;
      }
      // 如果失败去设置用户错误信息
      setResponse(res);
    } catch (error) {
    }
    setSubmitting(false);
  };

  const { Result } = response;

  return (
    <div className={styles.MainDiv}>
      <div className={styles.Filter}></div>
        <div className={styles.LeftDiv}>
            <img className={styles.Logo} alt="logo" src={logo}/>
            <img className={styles.LogoCN} alt="logo" src={CN}/>
            <img className={styles.LogoEN} alt="logo" src={EN}/>
        </div>
        <div className={styles.RightDiv}>
            <LoginFrom onSubmit={handleSubmit}>
                <div>
                    {
                      Result == false && !submitting && (<LoginMessage content="账户或密码错误" />)
                    }
                    <p className={styles.MainTitle}>{"登录您的账号"}</p>
                    <Username
                        className={styles.InputT}
                        name="LoginName"
                        placeholder={'请输入用户名!'}
                    />
                    <Password
                        className={styles.InputB}
                        name="Password"
                        placeholder={'请输入密码！'}
                    />
                </div>
                <Submit loading={submitting} className={styles.LoginBtn}>登录</Submit>
            </LoginFrom>
      </div>
    </div>
  );
};

export default Login;