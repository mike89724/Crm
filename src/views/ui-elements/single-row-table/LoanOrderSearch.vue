<template>
  <vx-card v-if="loans.length > 0" class="mt-2 mb-5">
    <vs-row vs-type="flex" vs-justify="flex-start" vs-align="center">
      <vs-col>
        <h5 class="p-3" >LOAN ORDER</h5>
      </vs-col>
    </vs-row>
    <vs-row>
      <vs-col vs-w="12">
        <vs-table style="width: 100%;" :hoverFlat="true" :data="loans">
          <template slot="header"></template>
          <template slot="thead">
            <vs-th><div class="loan-order-width-acceptable">START DATE</div></vs-th>
            <vs-th><div class="loan-order-width-acceptable m-auto ">ORDER ID</div></vs-th>
            <vs-th><div class="loan-order-width-acceptable">LOAN</div></vs-th>
            <vs-th><div class="loan-order-width-acceptable">COLLATERAL</div></vs-th>
            <vs-th class="flex-center"><div class="loan-order-width-acceptable m-auto">CURRENT LEVERAGE</div></vs-th>
            <vs-th><div class="loan-order-width-acceptable">PREMIUM</div></vs-th>
            <vs-th class="flex-center"><div class="loan-order-width-acceptable m-auto">DURATION (D)</div></vs-th>
            <vs-th><div class="loan-order-width-acceptable">STATUS</div></vs-th>
          </template>
          <template slot-scope="{data}">
            <vs-tr :id="indextr" :key="indextr" v-for="(tr, indextr) in data">
              <vs-td :data="data[indextr].id"><div class="loan-order-width-acceptable">{{formatDate(data[indextr].added_on)}}</div></vs-td>
              <vs-td :data="data[indextr].id" class="center-align"><div class="loan-order-width-acceptable m-auto">{{data[indextr].id}}</div></vs-td>
              <vs-td
                v-html="convertToHtml(data[indextr].loan_currency.image_url, data[indextr].loan_amount, data[indextr].loan_currency.short_name)"
                :data="data[indextr].id"
              ></vs-td>
              <vs-td
                :data="data[indextr].id"
                v-html="convertToHtml(data[indextr].collateral_currency.image_url, data[indextr].collateral_amount, data[indextr].collateral_currency.short_name)"
              ></vs-td>

              <vs-td :data="data[indextr].id" class="center-align">
                <div class="blue loan-order-width-acceptable m-auto">{{convertToPreciseFloat(data[indextr].current_leverage, 1)}}x</div>
              </vs-td>
              <vs-td
                class="center-align"
                :data="data[indextr].id"
              >
                <div class="loan-order-width-acceptable">
                  {{convertToPreciseFloat(data[indextr].premium, 2)}} {{data[indextr].loan_currency.short_name}}
                </div>
              </vs-td>
              <vs-td class="center-align" :data="data[indextr].id">
                <div class="loan-order-width-acceptable m-auto">
                  <span class="blue">{{(data[indextr].days_passed)?data[indextr].days_passed:0}}</span> / {{data[indextr].tenure}}
                </div>
              </vs-td>
              <vs-td
                :data="data[indextr].id"
                v-html="getStatus(data[indextr].status,
                  data[indextr].cancel_status,
                  data[indextr].completed_status,
                  data[indextr].defaulted_status
                  )"
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
          style="background: rgba(157, 159, 162, 0.1); padding: 10px; width: 100%;"
        >
          <vs-col vs-lg="4" vs-xs="12" class="premium-col">Premium: {{(loans[0].premium)?loans[0].premium.toFixed(2):"0"}} {{loans[0].loan_currency.short_name}}</vs-col>
          <vs-col
            vs-lg="4" vs-xs="12"
            class="init-leverage-col"
          >Initial Leverage: {{(loans[0].initial_leverage)?loans[0].initial_leverage.toFixed(2):"0"}}x</vs-col>
          <vs-col
            vs-lg="4" vs-xs="12"
            class="curr-leverage-col"
          >Current Leverage: {{(loans[0].current_leverage)?loans[0].current_leverage.toFixed(2):"0"}}x</vs-col>
        </vs-row>
      </vs-col>
      <vs-col class="pl-0" vs-w="12">
        <vs-row vs-type="flex" vs-justify="space-between">
          <vs-col class="pl-0" vs-lg="8" vs-sm="12" vs-align="center" vs-justify="center">
            <expandable-row-graph
              v-if="orderType=='loan'"
              :orderType="orderType"
              :orderData="loans[0]"
              :primaryCurrency="$store.state.primaryCurrency"
            ></expandable-row-graph>
          </vs-col>
          <vs-col
            style="flex-direction: column; justify-content: space-evenly;"
            vs-type="flex"
            vs-align="center"
            vs-sm="12"
            vs-lg="4"
            :class="{'pl-0 pr-0': updatedWidth < 768}"
          >
            <vs-row :class="{'pt-1 pb-1': updatedWidth < 768}" vs-justify="center" vs-type="flex" vs-align="center">
              <vs-col vs-lg="1" vs-sm="1" vs-xs="2" :class="{'pl-0': updatedWidth >= 768}" vs-align="center" vs-type="flex">
                <feather-icon class="expanded-icons" style="color: rgb(53, 118, 253);" icon="SendIcon"></feather-icon>
              </vs-col>
              <vs-col :class="{'pl-0 pr-0': updatedWidth < 768}" vs-align="center" vs-lg="11" vs-sm="11" vs-xs="10">
                <vs-row vs-type="flex" vs-justify="space-between" vs-align="center">
                  <vs-col style="padding: 0;" vs-w="12" vs-align="center">
                    <span>Start Date: {{getHypenatedDate(loans[0].added_on)}}</span>
                    <a target="_blank" :href="loans[0].etherscan_url">
                      <span class="icon-wrapper etherscan-link">
                        <vs-icon size="12px" icon="launch" class="launch-icon"></vs-icon>
                      </span>
                    </a>
                  </vs-col>
                </vs-row>
              </vs-col>
            </vs-row>
            <vs-row :class="{'pt-1 pb-1': updatedWidth < 768}" vs-justify="center" vs-align="center" vs-type="flex">
              <vs-col vs-sm="1" vs-lg="1" vs-xs="2" :class="{'pl-0': updatedWidth >= 768}" vs-align="center" vs-type="flex">
                <feather-icon class="expanded-icons" style="color: rgb(53, 118, 253);" icon="CalendarIcon"></feather-icon>
              </vs-col>
              <vs-col :class="{'pl-0 pr-0': updatedWidth < 768}" vs-align="center" vs-xs="10" vs-sm="11" vs-lg="11">
                <vs-row vs-type="flex" vs-justify="space-between" vs-align="center">
                  <vs-col style="padding: 0;" vs-align="center" vs-w="12">
                    <span>End Date: {{getHypenatedDate(loans[0].ending_on)}}</span>
                    <a target="_blank" :href="loans[0].end_etherscan_url">
                      <span v-if="loans[0] && loans[0].end_etherscan_url" class="icon-wrapper etherscan-link">
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
import { getLoanOrderStatus } from "@/utils/util.js";
import { formatDate } from "@/static/util.js";
import ExpandableRowGraph from "@/views/ExpandableRowGraph.vue";

export default {
  data() {
    return {
      loans: [
        {
          is_campaign_activated: 2,
          campaign_activation_message: null,
          buffer: 50,
          gains_new_in_position_currency: null,
          collateral_amount_after_termination: null,
          closing_trade_amount_after_termination: null,
          initial_exit_price: null,
          initial_exit_price_primary: null,
          current_exit_price: null,
          current_exit_price_primary: null,
          current_price: null,
          current_price_primary: null,
          position_type: null,
          position_amount: null,
          position_amount_primary: null,
          entry_price: null,
          entry_price_primary: null,
          version: 3,
          fee: 0,
          fee_primary: 0,
          gains_new: null,
          gains_new_primary: null,
          ending_on: "2020-04-02T08:14:56.000Z",
          take_profit: null,
          gains: 0,
          stop_loss: null,
          initial_leverage: 0.300000244145127,
          error_message: null,
          end_etherscan_url: null,
          etherscan_url:
            "https://etherscan.io/tx/0x8f1c02773f67ae181d08a62602b6ab019b46798fa7119ff26392493745b5b9b0",
          order_hash:
            "0xd4970021eb33c597388d0ccb9dab5bb722712c3aa38404b866f24536f9c17b88",
          repay_amount: "46.88236791283370518616",
          repay_amount_primary: 46.81590797192658,
          current_leverage: 0.2877618563564258,
          liquidation_leverage: 0.6602207969698326,
          days_passed: 1,
          premium: 1.46448045708758,
          tenure: 90,
          id: 18011,
          loan_amount: 46.1391,
          collateral_amount: 806.311425,
          state: 1,
          loan_amount_primary: 46.07369370769818,
          collateral_amount_primary: 160.11049654416556,
          trade_amount: 0,
          trade_amount_primary: 0,
          status: 1,
          cancel_status: 5,
          defaulted_status: 5,
          completed_status: 5,
          stop_loss_status: 5,
          take_profit_status: 5,
          is_loan: 1,
          is_margin_trade: 2,
          added_on: "2020-01-03T08:13:14.228Z",
          loan_currency: {
            decimal_count: 6,
            id: 27,
            name: "USD Coin",
            short_name: "USDC",
            image_url:
              "https://s3.ap-south-1.amazonaws.com/nuo-public/nuo_web/images/usdc.png",
            base_address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
          },
          collateral_currency: {
            decimal_count: 18,
            id: 16,
            name: "Kyber",
            short_name: "KNC",
            image_url:
              "https://s3.ap-south-1.amazonaws.com/nuo-public/nuo_web/images/knc.jpg",
            base_address: "0xdd974d5c2e2928dea5f71b9825b8b646686bd200"
          },
          trade_currency: {},
          closing_trade_currency: {},
          market_currency: {},
          position_currency: {},
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
      type: String,
      required: true
    },
    orderData: {
      type: Object
    }
  },
  async mounted() {
    if (this.orderHash) {
      await this.searchByOrderHash();
    } else if (Object.keys(this.orderData).length != 0) {
      this.loans = [this.orderData];
      this.orderType = "loan";
    }
  },
  computed: {
    updatedWidth() {
      return parseInt(screen.width);
    }
  },
  methods: {
    async searchByOrderHash() {
      let data = await SearchService.searchByOrderHash(
        this.orderHash,
        this.primaryCurrency,
        "loan"
      );
      this.loans = data.data.data;
      this.orderType = "loan";
    },
    getHypenatedDate(date) {
      var d = new Date(date);
      return d.toDateString();
    },
    convertToPreciseFloat(value, places) {
      if (value) {
        return value.toFixed(places);
      }
      return value;
    },
    formatDate(val) {
      return formatDate(val);
    },
    convertToHtml(url, loanAmount, loanCurrency) {
      if (url.slice(-7) == "knc.jpg" || url.slice(-7) == "knc.svg") {
        url = url.slice(0, -7) + "kyber.png";
      }
      loanAmount = this.convertToPreciseFloat(loanAmount, 2);
      return `<div class="loan-order-width-acceptable"><img class='img-icon' width=20 height=20 src='${url}'> ${loanAmount} ${loanCurrency}</div>`;
    },
    getStatus(status, cancel_status, completed_status, defaulted_status) {
      var computedStatus = getLoanOrderStatus(
        status,
        cancel_status,
        completed_status,
        defaulted_status
      );
      var label = computedStatus.label;
      var icon = computedStatus.icon;
      return `<div style='display: flex; justify-content: flex-start;'><div class='h-3 down w-3 rounded-full mr-2 bg-${icon}''></div><div class="loan-order-width-acceptable">${label}</div>`;
    }
  }
};
</script>
<style lang="scss">
.expanded-icons {
  svg {
    width: 19px;
    height: 19px;
  }
}
.loan-order-width-acceptable {
  width: max-content !important;
}
.bg-info {
  background-color: #007bff !important;
}
</style>
<style scoped lang="scss">
  .launch-icon {
    position: relative;
    bottom: 2px;
    left: 2px;
  }
  .premium-col {
    text-align: left;
    min-width: 150px;
  }
  .init-leverage-col {
    text-align: center;
    min-width: 200px;
  }
  .curr-leverage-col {
    text-align: center;
    min-width: 200px;
  }
  @media only screen and (max-width: 768px) {
    .premium-col {
      text-align: center;
      min-width: 150px;
    }
  }
</style>