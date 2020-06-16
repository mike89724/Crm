<template>
  <vx-card v-if="trades.length > 0" class="mt-2 mb-5">
    <vs-row vs-type="flex" vs-justify="flex-start" vs-align="center">
      <vs-col>
        <h5 class="p-3">TRADE ORDER</h5>
      </vs-col>
    </vs-row>
    <vs-row>
      <vs-col vs-w="12">
        <vs-table style="width: 100%;" :hoverFlat="true" :data="trades">
          <template slot="header"></template>
          <template slot="thead">
            <vs-th><div class="trade-order-width-acceptable">AGE</div></vs-th>
            <vs-th class="flex-center"><div class="trade-order-width-acceptable">ORDER ID</div></vs-th>
            <vs-th><div class="trade-order-width-acceptable">TRADE</div></vs-th>
            <vs-th class="flex-center"><div class="trade-order-width-acceptable">POSITION</div></vs-th>
            <vs-th><div class="trade-order-width-acceptable">POSITION AMOUNT</div></vs-th>
            <vs-th><div class="trade-order-width-acceptable">GAINS</div></vs-th>
            <vs-th><div class="trade-order-width-acceptable">ENTRY PRICE</div></vs-th>
            <vs-th><div class="trade-order-width-acceptable">CURRENT/CLOSING</div></vs-th>
            <vs-th class><div class="trade-order-width-acceptable">STATUS</div></vs-th>
          </template>
          <template slot-scope="{data}">
            <vs-tr :id="indextr" :key="indextr" v-for="(tr, indextr) in data">
              <vs-td><div class="trade-order-width-acceptable">{{formatDate(tr.added_on)}}</div></vs-td>
              <vs-td :data="data[indextr].id" class="center-align"><div class="trade-order-width-acceptable m-auto">{{tr.id}}</div></vs-td>
              <vs-td
                v-html="convertToHtml(data[indextr].position_currency.image_url,data[indextr].position_currency.short_name,data[indextr].market_currency.short_name)"
                :data="data[indextr].id"
              ></vs-td>
              <vs-td class="center-align" :data="data[indextr].id">
                <div class="trade-order-width-acceptable m-auto"
                  :class="{'position-long': tr.position_type == 'LONG', 'position-short': tr.position_type == 'SHORT'}"
                >{{convertToPreciseFloat(tr.initial_leverage, 0)}}x {{data[indextr].position_type}}</div>
              </vs-td>

              <vs-td
                :data="data[indextr].id"
                class="center-align"
              >
              <div class="trade-order-width-acceptable">
                {{convertToPreciseFloat(data[indextr].position_amount, 2)}} {{data[indextr].position_currency.short_name}}
              </div>
              </vs-td>
              <vs-td class="center-align" :data="data[indextr].id">
                <div class="trade-order-width-acceptable"
                  :class="{'red':tr.gains_new < 0, 'green': tr.gains_new >= 0 }"
                >{{convertToPreciseFloat(data[indextr].gains_new, 2)}} {{gainsCurrency(data[indextr])}}</div>
              </vs-td>
              <vs-td
                class="center-align"
                :data="data[indextr].id"
              >
              <div class="trade-order-width-acceptable">
                {{convertToPreciseFloat(data[indextr].entry_price, 2)}} {{data[indextr].market_currency.short_name}}
              </div>
              </vs-td>
              <vs-td :data="data[indextr].id" class="center-align">
                <div class="trade-order-width-acceptable">
                  {{(data[indextr].status == 1 || data[indextr].cancel_status == 2)?
                  convertToPreciseFloat(data[indextr].current_price, 2)
                  :convertToPreciseFloat(data[indextr].current_exit_price, 2)}}
                  {{data[indextr].market_currency.short_name}}
                </div>
              </vs-td>
              <vs-td
                class
                :data="data[indextr].id"
                v-html="getStatus(data[indextr].status,
                  data[indextr].cancel_status,
                  data[indextr].completed_status,
                  data[indextr].stop_loss_status,
                  data[indextr].take_profit_status)"
              ></vs-td>
            </vs-tr>
          </template>
        </vs-table>
      </vs-col>
    </vs-row>
    <vs-row class="mt-5">
      <vs-col vs-w="12">
        <vs-row
          vs-type="flex"
          vs-justify="space-around"
          style="background: rgba(157, 159, 162, 0.1); padding: 10px; width: 100%;">
          <vs-col
            vs-lg="4" vs-sm="12"
            :style="(updatedWidth > 768)?'text-align: left;':'text-align: center;'"
          >Liquidation Buffer: {{(trades[0])?trades[0].buffer:"0"}}%
          </vs-col>
          <vs-col
            vs-lg="4" vs-sm="12"
            style="text-align: center;"
            >Stop Loss: {{trades[0]?trades[0].stop_loss:"0"}}%
          </vs-col>
          <vs-col
            vs-lg="4" vs-sm="12"
            style="text-align: center;"
          >Take Profit: {{trades[0]?trades[0].take_profit:"0"}}%
          </vs-col>
        </vs-row>
      </vs-col>
      <vs-col class="pl-0" vs-w="12">
        <vs-row vs-type="flex" vs-justify="space-between">
          <vs-col class="pl-0" vs-lg="8" vs-sm="12" vs-align="center" vs-justify="center">
            <expandable-row-graph
              v-if="orderType == 'trade'"
              :orderData="trades[0]"
              :primaryCurrency="$store.state.primaryCurrency"
            ></expandable-row-graph>
          </vs-col>
          <vs-col
            style="flex-direction: column; justify-content: space-evenly;"
            vs-type="flex"
            vs-align="center"
            vs-lg="4"
            vs-sm="12"
          >
            <vs-row vs-justify="center" vs-align="center" :class="{'pt-1 pb-1': updatedWidth <= 768}">
              <vs-col vs-lg="1" vs-sm="1" vs-xs="2" vs-align="center" :class="{'pl-0' : updatedWidth > 768}">
                <span style="color: rgb(53, 118, 253); display: flex; align-items: center;">
                  <feather-icon class="expanded-icons" style="color: rgb(53, 118, 253);" icon="DollarSignIcon"></feather-icon>
                </span>
              </vs-col>
              <vs-col :class="{'pl-2': updatedWidth > 768, 'pl-0 pt-1 pb-1': updatedWidth <= 768}" vs-align="center" vs-lg="11" vs-sm="10">
                <span>Fee: {{$store.state.primaryCurrency.symbol}}{{(trades[0]?parseInt(trades[0].fee).toFixed(2):0)}}</span>
              </vs-col>
            </vs-row>
            <vs-row vs-justify="center" vs-align="center" :class="{'pt-1 pb-1': updatedWidth <= 768}">
              <vs-col vs-lg="1" vs-sm="1" vs-xs="2" vs-align="center" :class="{'pl-0' : updatedWidth > 768}" vs-type="flex">
                <feather-icon class="expanded-icons" style="color: rgb(53, 118, 253);" icon="SendIcon"></feather-icon>
              </vs-col>
              <vs-col :class="{'pl-2': updatedWidth > 768, 'pl-0 pt-1 pb-1': updatedWidth <= 768}" vs-align="center" vs-lg="11" vs-sm="10">
                <vs-row vs-type="flex" vs-justify="space-between" vs-align="center">
                  <vs-col style="padding: 0;" vs-w="12" vs-align="center" vs-type="flex">
                    <span>Start Date: {{getHypenatedDate((trades[0])?trades[0].added_on:"")}}</span>
                    <a target="_blank" :href="(trades[0])?trades[0].etherscan_url:''">
                      <span
                        v-if="(trades[0])?trades[0].etherscan_url:''"
                        class="icon-wrapper etherscan-link"
                      >
                        <vs-icon size="12px" icon="launch" class="launch-icon"></vs-icon>
                      </span>
                    </a>
                  </vs-col>
                </vs-row>
              </vs-col>
            </vs-row>
            <vs-row vs-justify="center" vs-align="center" :class="{'pt-1 pb-1': updatedWidth <= 768}">
              <vs-col style="display: flex; align-items: center;" vs-sm="1" vs-xs="2" :class="{'pl-0': updatedWidth > 768}" vs-lg="1">
                <feather-icon class="expanded-icons" style="color: rgb(53, 118, 253);" icon="CalendarIcon"></feather-icon>
              </vs-col>
              <vs-col :class="{'pl-2': updatedWidth > 768, 'pl-0': updatedWidth <= 768}" vs-align="center" vs-sm="10" vs-lg="11">
                <vs-row vs-type="flex" vs-justify="space-between" vs-align="center">
                  <vs-col class="pl-0" vs-align="center" vs-w="12">
                    <span>End Date: {{(getHypenatedDate(trades[0]?trades[0].ending_on:""))?getHypenatedDate(trades[0]?trades[0].ending_on:''):getTenureAddedDate(trades[0].added_on, trades[0].tenure)}}</span>
                    <a target="_blank" :href="trades[0].end_etherscan_url">
                      <span
                        v-if="trades[0] != null && trades[0].end_etherscan_url"
                        class="icon-wrapper etherscan-link"
                      >
                        <vs-icon size="12px" icon="launch" class="launch-icon"></vs-icon>
                      </span>
                    </a>
                  </vs-col>
                </vs-row>
              </vs-col>
            </vs-row>
          </vs-col>
        </vs-row>
      </vs-col>
    </vs-row>
  </vx-card>
</template>

<script>
import SearchService from "@/services/SearchService";
import VueApexCharts from "vue-apexcharts";
import {getTradeOrderStatus} from "@/utils/util.js";
import {formatDate} from "@/static/util.js";
import ExpandableRowGraph from "@/views/ExpandableRowGraph.vue";

export default {
  data() {
    return {
      trades: [
        {
          is_campaign_activated: 2,
          campaign_activation_message: null,
          buffer: 10,
          gains_new_in_position_currency: -0.04074434486833316,
          collateral_amount_after_termination: null,
          closing_trade_amount_after_termination: null,
          initial_exit_price: 201.23400496335773,
          initial_exit_price_primary: 201.16730594281196,
          current_exit_price: 201.2340049633578,
          current_exit_price_primary: 201.67064479742703,
          current_price: 134.35846746825013,
          current_price_primary: 134.65,
          position_type: "SHORT",
          position_amount: 1.642436,
          position_amount_primary: 218.67392904,
          entry_price: 133.184143890847,
          entry_price_primary: 133.1400000000003,
          version: 5,
          fee: 0,
          fee_primary: 0,
          gains_new: -0.04074434486833316,
          gains_new_primary: -5.48622603652106,
          ending_on: "2020-02-01T14:56:07.000Z",
          take_profit: 50,
          gains: -1.7256001609865896,
          stop_loss: 80,
          initial_leverage: 2,
          error_message: null,
          end_etherscan_url: null,
          etherscan_url:
            "https://etherscan.io/tx/0x932ba18c06aa9780e184c19cecc557ff5fbca4334330e4c12097cf1e3f289956",
          order_hash:
            "0x6b7331d2913fa7bfc6c4737b8a8a736720c837cceec975f5c44da51a9d5f1da1",
          repay_amount: "1.6484685230041654371",
          repay_amount_primary: 221.96628662251086,
          current_leverage: 1.9570634922196486,
          liquidation_leverage: 2.1066056741672052,
          days_passed: 0,
          premium: 0.333901097027134,
          tenure: 28,
          id: 18026,
          loan_amount: 1.642436,
          collateral_amount: 0.821218,
          state: 1,
          loan_amount_primary: 221.1540074,
          collateral_amount_primary: 110.5770037,
          trade_amount: 215.937673,
          trade_amount_primary: 216.40621702030703,
          status: 1,
          cancel_status: 5,
          defaulted_status: 5,
          completed_status: 5,
          stop_loss_status: 5,
          take_profit_status: 5,
          is_loan: 2,
          is_margin_trade: 1,
          added_on: "2020-01-04T14:54:49.184Z",
          loan_currency: {
            decimal_count: 18,
            id: 14,
            name: "Ethereum",
            short_name: "ETH",
            image_url:
              "https://s3.ap-south-1.amazonaws.com/nuo-public/nuo_web/images/eth.png",
            base_address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
          },
          collateral_currency: {
            decimal_count: 18,
            id: 14,
            name: "Ethereum",
            short_name: "ETH",
            image_url:
              "https://s3.ap-south-1.amazonaws.com/nuo-public/nuo_web/images/eth.png",
            base_address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
          },
          trade_currency: {
            decimal_count: 6,
            id: 27,
            name: "USD Coin",
            short_name: "USDC",
            image_url:
              "https://s3.ap-south-1.amazonaws.com/nuo-public/nuo_web/images/usdc.png",
            base_address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
          },
          closing_trade_currency: {
            decimal_count: 18,
            id: 14,
            name: "Ethereum",
            short_name: "ETH",
            image_url:
              "https://s3.ap-south-1.amazonaws.com/nuo-public/nuo_web/images/eth.png",
            base_address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
          },
          market_currency: {
            decimal_count: 6,
            id: 27,
            name: "USD Coin",
            short_name: "USDC",
            image_url:
              "https://s3.ap-south-1.amazonaws.com/nuo-public/nuo_web/images/usdc.png",
            base_address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
          },
          position_currency: {
            decimal_count: 18,
            id: 14,
            name: "Ethereum",
            short_name: "ETH",
            image_url:
              "https://s3.ap-south-1.amazonaws.com/nuo-public/nuo_web/images/eth.png",
            base_address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
          },
          loan_order: {},
          margin_order: {},
          copy_user: {}
        }
      ],
      orderType: ""
    };
  },
  components: {
    VueApexCharts,
    ExpandableRowGraph
  },
  props: {
    primaryCurrency: {
      type: String,
      required: true
    },
    orderHash: {
      type: String
    },
    orderData: {
      type: Object
    }
  },
  methods: {
    async searchByOrderHash() {
      let data = await SearchService.searchByOrderHash(
        this.orderHash,
        this.primaryCurrency,
        "trade"
      );
      this.trades = data.data.data;
      this.orderType = "trade"
    },
    getHypenatedDate(date) {
      if (date != null) {
        var d = new Date(date);
        return d.toDateString();
      } else {
        return null;
      }
    },
    gainsCurrency(row) {
      if (row.gains_new >= 0 && row.position_type == "LONG") {
        return row.market_currency.short_name;
      } else if (row.gains_new >= 0 && row.position_type == "SHORT") {
        return row.position_currency.short_name;
      } else if (row.gains_new < 0) {
        return row.collateral_currency.short_name;
      } else {
        return "";
      }
    },
    getTenureAddedDate(startDate, tenure) {
      var endDateFormatted;
      if (tenure != null) {
        let startDateFormatted = new Date(startDate);
        let day = parseInt(startDateFormatted.getDate());
        endDateFormatted = new Date(
          startDateFormatted.setDate(day + parseInt(tenure))
        );
        endDateFormatted = endDateFormatted.toDateString();
      } else {
        endDateFormatted = null;
      }
      return endDateFormatted;
    },
    formatDate(date) {
      return formatDate(date);
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
    convertToHtml(url, tradeCurrency, market_currency) {
      if (url.slice(-7) == "knc.jpg" || url.slice(-7) == "knc.svg") {
        url = url.slice(0, -7) + "kyber.png";
      }
      return `<div class="trade-order-width-acceptable"><img class='img-icon' width=20 height=20 src='${url}'> ${tradeCurrency}/${market_currency}</div>`;
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
      return `<div class="trade-order-width-acceptable" style='display: flex; justify-content: flex-start;'><div class='down h-3 w-3 rounded-full mr-2 bg-${icon}''></div><div>${label}</div></div>`;
    }
  },
  computed: {
    updatedWidth() {
      return parseInt(screen.width);
    }
  },
  async mounted() {
    if (this.orderHash)
      await this.searchByOrderHash();
    else if (Object.keys(this.orderData).length != 0) {
      this.trades = [this.orderData];
      this.orderType = "trade";
    }
  }
};
</script>

<style lang="scss">
.status-options {
  font-weight: 400;
  display: flex;
  justify-content: left;
}

.flex-center {
  .vs-table-text {
    justify-content: center !important;
  }
}

.img-icon {
  display: inline !important;
  position: relative;
  top: 5px;
}

.down {
  position: relative;
  top: 4px;
}
.expanded-icons {
  svg {
    width: 19px;
    height: 19px;
  }
}
.hide {
  display: none !important;
}

.show {
  display: flex !important;
}
.trade-order-width-acceptable {
  width: max-content !important;
}
</style>
<style scoped lang="scss">

  .red {
    color: rgba(var(--vs-danger), 1) !important;
  }

  .green {
    color: rgba(var(--vs-success), 1) !important;
  }

  .position-long {
    margin: auto 0px;
    letter-spacing: 0px;
    font-size: 12px;
    background-color: rgb(53, 118, 253);
    color: white;
    padding: 5px;
    border-radius: 8px;
  }

  .position-short {
    margin: auto 0px;
    letter-spacing: 0px;
    font-size: 12px;
    background-color: rgb(238, 238, 238);
    color: rgb(153, 153, 153);
    padding: 5px;
    border-radius: 8px;
  }

  .launch-icon {
    position: relative;
    bottom: 2px;
    left: 2px;
  }
  .center-align {
    text-align: center;
  }
</style>