/*=========================================================================================
  File Name: getters.js
  Description: Vuex Store - getters
  ----------------------------------------------------------------------------------------
  Item Name: Vuesax Admin - VueJS Dashboard Admin Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


const getters = {

  // COMPONENT
  // vx-autosuggest
  // starredPages: state => state.navbarSearchAndPinList.data.filter((page) => page.highlightAction),
  sidebarItems(state) {
    if(state.profileData != null) {
      return state.profileData.data.data.products 
    }  
    else return [];
  },
  imageUrl(state) {
    if(state.profileData != null) {
      return state.profileData.data.data.image 
    }  
    else return '';
  },
  firstName(state) {
    if(state.profileData != null) {
      return state.profileData.data.data.first_name 
    }  
    else return '';
  },
  lastName(state) {
    if(state.profileData != null) {
      return state.profileData.data.data.last_name 
    }  
    else return '';
  },
  getModalShowState(state) {
    return function (name) {
      for (var i = 0; i < state.modals.length; i++) {
        var item = state.modals[i];
        if (item.name === name) {
          return item;
        }
      }
      return false;
    };
  },
  getTokenImgUrl: (state) => (tokenName) => {
    var tokens = state.tokens;
    if (tokens) {
      var reqToken = tokens.find(
        (token) => {
          if (token.short_name == tokenName) {
            return token;
          }
        }
      );
      if (reqToken)
        return reqToken.image;
      else
        return "";
    } else {
      return "";
    }
  }
}

export default getters