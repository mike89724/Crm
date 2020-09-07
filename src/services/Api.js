import axios from "axios";
import store from "@/store/store";
import AuthenticationService from "@/services/AuthenticationService";
import router from "@/router";
import vue from "../main";
// import {apiBaseURL} from "@/config/settings";

var isRefreshing = false;

let apiBaseURL = 'https://api-crm.nuofox.com/'

export default () => {
  const instance = axios.create({
    baseURL: apiBaseURL,
    headers: {
      Authorization: `Bearer ${store.state.token}`
    }
  });
  instance.interceptors.response.use(
    response => {
      return response;
    },
    function(error) {
      // console.log("Interceptor Error Response: " + error.response.status);
      var originalRequest = error.config;

      var refreshToken = store.state.refreshToken;
      if (error.response.status === 401 && !isRefreshing) {
        if (refreshToken) {
          isRefreshing = true;
          return refreshAccessToken()
            .then(response => {
              console.log("Refreshing token response: ", response);
              store.dispatch("setToken", response.data.token);
              store.dispatch("setRefreshToken", response.data.refreshToken);
              isRefreshing = false;
              originalRequest.headers["Authorization"] =
                "Bearer " + store.state.token;
              return axios.request(originalRequest);
            })
            .catch(error => {
              store.dispatch("logout");
              isRefreshing = false;
              vue.$showSnackbar(
                "Your session has expired. Please login again to continue",
                "error"
              );
              return Promise.reject(error.response);
            });
        } else {
          store.dispatch("logout");
          return Promise.reject(error.response);
        }
      } else if (error.response.status === 401 && isRefreshing) {
        console.log("Waiting for Refresh token");
        return delay(1000).then(() => {
          originalRequest.headers["Authorization"] =
            "Bearer " + store.state.token;
          return axios.request(originalRequest);
        });
      } else if (error.response.status === 403) {
        store.dispatch("logout");
        if (router.currentRoute.name === "login") {
          return Promise.reject(error.response);
        } else {
          store.dispatch("showModalWithOptions", {
            name: "newIp",
            params: {
              email: ""
            }
          })
        }
      } else {
        // analytics.track('Error in API response', {
        //   location: response.request.responseURL
        // });
        return Promise.reject(error.response);
      }
    }
  );
  return instance;
};

function delay(t, v) {
  return new Promise(function(resolve) {
    setTimeout(resolve.bind(null, v), t);
  });
}

function refreshAccessToken() {
  return AuthenticationService.refreshToken(
    store.state.user,
    store.state.refreshToken
  );
}
