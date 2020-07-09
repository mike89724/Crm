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
  // {header: 'Buy BTC'},
  // {
  //   url: '/',
  //   name: "Home",
  //   slug: "dashboard",
  //   icon: "HomeIcon",
  //   featherIcon: true
  //   // i18n: "Home"
  // },
  // {
  //   url: '/kyc/overview',
  //   name: "KYC",
  //   slug: "dashboard",
  //   icon: "BarChartIcon",
  //   featherIcon: true
  //   // i18n: "Home"
  // },
  // {
  //   url: '/affiliate/overview',
  //   name: "Affiliates",
  //   slug: "dashboard",
  //   icon: "BarChartIcon",
  //   featherIcon: true
  //   // i18n: "Home"
  // },
  // {
  //   url: '/referral/overview',
  //   name: "Referrals",
  //   slug: "dashboard",
  //   icon: "BarChartIcon",
  //   featherIcon: true
  //   // i18n: "Home"
  // },
  // 
  {header: 'Nuo'},
  {
    url: '/',
    name: "Home",
    slug: "dashboard",
    icon: "HomeIcon",
    featherIcon: true
    // i18n: "Home"
  },
  {
    url: '/',
    name: "KYC",
    slug: "home",
    icon: "HomeIcon",
    featherIcon: true,
    submenu: [
      {
        url: '/kyc/overview',
        name: "My Approvals",
        slug: "dashboardLoans",
      }
    ]
    // i18n: "Home"
  },
  {
    name: "Affiliates",
    slug: "dashboardReserves",
    icon: "BarChartIcon",
    featherIcon: true,
    // i18n: "Reserves"
    submenu: [
      {
        url: '/affiliate/overview',
        name: "All Affiliates",
        slug: "dashboardLoans",
      }
    ]
  },
  // {header: 'Juno'},
  // {
  //   url: '/swaps/overview',
  //   name: "KYC",
  //   slug: "dashboard",
  //   icon: "HomeIcon",
  //   featherIcon: true,
  //   submenu: [
  //     {
  //       name: "Pending Requests",
  //       slug: "dashboardTrades",
  //     },
  //     {
  //       name: "My Approvals",
  //       slug: "dashboardLoans",
  //     }
  //   ]
  //   // i18n: "Home"
  // },
  // {
  //   url: '/reserve/overview',
  //   name: "Affiliates",
  //   slug: "dashboardReserves",
  //   icon: "BarChartIcon",
  //   featherIcon: true,
  //   // i18n: "Reserves"
  //   submenu: [
  //     {
  //       name: "My Referrals",
  //       slug: "dashboardTrades",
  //     },
  //     {
  //       name: "Create Affiliate",
  //       slug: "dashboardLoans",
  //     }
  //   ]
  // },
  // {header: 'Buy BTC'},
  // {
  //   url: '/',
  //   name: "KYC",
  //   slug: "dashboard",
  //   icon: "HomeIcon",
  //   featherIcon: true,
  //   submenu: [
  //     {
  //       name: "PENDING REQUESTS",
  //       slug: "dashboardTrades",
  //     },
  //     {
  //       name: "MY APPROVALS",
  //       slug: "dashboardLoans",
  //     }
  //   ]
  //   // i18n: "Home"
  // },
  // {
  //   name: "Affiliates",
  //   slug: "dashboardReserves",
  //   icon: "BarChartIcon",
  //   featherIcon: true,
  //   // i18n: "Reserves"
  //   submenu: [
  //     {
  //       name: "My Referrals",
  //       slug: "dashboardTrades",
  //     },
  //     {
  //       name: "All Affiliates",
  //       slug: "dashboardLoans",
  //     }
  //   ]
  // },
  // {
  //   header: "General"
  // },
  // {
  //   url: '/',
  //   name: "Access",
  //   slug: "dashboard",
  //   icon: "HomeIcon",
  //   featherIcon: true,
  //   submenu: [
  //     {
  //       name: "Users",
  //       slug: "dashboardTrades",
  //     },
  //     {
  //       name: "Roles",
  //       slug: "dashboardLoans",
  //     }
  //   ]
  // },
]