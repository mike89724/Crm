import Api from "@/services/NuoscanApi";
import axios from 'axios'

export default {
    getSwapsOverviewDetails(primaryCurrency) {
      return Api().get("exchange",
      {
        params: {
          primary_currency_short_name: primaryCurrency
        }
      });
    },
    getSwapOrdersFull(primary_currency_short_name, activePage, pageSize, sortKey, order, status, start_date, end_date) {
      return Api().get("order",
      {
        params: {
          type: "exchange",
          primary_currency_short_name: primary_currency_short_name,
          page: activePage,
          size: pageSize,
          sort_key: sortKey,
          order: order,
          status: status,
          start_date: start_date,
          end_date: end_date
        }
      }
      );
    },
    getTradeOrderGraph(market_currency_short_name, position_currency_short_name, collateral_currency_short_name, start_dt, end_dt) {
      return Api().get("graphs/trade",
      {
        params: {
          market_currency_short_name: market_currency_short_name,
          position_currency_short_name: position_currency_short_name,
          collateral_currency_short_name: collateral_currency_short_name,
          start_dt: start_dt,
          end_dt: end_dt
        }
      }
      )
    }
}