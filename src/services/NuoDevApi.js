import axios from "axios";

export default () => {
  const instance = axios.create({
    // baseURL: "https://api.nuoscan.io"
    baseURL: "http://dev.nuo.network:8081/"
  });

  instance.interceptors.response.use(
    response => {
      // console.log("Interceptor Response: " + response);
      return response;
    },
    function(error) {
      // console.log("Interceptor Error Response: " + error.response.status);
      return Promise.reject(error.response);
    }
  );

  return instance;
};
