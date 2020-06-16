import Api from "@/services/NuoscanApi";

export default {
  getGlobalReserves(primaryCurrency) {
    return Api().get("reserve", {
      params: {
        primary_currency_short_name: primaryCurrency
      }
    });
  },
  getReserveOrdersFull(primary_currency_short_name, activePage, pageSize, sortKey, order, status, startDate, endDate) {
    return Api().get("order", {
      params: {
        type: "reserve",
        primary_currency_short_name: primary_currency_short_name,
        page: activePage,
        size: pageSize,
        sort_key: sortKey,
        order: order,
        status: status,
        start_date: startDate,
        end_date: endDate
      }
    })
  },
  getReserveOrderGraph(source_currency_short_name, primary_currency_short_name) {
    return Api().get("currencies/prices",
      {
        params: {
          source_currency_short_name: source_currency_short_name,
          primary_currency_short_name: primary_currency_short_name
        }
      }
    )
  }
}