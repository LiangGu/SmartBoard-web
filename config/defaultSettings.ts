import { LogoutOutlined } from '@ant-design/icons';
import { Settings as LayoutSettings } from '@ant-design/pro-layout';
export default {
  // logo: '',
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
  iconfontUrl: '',
  splitMenus: true,
  // collapsed: true,
} as LayoutSettings & {
  pwa: boolean;
  menuRender: true,
};