/*=========================================================================================
  File Name: sidebarItems.js
  Description: Sidebar Items list. Add / Remove menu items from here.
  Strucutre:
          url     => router path
          name    => name to display in sidebar
          slug    => router path name
          icon    => Feather Icon component/icon name
          tag     => text to display on badge
          tagColor  => class to apply on badge element
          i18n    => Internationalization
          submenu   => submenu of current item (current item will become dropdown )
                NOTE: Submenu don't have any icon(you can add icon if u want to display)
          isDisabled  => disable sidebar item/group
  ----------------------------------------------------------------------------------------
  Item Name: Vuesax Admin - VueJS Dashboard Admin Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


export default [
  {header: 'Nuo'},
  {
    url: '/',
    name: "KYC",
    slug: "dashboardSwaps",
    icon: "HomeIcon",
    featherIcon: true,
    submenu: [
      {
        
        name: "PENDING REQUESTS",
        slug: "dashboardTrades",
      },
      {
        name: "MY APPROVALS",
        slug: "dashboardLoans",
      }
    ]
    // i18n: "Home"
  },
  {
    name: "AFFILIATES",
    slug: "dashboardReserves",
    icon: "BarChartIcon",
    featherIcon: true,
    // i18n: "Reserves"
    submenu: [
      {
        name: "MY REFERRALS",
        slug: "dashboardTrades"
      },
      {
        name: "CREATE AFFILIATES",
        slug: "dashboardLoans",
      }
    ]
  },
  {header: 'Juno'},
  {
    url: '/',
    name: "KYC",
    slug: "dashboard",
    icon: "HomeIcon",
    featherIcon: true,
    submenu: [
      {
        name: "PENDING REQUESTS",
        slug: "dashboardTrades",
      },
      {
        name: "MY APPROVALS",
        slug: "dashboardLoans",
      }
    ]
    // i18n: "Home"
  },
  {
    url: '/reserve/overview',
    name: "AFFILIATES",
    slug: "dashboardReserves",
    icon: "BarChartIcon",
    featherIcon: true,
    // i18n: "Reserves"
    submenu: [
      {
        name: "MY REFERRALS",
        slug: "dashboardTrades",
      },
      {
        name: "CREATE AFFILIATE",
        slug: "dashboardLoans",
      }
    ]
  },
  {header: 'Buy BTC'},
  {
    url: '/',
    name: "KYC",
    slug: "dashboard",
    icon: "HomeIcon",
    featherIcon: true,
    submenu: [
      {
        name: "PENDING REQUESTS",
        slug: "dashboardTrades",
      },
      {
        name: "MY APPROVALS",
        slug: "dashboardLoans",
      }
    ]
    // i18n: "Home"
  },
  {
    name: "AFFILIATES",
    slug: "dashboardReserves",
    icon: "BarChartIcon",
    featherIcon: true,
    // i18n: "Reserves"
    submenu: [
      {
        name: "MY REFERRALS",
        slug: "dashboardTrades",
      },
      {
        name: "CREATE AFFILIATES",
        slug: "dashboardLoans",
      }
    ]
  }
]