import Api from "@/services/NuoscanApi";
export default {
  searchByOrderID(query, primaryCurrencyShortName) {
    return Api().get("search", {
      params: {
          query: query,
          primary_currency_short_name: primaryCurrencyShortName
      }
    });
  },
  searchByTransactionHash(query) {
    return Api().get("search", {
      params: {
        query: query
      }
    });
  },
  searchByOrderHash(orderHash, primaryCurrency, type) {
    return Api().get("order", {
      params: {
        hash: orderHash,
        primary_currency_short_name: primaryCurrency,
        type: type
      }
    });
  }
};