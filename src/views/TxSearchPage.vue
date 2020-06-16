<template>
  <div id="tx-search-page">
    <vx-card v-if="typeof query == 'string' && query.length == 66" id="searchResult">
      <vs-row vs-justify="start">
        <vs-col vs-type="flex" vs-justify="start" vs-align="center" vs-lg="2" vs-md="2" vs-sm="4" vs-xs="6">Transaction Hash:</vs-col>
        <vs-col vs-type="flex" vs-justify="start" vs-align="center" vs-lg="10" vs-md="10" vs-sm="8" vs-xs="6">
          <b class="tx-values"><a target="_blank" :href="'https://etherscan.io/tx/'+hashCode">{{hashCode}}</a></b>
        </vs-col>
      </vs-row>
      <vs-row vs-justify="start">
        <vs-col vs-type="flex" vs-justify="start" vs-align="center" vs-lg="2" vs-md="2" vs-sm="4" vs-xs="6">Status:</vs-col>
        <vs-col vs-type="flex" vs-justify="start" vs-align="center" vs-lg="10" vs-md="10" vs-sm="8" vs-xs="6">
          <b class="tx-values">{{status}}</b>
        </vs-col>
      </vs-row>
      <vs-row vs-justify="start">
        <vs-col vs-type="flex" vs-justify="start" vs-align="center" vs-lg="2" vs-md="2" vs-sm="4" vs-xs="6">Block:</vs-col>
        <vs-col vs-type="flex" vs-justify="start" vs-align="center" vs-lg="10" vs-md="10" vs-sm="8" vs-xs="6">
          <b class="tx-values"><a target="_blank" :href="'https://etherscan.io/block/'+block">{{block}}</a></b>
        </vs-col>
      </vs-row>
      <vs-row vs-justify="start">
        <vs-col vs-type="flex" vs-justify="start" vs-align="center" vs-lg="2" vs-md="2" vs-sm="4" vs-xs="6">Timestamp:</vs-col>
        <vs-col vs-type="flex" vs-justify="start" vs-align="center" vs-lg="10" vs-md="10" vs-sm="8" vs-xs="6">
          <b class="tx-values">{{timeStamp}}</b>
        </vs-col>
      </vs-row>
      <vs-row vs-justify="start">
        <vs-col vs-type="flex" vs-justify="start" vs-align="center" vs-lg="2" vs-md="2" vs-sm="4" vs-xs="6">Invoker Address:</vs-col>
        <vs-col vs-type="flex" vs-justify="start" vs-align="center" vs-lg="10" vs-md="10" vs-sm="8" vs-xs="6">
          <b class="tx-values">{{from}}</b>
        </vs-col>
      </vs-row>
      <vs-row vs-justify="start">
        <vs-col vs-type="flex" vs-justify="start" vs-align="center" vs-lg="2" vs-md="2" vs-sm="4" vs-xs="6">To:</vs-col>
        <vs-col vs-type="flex" vs-justify="start" vs-align="center" vs-lg="10" vs-md="10" vs-sm="8" vs-xs="6">
          <b class="tx-values">{{to}}</b>
        </vs-col>
      </vs-row>
      <vs-row vs-justify="start">
        <vs-col vs-type="flex" vs-justify="start" vs-align="center" vs-lg="2" vs-md="2" vs-sm="4" vs-xs="6">Etherscan:</vs-col>
        <vs-col vs-type="flex" vs-justify="start" vs-align="center" vs-lg="10" vs-md="10" vs-sm="8" vs-xs="6">
          <b class="tx-values"><a target="_blank" :href="'https://etherscan.io/tx/'+hashCode">https://etherscan.io/tx/{{hashCode}}</a></b>
        </vs-col>
      </vs-row>
    </vx-card>
    <trade-order
      v-if="method=='trade' || tradeOrderFlag"
      :orderData="tradeOrderData"
      :orderHash="(tradeOrderFlag)?'':this.order_hash"
      :primaryCurrency="$store.state.primaryCurrency.short_name"
    ></trade-order>
    <loan-order
      v-if="method=='loan' || loanOrderFlag"
      :orderData="loanOrderData"
      :orderHash="(loanOrderFlag)?'':this.order_hash"
      :primaryCurrency="$store.state.primaryCurrency.short_name"
    ></loan-order>
    <reserve-order
      v-if="method=='reserve' || reserveOrderFlag"
      :orderData="reserveOrderData"
      :orderHash="(reserveOrderFlag)?'':this.order_hash"
      :primaryCurrency="$store.state.primaryCurrency.short_name"
    ></reserve-order>
    <swap-order
      v-if="method=='swap' || swapOrderFlag"
      :orderData="swapOrderData"
      :orderHash="(swapOrderFlag)?'':this.order_hash"
      :primaryCurrency="$store.state.primaryCurrency.short_name"
    ></swap-order>
  </div>
</template>
<script>
import SearchService from "@/services/SearchService";
import { getTradeOrderStatus } from "@/utils/util.js";
import { formatDate } from "@/static/util.js";
import TradeOrder from "@/views/ui-elements/single-row-table/TradeOrderSearch.vue";
import LoanOrder from "@/views/ui-elements/single-row-table/LoanOrderSearch.vue";
import SwapOrder from "@/views/ui-elements/single-row-table/SwapOrderSearch.vue";
import ReserveOrder from "@/views/ui-elements/single-row-table/ReserveOrderSearch.vue";

export default {
  data() {
    return {
      hashCode:
        "0x977abc2e07538bd566144a1a5081b9df0f7ab90467ad90429545438e4522df2f",
      icon: "Copy",
      status: "Success",
      iconRight: true,
      block: 9036781,
      timeStamp: "Dec-02-2019 07:06:35 AM +UTC",
      from: "0x2f9330872dd661f53f1105b0e69df61fedd71eca",
      to: "0xe44061f043682ff77c1d51d4e0f93ab2bb5b2ae0",
      value: "1 ETH",
      order_hash: "",
      method: "",
      tradeOrderFlag: false,
      loanOrderFlag: false,
      reserveOrderFlag: false,
      swapOrderFlag: false,
      query: "",
      orderID: "",
      tradeOrderData: {},
      loanOrderData: {},
      reserveOrderData: {},
      swapOrderData: {}
    };
  },
  components: {
    "trade-order": TradeOrder,
    "loan-order": LoanOrder,
    "reserve-order": ReserveOrder,
    "swap-order": SwapOrder
  },
  methods: {
    formatDate(date) {
      return formatDate(date);
    },
    getHypenatedDate(date) {
      if (date != null) {
        var d = new Date(date);
        return d.toDateString();
      } else {
        return null;
      }
    },
    convertToPreciseFloat(val, places) {
      if (Number.isFinite(val)) {
        return val
          .toFixed(places)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      } else {
        return val;
      }
    },
    convertToHtmlInTrade(url, tradeCurrency, market_currency) {
      return `<img class='img-icon' width=20 height=20 src='${url}'> ${tradeCurrency}/${market_currency}`;
    },
    getStatus(
      status,
      cancel_status,
      completed_status,
      stop_loss_status,
      take_profit_status
    ) {
      var computedStatus = getTradeOrderStatus(
        status,
        cancel_status,
        completed_status,
        stop_loss_status,
        take_profit_status
      );
      var label = computedStatus.label;
      var icon = computedStatus.icon;
      return `<div style='display: flex; justify-content: flex-start;' ><div class='down h-3 w-3 rounded-full mr-2 bg-${icon}''></div><div>${label}</div></div>`;
    },

    getOrderType(methodName) {
      let splitArray = methodName.split("_");
      if (splitArray.includes("trading") || splitArray.includes("trade")) {
        return "trade";
      } else if (splitArray.includes("debt")) {
        return "loan";
      } else if (splitArray.includes("reserve")) {
        return "reserve";
      } else {
        return "";
      }
    },
    async searchByTransactionHash(query) {
      this.$vs.loading(
        {
          container: "#tx-search-page",
          type: "sound"
        }
      );
      this.$ga.event({
        eventCategory: 'transaction-hash',
        eventAction: 'search',
        eventLabel: query
      });
      var response = await SearchService.searchByTransactionHash(query);
      if (
        response &&
        response.data &&
        response.data.data &&
        response.data.data.length > 0
      ) {
        this.to = response.data.data[0].to_address;
        this.from = response.data.data[0].invoker;
        this.block = response.data.data[0].block_number;
        this.timeStamp = response.data.data[0].added_on;
        this.value = response.data.data[0].value;
        this.order_hash = response.data.data[0].order_hash;
        this.method = this.getOrderType(
          response.data.data[0].contract_method_name
        );
      }
      this.$vs.loading.close("#tx-search-page > .con-vs-loading");
    },
    async searchByOrderID(orderID) {
      this.tradeOrderFlag = false;
      this.loanOrderFlag = false;
      this.reserveOrderFlag = false;
      this.swapOrderFlag = false;

      var data = {}
      try {
        this.$vs.loading(
          {
            container: "#tx-search-page",
            type: "sound"
          }
        );
        this.$ga.event({
          eventCategory: 'order-id',
          eventAction: 'search',
          eventLabel: orderID
        });
        data = await SearchService.searchByOrderID(
          orderID,
          this.$store.state.primaryCurrency.short_name
        );
        data = data.data;
      } catch (err) {
        if (err.status == 400) {
          data = err.data
        }
      }
      for (var type in data) {
        var self = this;
        if (type == "trade_order") {
          this.tradeOrderData = data[type][0];
          this.$nextTick(
            () => {
              self.tradeOrderFlag = true;
            }
          );
        } else if (type == "loan_order") {
          this.loanOrderData = data[type][0];
          this.$nextTick(
            () => {
              self.loanOrderFlag = true;
            }
          );
        } else if (type == "reserve_order") {
          this.reserveOrderData = data[type][0];
          this.$nextTick(
            () => {
              self.reserveOrderFlag = true;
            }
          );
        } else if (type == "exchange_order") {
          this.swapOrderData = data[type][0];
          this.$nextTick(
            () => {
              self.swapOrderFlag = true;
            }
          );
        } 
      }
      this.$vs.loading.close("#tx-search-page > .con-vs-loading");
    },
    async handleQuery(query) {
      if (typeof query == "string" && query.length == 66) {
        this.hashCode = query;
        await this.searchByTransactionHash(query);
      } else {
        this.orderID = parseInt(query);
        await this.searchByOrderID(this.orderID);
      }
    }
  },
  async mounted() {
    this.query = this.$route.params.query;
    await this.handleQuery(this.query);
  },
  watch: {
    '$route.params.query': async  function(newVal){
      this.query = newVal;
      this.tradeOrderFlag = false;
      this.reserveOrderFlag = false;
      this.loanOrderFlag = false;
      await this.handleQuery(this.query);
    },
    "$store.state.primaryCurrency": async function() {
      await this.handleQuery(this.query);
    }
  }
};
</script>
<style scoped lang="scss">
#tx-search-page {
  position: relative;
  top: 10px;
}
.copy-icon {
  height: 15px;
  width: 15px;
}

.icon-wrapper {
  position: relative;
  top: 5px;
  left: 5px;
  cursor: pointer;
}
.tx-values {
  overflow-x: auto;
  width: 100%;
  white-space: nowrap;
}
@media only screen and (max-width: 768px) {
  .tx-values {
    overflow-x: scroll;
    width: 100%;
    white-space: nowrap;
  }
}
</style>