/*=========================================================================================
  File Name: state.js
  Description: Vuex Store - state
  ----------------------------------------------------------------------------------------
  Item Name: Vuesax Admin - VueJS Dashboard Admin Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

import navbarSearchAndPinList from '@/layouts/components/navbarSearchAndPinList'
import themeConfig from '@/../themeConfig.js'
import colors from '@/../themeConfig.js'
import {getVersionCode} from "../static/util.js";

export function initialState() {
  return {
    isSidebarActive: true,
    isUserLoggedIn: false,
    email: '',
    password: '',
    breakpoint: null,
    sidebarWidth: "default",
    reduceButton: themeConfig.sidebarCollapsed,
    bodyOverlay: false,
    sidebarItemsMin: false,
    // theme: themeConfig.theme || 'light',
    theme: 'light',
    navbarSearchAndPinList: navbarSearchAndPinList,
    AppActiveUser: {
        id: 0,
        name: 'John Doe',
        about: 'Dessert chocolate cake lemon drops jujubes. Biscuit cupcake ice cream bear claw brownie brownie marshmallow.',
        img: 'avatar-s-11.png',
        status: 'online',
    },

    themePrimaryColor: colors.primary,
    globalReserveDetails: [],
    globalOverviewDetails: [],
    globalLoanOverviewDetails: [],
    globalTradeOverviewDetails: [],
    globalSwapOverviewDetails: [],
    primaryCurrency: {
      name: "Dollar",
      short_name: "USD",
      symbol: "$",
      id: 1
    },
    tokens: [],
    starredPages: navbarSearchAndPinList.data.filter((page) => page.highlightAction),
    userRole: null,
    modals: [
      { name: "searchResults", show: false, hasOverlay: false, data: {} }
    ],
    pusher: true,
    versionCode: getVersionCode()
  }
}
const state = initialState();

export default state