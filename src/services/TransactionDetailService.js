import Api from "@/services/NuoscanApi";
export default {
  getTransactions(primaryCurrency, pageSize, size) {
    return Api().get("transaction",
      {
        params: {
          primary_currency_short_name: primaryCurrency,
          page: pageSize,
          size: size
        }
      }
    ); 
  }
}