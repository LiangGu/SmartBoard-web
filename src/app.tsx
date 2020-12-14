import React from 'react';
import { BasicLayoutProps, Settings as LayoutSettings, MenuDataItem} from '@ant-design/pro-layout';
import { notification } from 'antd';
import { history, RequestConfig,} from 'umi';
import RightContent from '@/components/RightContent';
// import Footer from '@/components/Footer';
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
  menuData?: MenuDataItem[];
}> {
  // 如果是登录页面，不执行
  if (history.location.pathname !== '/user/login') {
    return {
      settings: defaultSettings,
    };
  }
  return {
    settings: defaultSettings,
  };
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
      // 如果没有登录，重定向到 login
      if (!currentUser && location.pathname !== '/user/login') {
        history.push('/user/login');
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
};

/**
 * 异常处理程序
 */
const errorHandler = (error: ResponseError) => {
  const { response } = error;
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;

    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });
  }

  if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }
  throw error;
};

const requestInterceptors = (  url: string, options: RequestOptionsInit ) => {
  const token:string = '';
  const opt:RequestOptionsInit = options;
  opt.headers = {
    ...options.headers,
    token,
    // fromType: 'itrip-admin',
  };
  return {
    url: `${url}`,
    options: { ...options , interceptors: true},
  };    
}

const responseInterceptors = (response: Response, options: RequestOptionsInit) => {
  // const contentType = response.headers.get('Content-Type');
  return response;
}

export const request: RequestConfig = {
  timeout: 1000,
  // credentials: 'include', //默认请求是否带上Cookie
  errorConfig: {
    adaptor: (resData) => {
      return {
        ...resData,
        success: resData.Result,
        errorMessage: resData.Content,
      };
    },
  },
  // errorConfig: {},
  middlewares: [],
  errorHandler,
  requestInterceptors: [requestInterceptors],
  responseInterceptors: [responseInterceptors],
};