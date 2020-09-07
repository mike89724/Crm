import Api from "./Api";

export default {
  getPageDetails(payLoad) {
    return Api().post('page', payLoad)
  },
  performAction(payLoad) {
    return Api().post('action', payLoad)
  },
  getHistory(payLoad) {
    return Api().get('action/history', payLoad)
  }
}