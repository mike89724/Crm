import Api from "@/services/NuoscanApi";

export default {
    getOverview(primaryCurrency) {
        return Api().get("home",
        {
          params: {
            primary_currency_short_name: primaryCurrency
          }
        });
    }
}