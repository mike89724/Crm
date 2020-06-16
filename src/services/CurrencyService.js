import Api from "@/services/NuoscanApi";

export default {
  getCurrencies() {
    return Api().get("currencies");
  },
  // getCurrencies(options) {
  //   return Api().get("currency-price", {
  //     params:{
  //       primary_currency_short_name: options
  //     }
  //   });
  // },
};
