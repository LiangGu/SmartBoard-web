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
        // {
        //   path: '/home',
        //   name: 'home',
        //   icon:  'HomeOutlined',
        //   // access: 'canAdmin',
        //   component: './Home/Home',
        // },
        {
          path: '/volume',
          name: 'volume',
          icon: 'BarChartOutlined',
          // access: 'canAdmin',
          routes: [
            {
              path: '/volume/month',
              name: 'month',
              icon: 'BarChartOutlined',
              component: './Volume/components/Month',
            },
            {
              path: '/volume/port',
              name: 'port',
              icon: 'BarChartOutlined',
              component: './Volume/components/Port',
            },
          ],
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
          redirect: './volume',
        },
        {
          component: './404',
        },
    ],
}