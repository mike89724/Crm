import Api from "@/services/NuoscanApi";

export default {
    getData(tag, primaryCurrency, startDate, endDate, tokens) {
        return Api().get("page",
        {
          params: {
            tag: tag,
            primary_currency_short_name: primaryCurrency,
            start_date: startDate,
            end_date: endDate,
            tokens: tokens
          }
        });
    }
}