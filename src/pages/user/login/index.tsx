import { Alert, message } from 'antd';
import React, { useState } from 'react';
import { useModel, history, History } from 'umi';
import { LoginParamsType, fakeAccountLogin } from '@/services/login';
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
  const [ userLoginState, setUserLoginState] = useState<API.LoginStateType>({});
  const [ submitting, setSubmitting] = useState(false);
  const { initialState, setInitialState } = useModel('@@initialState');
  
  const handleSubmit = async (values: LoginParamsType) => {
    setSubmitting(true);
    values = Object.assign({}, values,{SystemID:9});

    const result = await fakeAccountLogin({...values});
    if(result && result.Result){
      message.success('登录成功！');
      const currentUser = result.Content;
      let menuData:MenuDataItem[] = menu.menuData;
      setInitialState({
        ...initialState,
        currentUser,
        ...Object.assign(menuData),
      });
      replaceGoto();
      return;
    }else{
      message.success(result.Content);
    }
    setSubmitting(false);
  };

  const { Result } = userLoginState;

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