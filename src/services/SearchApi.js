import axios from "axios";

export default () => {
  const instance = axios.create({
    //baseURL: "https://api.nuoscan.io"
    baseURL: "https://56a6071a-576a-4eba-b7d7-7b873196f75a.mock.pstmn.io/"
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