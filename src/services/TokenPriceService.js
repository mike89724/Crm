import Api from "@/services/NuoscanApi";

export default {
  getTokenPriceDetails(start_date, end_date, tokens, activePage, pageSize, order) {
    return Api().get("price",
      {
        params: {
          start_date: start_date,
          end_date: end_date,
          tokens: tokens,
          page: activePage,
          size: pageSize,
          order: order
        }
      });
  },
  getTokenPriceOverview(primary_currency_short_name) {
    return Api().get("price",
      {
        params: {
          primary_currency_short_name: primary_currency_short_name
        }
      }
    )
  },
  getTokens() {
    return Api().get("currencies");
  }
}