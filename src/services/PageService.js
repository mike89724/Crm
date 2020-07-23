import Api from "./DummyAPI";

export default {
  getPageDetails(pageName) {
    return Api().get(
      "page-details", {
        params: {
          page: pageName
        }
      }
    )
  }
}