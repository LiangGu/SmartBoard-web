// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
import menu from './menu';

const { REACT_APP_ENV } = process.env;

export default defineConfig({
    hash: true,
    antd: {
        dark: false,    // 开启暗色主题
        compact: true,  // 开启紧凑主题
    },
    dva: {
        hmr: true,
    },
    layout: {
        name: 'SMART BOARD',
        locale: true,
        defaultSettings,
    },
    locale: {
        default: 'zh-CN',
        antd: true,
        baseNavigator: true,
    },
    dynamicImport: {
        loading: '@/components/PageLoading/index',
    },
    targets: {
        ie: 11,
    },
    routes: menu.menuData,
    theme: {
        'primary-color': defaultSettings['primaryColor'],
    },
    // @ts-ignore
    title: false,
    ignoreMomentLocale: true,
    proxy: proxy[REACT_APP_ENV || 'dev'],
    manifest: {
        basePath: '/',
    },
});