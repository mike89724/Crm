/*=========================================================================================
  File Name: actions.js
  Description: Vuex Store - actions
  ----------------------------------------------------------------------------------------
  Item Name: Vuesax Admin - VueJS Dashboard Admin Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/
import ReserveDetailService from '@/services/ReserveDetailService';
import CurrencyService from '@/services/CurrencyService';
import OverviewDetailService from '@/services/OverviewDetailService';
import TokenPriceService from '@/services/TokenPriceService';
import LoanDetailService from '@/services/LoanDetailService.js';
import TradeDetailService from '@/services/TradeDetailService.js';
import SwapDetailService from '@/services/SwapDetailService.js';
import router from "../../src/router.js";
const actions = {

    // ////////////////////////////////////////////
    // SIDEBAR & UI UX
    // ////////////////////////////////////////////
    updateSidebarWidth({ commit }, width) {
        commit('UPDATE_SIDEBAR_WIDTH', width);
    },
    updateI18nLocale({ commit }, locale) {
        commit('UPDATE_I18N_LOCALE', locale);
    },
    toggleContentOverlay({ commit }) {
        commit('TOGGLE_CONTENT_OVERLAY');
    },
    updateTheme({ commit }, val) {
        commit('UPDATE_THEME', val);
    },
    togglePusher({commit}, val) {
      commit('TOGGLE_PUSHER', val);
    },
    updateUserRole({ commit }, val) {
        commit('UPDATE_USER_ROLE', val);
    },
    setGlobalReserveDetails({commit}, val) {
        commit('setGlobalReserveDetails', val);
    },
    setGlobalOverviewDetails({commit}, val) {
        commit('setGlobalOverviewDetails', val);
    },
    setGlobalLoanOverviewDetails({commit}, val) {
      commit('setGlobalLoanOverviewDetails', val);
    },
    setGlobalTradeOverviewDetails({commit}, val) {
      commit('setGlobalTradeOverviewDetails', val);
    },
    setGlobalSwapOverviewDetails({commit}, val) {
      commit('setGlobalSwapOverviewDetails', val);
    },
    setTokenList({commit}, val) {
      commit('setTokenList', val);
    },
    setPrimaryCurrency({ commit }, primaryCurrency) {
        commit("setPrimaryCurrency", primaryCurrency);
    },
    logout({ commit }) {
      commit('routeData', {})
      commit('profileData', {data: {data: {
          products: [
            
          ]
        }}})
      commit("token", "");
      commit("resfreshToken", "");
      commit("user", '');
      router.push('/pages/login')

    },


    // ////////////////////////////////////////////
    // COMPONENT
    // //////////////////////////////////////////// 
    
    // VxAutoSuggest
    updateStarredPage({ commit }, payload) {
        commit('UPDATE_STARRED_PAGE', payload)
    },

    //  The Navbar
    arrangeStarredPagesLimited({ commit }, list) {
        commit('ARRANGE_STARRED_PAGES_LIMITED', list)
    },
    arrangeStarredPagesMore({ commit }, list) {
        commit('ARRANGE_STARRED_PAGES_MORE', list)
    },
    async fetchReserve({dispatch}, primaryCurrency) {
        var response = (await ReserveDetailService.getGlobalReserves(primaryCurrency)).data;
        dispatch("setGlobalReserveDetails", response);
    },
    async fetchOverview({dispatch}, primaryCurrency) {
        var response = (await OverviewDetailService.getOverview(primaryCurrency)).data;
        dispatch("setGlobalOverviewDetails", response);
    },
    async fetchLoanOverview({dispatch}, primaryCurrency) {
      var response = await LoanDetailService.getLoanPageDetails(primaryCurrency);
      dispatch("setGlobalLoanOverviewDetails", response.data);
    },
    async fetchTradesOverview({dispatch}, primaryCurrency) {
      var response = await TradeDetailService.getTradesOverviewDetails(primaryCurrency);
      dispatch('setGlobalTradeOverviewDetails', response.data);
    },
    async fetchSwapsOverview({dispatch}, primaryCurrency) {
      var response = await SwapDetailService.getSwapsOverviewDetails(primaryCurrency);
      dispatch('setGlobalSwapOverviewDetails',(response.data));
    },
    async fetchTokenList({dispatch}) {
      var response = (await TokenPriceService.getTokens());
      if (response.data.data && response.data.data.supported_currencies && response.data.data.supported_currencies.crypto_currencies) {
        var tokenList = response.data.data.supported_currencies.crypto_currencies;
        tokenList.forEach(
          (token, index) => {
            if (
              (token.short_name == "WBTC"
              || token.short_name == "LINK"
              || token.short_name == "SAI")
              &&
            (tokenList[index]["image"].match(".*png$") != null)) {
              tokenList[index]["image"] = tokenList[index]["image"].replace("png", "svg");
            }
          }
        );
        dispatch("setTokenList", tokenList);
      }
      else
        dispatch("setTokenList", response);
    },
    async getPrimaryCurrencyFromId({dispatch}, primaryCurrencyId) {
        var response = (await CurrencyService.getCurrencies()).data;
        var currencies = response.data.supported_currencies.fiat_currencies;
        for(var i = 0; i < currencies.length; i++){
          var currency = currencies[i];
          if(primaryCurrencyId === currency.id){
            dispatch("setPrimaryCurrency", currency);
            break;
          }
        }
    },
    showModal({ commit }, name) {
      commit("showModal", { name: name, show: true, hasOverlay: true });
    },
    showModalWithOptions({ commit }, { name, hasOverlay, data }) {
      commit("showModal", {
        name: name,
        show: true,
        hasOverlay: hasOverlay,
        data: data
      });
    },
    hideModal({ commit }, name) {
      commit("showModal", { name: name, show: false });
    },
    resetState({commit}) {
      commit("resetState");
    }

}

export default actions