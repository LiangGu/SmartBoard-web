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
          icon: 'TableOutlined',
          // access: 'canAdmin',
          component: './Home/Home',
        },
        {
          path: '/volume',
          name: 'volume',
          icon: 'TableOutlined',
          // access: 'canAdmin',
          component: './Volume/volume',
        },
        {
          path: '/icprofit',
          name: 'icprofit',
          icon: 'TableOutlined',
          component: './ICProfit/ICProfit',
        },
        {
          path: '/cashflow',
          name: 'cashflow',
          icon: 'TableOutlined',
          component: './CashFlow/CashFlow',
        },
        {
          path: '/debt',
          name: 'debt',
          icon: 'TableOutlined',
          component: './Debt/Debt',
        },
        {
          path: '/rank',
          name: 'rank',
          icon: 'TableOutlined',
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