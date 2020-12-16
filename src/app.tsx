import React from 'react';
import { BasicLayoutProps, Settings as LayoutSettings, MenuDataItem, SettingDrawerProps} from '@ant-design/pro-layout';
import { notification } from 'antd';
import { history, RequestConfig } from 'umi';
import RightContent from '@/components/RightContent';
import { RequestOptionsInit, ResponseError } from 'umi-request';
import defaultSettings from '../config/defaultSettings';
import menu from '../config/menu';
import {extend} from '@/utils/utils';
import {
  SmileOutlined,
  HeartOutlined,
  UserOutlined,
  TableOutlined,
  HomeOutlined,
  BarChartOutlined,
  MoneyCollectOutlined,
  LineChartOutlined,
  TransactionOutlined,
} from '@ant-design/icons';
import logo from '@/assets/logo.svg'
export async function getInitialState(): Promise<{
  settings?: LayoutSettings;
  currentUser?: API.CurrentUser;
  currentBranch?: API.SelectBranchInfo;
  menuData?: MenuDataItem[];
  settingDrawer?: SettingDrawerProps;
}> {
  try{
    // 如果是登录页面，不执行
    if (history.location.pathname !== '/user/login') {
      return {
        settings: defaultSettings,
        settingDrawer: {
          hideCopyButton: true,
          hideHintAlert: true
        }
      };
    }else{
      
    }
  }catch(error){
    history.push('/login');
  }
  
  return {  settings: defaultSettings };
}

const IconMap = {
  SmileOutlined: <SmileOutlined />,
  HeartOutlined: <HeartOutlined />,
  UserOutlined: <UserOutlined />,
  TableOutlined: <TableOutlined />,
  HomeOutlined: <HomeOutlined />,
  BarChartOutlined :<BarChartOutlined />,
  MoneyCollectOutlined: <MoneyCollectOutlined />,
  LineChartOutlined: <LineChartOutlined />,
  TransactionOutlined: <TransactionOutlined />,
  //如何使用自定义的图标?
  // Home: <img src={require('../src/assets/menuIcon/home.svg')} style={{width: '1em', height: '1em',marginBottom: 5}}/>
};

const loopMenuItem = (menus: MenuDataItem[]): MenuDataItem[] =>(
  menus.map(({ icon, routes, ...item }) => {
    return {
      ...item,
      icon: icon && IconMap[icon as string],
      children: routes && loopMenuItem(routes),
    }
  })
);

//layout
export const layout = ({
  initialState,
}:{
    initialState: { settings?: LayoutSettings; currentUser?: API.CurrentUser; menuData?: MenuDataItem[];};
  }): BasicLayoutProps => {
  let menuData:MenuDataItem[] = menu.menuData;
  if(initialState && initialState.menuData){
    menuData = [];
    extend(menuData, initialState.menuData);
  }
  menuData = loopMenuItem(menuData);
  return {
    menuDataRender: () => {
      return Object.assign(menuData)
    },
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    footerRender: () => false,
    onPageChange: () => {
      const { currentUser } = initialState;
      const { location } = history;
      // 如果没有登录,重定向到 login
      if (!currentUser && location.pathname !== '/user/login') {
        history.push('/user/login');
      }
      // 如果用户点击 '货量' 页面,自动定向到 '货量月份' 页面
      if(location.pathname == '/volume'){
        history.push('/volume/month');
      }
    },
    
    menuHeaderRender: false,
    logo: logo,
    ...initialState?.settings,
  };
};

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  405: '请求方法不被允许。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
  'U001':'密码错误',
  'U002':'用户没有登录权限',
  'U003':'你的账号已被冻结',
  'U004':'用户名不存在',
  'U005':'您输入的原始密码有误',
  'U006':'用户信息异常',
};

/**
 * 异常处理程序
 */
const errorHandler = (error: ResponseError) => {
  const { data } = error;
  console.log(123);
  if (data && !data.Result) {
    const errorText = codeMessage[data.Content] || data.Content;
    notification.error({
      message: `请求错误 ${status}: ${data.Content}`,
      description: errorText,
    });
  }

  if (!data) {
    notification.error({
      description: '您的网络发生异常,无法连接服务器',
      message: '网络异常',
    });
  }
  throw error;
};

const jwtInterceptors = (  url: string, options: RequestOptionsInit ) => {
  // 判断是否有 token
  const token:string|null = sessionStorage.getItem('TOKEN');
  if (token) {
    return {
      url,
      options: {
        ...options,
        interceptors: true,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        },
      },
    };
  }else{
    history.push('/user/login');
  }
  return {
    url: `${url}`,
    options: { ...options , interceptors: true},
  };    
}

const responseInterceptors = (response: Response, options: RequestOptionsInit) => {
  const {ok, status} = response
  if (!ok) {
    // message.error(msg);
    if (status === 500) {}
    if (status === 401) {
      localStorage.clear();
      history.push('/user/login');
    }
    if (status === 403) {}
  }
  return response;
}

export const request: RequestConfig = {
  timeout: 1000,
  // credentials: 'include', //默认请求是否带上Cookie
  errorConfig: {
    adaptor: (resData:any) => {
      return {
        ...resData,
        success: resData.Result,
        errorMessage: resData.Content,
      };
    },
  },
  middlewares: [],
  errorHandler,
  requestInterceptors: [jwtInterceptors,],
  responseInterceptors: [responseInterceptors],
};