import Api from "./Api";

export default {
    loginInit(payLoad) {
        return Api().post("login/init", payLoad)
    },
    loginFinal(payLoad) {
        return Api().post("login/final", payLoad)
    },
    refreshToken(username, refreshToken) {
        return Api().post("refresh-auth", {
          username: username,
          refreshToken: refreshToken
        });
    }
}