import axios from "axios";

export default () => {
  const instance = axios.create({
    baseURL: "https://api.nuoscan.io"
    // baseURL: "http://dev.nuo.network:8082/"
    // baseURL: "https://534f9db1.ngrok.io/"
  });

  instance.interceptors.response.use(
    response => {
      return response;
    },
    function(error) {
      return Promise.reject(error.response);
    }
  );

  return instance;
};
