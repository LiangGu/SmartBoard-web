import { Settings as LayoutSettings } from '@ant-design/pro-layout';

export default {
  navTheme: 'dark',
  // 拂晓蓝
  primaryColor: '#1890ff',
  layout: 'mix',
  splitMenus: true,
  contentWidth: 'Fluid',
  fixedHeader: true,
  fixSiderbar: true,
  menu: {
    locale: true,
  },
  title: 'Smart Board',
  pwa: false,
  iconfontUrl: '',
} as LayoutSettings & {
  pwa: boolean;
  menuRender: true,
};