/*=========================================================================================
  File Name: mutations.js
  Description: Vuex Store - mutations
  ----------------------------------------------------------------------------------------
  Item Name: Vuesax Admin - VueJS Dashboard Admin Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

import Vue from 'vue'
import {initialState} from "./state.js"
const mutations = {

    // ////////////////////////////////////////////
    // SIDEBAR & UI UX
    // ////////////////////////////////////////////

    UPDATE_SIDEBAR_WIDTH(state, width) {
        state.sidebarWidth = width;
    },
    UPDATE_SIDEBAR_ITEMS_MIN(state, val) {
        state.sidebarItemsMin = val;
    },
    TOGGLE_REDUCE_BUTTON(state, val) {
        state.reduceButton = val;
    },
    TOGGLE_CONTENT_OVERLAY(state, val) {
        state.bodyOverlay = val;
    },
    TOGGLE_IS_SIDEBAR_ACTIVE(state, value) {
        state.isSidebarActive = value;
    },
    isUserLoggedIn(state, value) {
      state.isUserLoggedIn = value;
    },
    email(state, value) {
      state.email = value;
    },
    password(state, value) {
      state.password = value;
    },
    setGlobalReserveDetails(state, globalReserveDetails) {
        state.globalReserveDetails = globalReserveDetails;
    },
    setGlobalOverviewDetails(state, globalOverviewDetails) {
        state.globalOverviewDetails = globalOverviewDetails;
    },
    setGlobalLoanOverviewDetails(state, globalLoanOverviewDetails) {
      state.globalLoanOverviewDetails = globalLoanOverviewDetails;
    },
    setGlobalTradeOverviewDetails(state, globalTradeOverviewDetails) {
      state.globalTradeOverviewDetails = globalTradeOverviewDetails;
    },
    setGlobalSwapOverviewDetails(state, globalSwapOverviewDetails) {
      state.globalSwapOverviewDetails = globalSwapOverviewDetails;
    },
    setTokenList(state, tokenList) {
      state.tokens = tokenList;
    },
    setPrimaryCurrency(state, primaryCurrency) {
        state.primaryCurrency = primaryCurrency;
    },


    UPDATE_THEME(state, val) {
        state.theme = val;
    },
    TOGGLE_PUSHER(state, val) {
      state.pusher = val;
    },
    UPDATE_WINDOW_BREAKPOINT(state, val) {
        state.breakpoint = val;
    },
    UPDATE_PRIMARY_COLOR(state, val) {
        state.themePrimaryColor = val;  
    },
    UPDATE_USER_ROLE(state, val) {
        state.userRole = val
        localStorage.setItem('userRole', val)
    },
    UPDATE_STATUS_CHAT(state, value) {
        state.AppActiveUser.status = value;
    },


    // ////////////////////////////////////////////
    // COMPONENT
    // ////////////////////////////////////////////

    // VxAutoSuggest
    UPDATE_STARRED_PAGE(state, payload) {
        // find item index in search list state
        const index = state.navbarSearchAndPinList.data.findIndex((item) => item.index == payload.index)
        // update the main list
        state.navbarSearchAndPinList.data[index].highlightAction = payload.val;

        // if val is true add it to starred else remove
        if(payload.val) {
            state.starredPages.push(state.navbarSearchAndPinList.data[index])
        }else {
            // find item index from starred pages
            const index = state.starredPages.findIndex((item) => item.index == payload.index)
            // remove item using index
            state.starredPages.splice(index, 1);
        }
    },

    // The Navbar
    ARRANGE_STARRED_PAGES_LIMITED(state, list) {
        const starredPagesMore = state.starredPages.slice(10);
        state.starredPages = list.concat(starredPagesMore);
    },
    ARRANGE_STARRED_PAGES_MORE(state, list) {
        let downToUp = false
        let lastItemInStarredLimited = state.starredPages[10];
        const starredPagesLimited = state.starredPages.slice(0, 10);
        state.starredPages = starredPagesLimited.concat(list);

        state.starredPages.slice(0,10).map((i) => {
            if(list.indexOf(i) > -1) downToUp = true
        })
        if(!downToUp) {
            state.starredPages.splice(10, 0, lastItemInStarredLimited);
        }
    },
    // SearchResultsModal
    showModal(state, { name, show, hasOverlay, data }) {
      var index = -1;
      for (var i = 0; i < state.modals.length; i++) {
        var item = state.modals[i];
        if (item.name === name) {
          index = i;
          break;
        }
      }
      var element = {};
      if(hasOverlay)
        element = { name: name, show: false, hasOverlay: false, data: {} };
      else
        element = { name: name, show: false, data: {} };
      if(index != -1) {
        state.modals[index].show = show;
        element.show = show;
        if(hasOverlay != null) {
          state.modals[index].hasOverlay = hasOverlay;
          element.hasOverlay = hasOverlay;
        }
        if(data != null) {
          element.data = data;
        }
        if(data)
          Vue.set(state.modals, index, element)
      }
    },
    resetState(state){
      const s = initialState();
      Object.keys(s).forEach(key => {
        state[key] = s[key]
      })
    }

}

export default mutations