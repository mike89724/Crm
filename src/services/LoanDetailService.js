import Api from "@/services/NuoscanApi";

export default {
    getLoanOrdersFull(primaryCurrency, activePage, pageSize, sortKey, order, status, startDate, endDate) {
      return Api().get("order", {
        params: {
          type: "loan",
          primary_currency_short_name: primaryCurrency,
          page: activePage,
          size: pageSize,
          sort_key: sortKey,
          order: order,
          status: status,
          start_date: startDate,
          end_date: endDate
        }
      });
    },
    getLoanPageDetails(primaryCurrency) {
      return Api().get("loan",
        {
          params: {
            primary_currency_short_name: primaryCurrency
          }
        }
      )
    },
    getLoanOrderGraph(source_currency_short_name, destination_currency_short_name) {
      return Api().get("currencies/prices",
        {
          params: {
            source_currency_short_name: source_currency_short_name,
            destination_currency_short_name: destination_currency_short_name
          }
        }
      )
    }
}