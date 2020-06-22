import axios from "axios";

export default () => {
  const instance = axios.create({
    baseURL: "https://59f30c26-ed23-45e5-a150-9c9b4ff1a606.mock.pstmn.io"
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
