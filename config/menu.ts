export default {
    menuData:[
        {
          path: '/user',
          layout: false,
          routes: [
            {
              name: 'login',
              path: '/user/login',
              component: './user/login',
            },
          ],
        },
        {
          path: '/home',
          name: 'home',
          icon:  'HomeOutlined',
          // access: 'canAdmin',
          component: './Home/Home',
        },
        {
          path: '/volume',
          name: 'volume',
          icon: 'BarChartOutlined',
          // access: 'canAdmin',
          component: './Volume/volume',
        },
        {
          path: '/icprofit',
          name: 'icprofit',
          icon: 'MoneyCollectOutlined',
          component: './ICProfit/ICProfit',
        },
        {
          path: '/cashflow',
          name: 'cashflow',
          icon: 'LineChartOutlined',
          component: './CashFlow/CashFlow',
        },
        {
          path: '/debt',
          name: 'debt',
          icon: 'TransactionOutlined',
          component: './Debt/Debt',
        },
        {
          path: '/rank',
          name: 'rank',
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