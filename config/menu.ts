export default {
    menuData:[
        {
          path: '/user',
          layout: false,
          routes: [
            {
              name: '登录',
              path: '/user/login',
              component: './user/login',
            },
          ],
        },
        {
          path: '/home',
          name: '主页',
          icon:  'HomeOutlined',
          // access: 'canAdmin',
          component: './Home/Home',
        },
        {
          path: '/volume',
          name: '货量分析',
          icon: 'BarChartOutlined',
          // access: 'canAdmin',
          component: './Volume/volume',
        },
        {
          path: '/icprofit',
          name: '收支利润',
          icon: 'MoneyCollectOutlined',
          component: './ICProfit/ICProfit',
        },
        {
          path: '/cashflow',
          name: '现金流',
          icon: 'LineChartOutlined',
          component: './CashFlow/CashFlow',
        },
        {
          path: '/debt',
          name: '应收账款',
          icon: 'TransactionOutlined',
          component: './Debt/Debt',
        },
        {
          path: '/rank',
          name: '客户分析',
          icon: 'UserOutlined',
          component: './Rank/Rank',
        },
        {
          path: '/',
          redirect: './home',
        },
        {
          component: './404',
        },
    ],
}