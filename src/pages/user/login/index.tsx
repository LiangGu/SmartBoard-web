import Global from '@/global.d';
import { Alert, message } from 'antd';
import React, { useState } from 'react';
import { useModel, history, History } from 'umi';
import { LoginParamsType, login } from '@/services/login';
import LoginFrom from './components/Login';
import styles from './style.less';
import menu from '@/../config/menu';
import { MenuDataItem } from '@umijs/route-utils';
import { BranchList } from '@/utils/baseData';
import { setSystemMes } from '@/utils/auths';
// 引入图标
import logo from '@/assets/logo.svg';
import CN from '@/assets/loginPage/SMARTBOARDCN.svg';
import EN from '@/assets/loginPage/SMARTBOARDEN.svg';

const { Username, Password, Submit } = LoginFrom;

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{ marginBottom: 24, }}
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
  const [response, setResponse] = useState<API.ResponseType>({});
  const [submitting, setSubmitting] = useState(false);
  const { initialState, setInitialState } = useModel('@@initialState');

  const handleSubmit = async (values: LoginParamsType) => {
    setSubmitting(true);
    let resultOfLoginInfo: API.ResponseType;
    try {
      // 登录
      values.SystemID = 9;
      resultOfLoginInfo = await login({ ...values });
      if (resultOfLoginInfo.Result == true && initialState) {
        message.success('登录成功！');
        // 登录成功后再去后台取公司列表








        //当前登录用户信息
        let currentUser: API.CurrentUser = resultOfLoginInfo.Content;
        let menuData: MenuDataItem[] = menu.menuData;
        //让系统实时查询
        let searchInfo: object = Object.assign({}, {
          UpdateIndex: new Date().getTime(),
          MonthList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
          BizType1List: [1, 2, 3, 4, 5, 6, 10, 11, 12, 13, 14],
          BizType2List: [1, 2, 3, 4, 5, 6],
        });
        setInitialState({
          ...initialState,
          currentUser,
          searchInfo,
          ...Object.assign(menuData),
        });
        let sysSaveData: Global.SessionSysSave = {
          userName: currentUser.DisplayName,
          userID: currentUser.ID.toString(),
          branchID: currentUser.BranchID.toString(),
          branchCode: currentUser.BranchCode,
          token: currentUser.Token,
          funcCurrency: currentUser.FuncCurrency,
          //将选择的年份和公司信息<会变化的数据>存在Session,防止用户刷新出现问题
          selectBranchID: resultOfLoginInfo.Content.BranchID == 1 ? 0 : resultOfLoginInfo.Content.BranchID,      //总部BranchID传0
          selectBranchName: resultOfLoginInfo.Content.BranchID == 1 ? "香港外运(总部)" : BranchList.find(x => x.Key == resultOfLoginInfo.Content.BranchID)?.Value || '',      //总部公司名显示:香港外运(总部)
          selectYear: new Date().getFullYear().toString(),
          selectOceanTransportType: '0',      //默认不限制
        }
        setSystemMes(sysSaveData);
        replaceGoto();
        return;
      }
      // 如果失败去设置用户错误信息
      setResponse(resultOfLoginInfo);
    } catch (error) {
    }
    setSubmitting(false);
  };

  const { Result } = response;

  return (
    <div className={styles.MainDiv}>
      <div className={styles.Filter}></div>
      <div className={styles.LeftDiv}>
        <img className={styles.Logo} alt="logo" src={logo} />
        <img className={styles.LogoCN} alt="logo" src={CN} />
        <img className={styles.LogoEN} alt="logo" src={EN} />
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