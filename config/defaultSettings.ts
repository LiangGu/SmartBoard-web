import { Settings as LayoutSettings } from '@ant-design/pro-layout';
// import logo from '../public/logo.svg';
export default {
  navTheme: 'dark',
  // 拂晓蓝
  primaryColor: '#1890ff',
  layout: 'mix',
  contentWidth: 'Fluid',
  // contentWidth: 'Fixed',
  fixedHeader: false,
  fixSiderbar: true,
  menu: {
    locale: true,
    // defaultOpenAll: true
  },
  title: 'Smart Board',
  pwa: false,
  logo: 'https://preview.pro.ant.design/static/logo.f0355d39.svg',
  iconfontUrl: '',
  splitMenus: true,
  // collapsed: true,
} as LayoutSettings & {
  pwa: boolean;
  menuRender: true,
};