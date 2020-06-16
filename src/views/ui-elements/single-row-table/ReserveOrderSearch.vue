<template>
  <vx-card class="mt-2 mb-5" v-if="reserves.length > 0">
    <vs-row vs-type="flex" vs-justify="flex-start" vs-align="center">
      <vs-col>
        <h5 class="p-3">RESERVE ORDER</h5>
      </vs-col>
    </vs-row>
    <vs-row>
      <vs-col vs-w="12">
        <vs-table style="width: 100%;" :hoverFlat="true" :data="reserves">
          <template slot="header"></template>
          <template slot="thead">
            <vs-th><div class="reserve-order-width-acceptable">AGE</div></vs-th>
            <vs-th class="flex-center"><div class="reserve-order-width-acceptable">ORDER ID</div></vs-th>
            <vs-th><div class="reserve-order-width-acceptable">INITIAL AMOUNT</div></vs-th>
            <vs-th><div class="reserve-order-width-acceptable">CURRENT AMOUNT</div></vs-th>
            <vs-th><div class="reserve-order-width-acceptable">GAINS</div></vs-th>
            <vs-th class="flex-center"><div class="reserve-order-width-acceptable">DURATION (D)</div></vs-th>
            <vs-th><div class="reserve-order-width-acceptable">STATUS</div></vs-th>
          </template>
          <template slot-scope="{data}">
            <vs-tr
              :id="indextr"
              class="pointer row-expand"
              :key="indextr"
              v-for="(tr, indextr) in data"
            >
              <vs-td :data="data[indextr].id"><div class="reserve-order-width-acceptable">{{formatDate(data[indextr].added_on)}}</div></vs-td>
              <vs-td :data="data[indextr].id" class="center-align"><div class="reserve-order-width-acceptable m-auto">{{tr.id}}</div></vs-td>
              <vs-td
                v-html="convertToHtml(data[indextr].currency.image_url, data[indextr].amount, data[indextr].currency.short_name)"
                :data="data[indextr].id"
              ></vs-td>
              <vs-td class="left-align" :data="data[indextr].id">
                <div class="reserve-order-width-acceptable">
                  {{convertToPreciseFloat(data[indextr].current_amount, 2)}}
                  {{data[indextr].currency.short_name}}
                </div>
              </vs-td>

              <vs-td
                :data="data[indextr].id"
              >
                <div class="reserve-order-width-acceptable">
                  {{convertToPreciseFloat(data[indextr].gains_new, 2)}} {{data[indextr].currency.short_name}}
                </div>
              </vs-td>

              <vs-td class="center-align" :data="data[indextr].id">
                <div class="reserve-order-width-acceptable m-auto">
                  {{data[indextr].days_passed}}
                </div>
              </vs-td>
              <vs-td
                :data="data[indextr].id"
                v-html="getStatus(data[indextr].status,
                data[indextr].cancel_status,
                data[indextr].completed_status
                )"
              ></vs-td>
            </vs-tr>
          </template>
        </vs-table>
      </vs-col>
    </vs-row>
    <vs-row class="mt-5">
      <vs-col vs-w="12">
        <vs-row>
          <vs-col style="padding: 0;" vs-w="12">
            <vs-row
              vs-type="flex"
              vs-justify="space-around"
              style="background: rgba(157, 159, 162, 0.1); padding: 10px; width: 100%;"
            >
              <vs-col
                vs-lg="4"
                vs-sm="6"
                style="text-align: left;"
              >Gains: {{(reserves[0].gains_new)?reserves[0].gains_new.toFixed(2):0}}%</vs-col>
              <vs-col vs-lg="4" vs-sm="6" style="text-align: center;">Duration(D): {{reserves[0].days_passed}}</vs-col>
            </vs-row>
          </vs-col>
          <vs-col class="pl-0" vs-w="12" :class="{'pl-0 pr-0': updatedWidth < 768}">
            <vs-row vs-type="flex" vs-justify="space-between">
              <vs-col class="pl-0" vs-lg="8" vs-sm="12" vs-align="center" vs-justify="center">
                <expandable-row-graph
                  v-if="orderType == 'reserve'"
                  :orderType="orderType"
                  :orderData="reserves[0]"
                  :primaryCurrency="primaryCurrencySelected"
                ></expandable-row-graph>
                <div class="center-align pb-4">{{reserves[0].currency.short_name}} vs {{primaryCurrencySelected.short_name}}</div>
              </vs-col>
              <vs-col
                style="flex-direction: column; justify-content: space-evenly;"
                vs-type="flex"
                vs-align="center"
                vs-lg="4"
                vs-sm="12"
                :class="{'pl-0 pr-0': updatedWidth < 768}"
              >
                <vs-row vs-justify="center" vs-align="center">
                  <vs-col :class="{'pl-0': updatedWidth >= 768}" vs-lg="1" vs-sm="1" vs-xs="2" vs-align="center" vs-type="flex">
                    <feather-icon class="expanded-icons" style="color: rgb(53, 118, 253);" icon="SendIcon"></feather-icon>
                  </vs-col>
                  <vs-col :class="{'pl-2': updatedWidth > 768, 'pl-0' : updatedWidth <= 768}" vs-align="center" vs-xs="10" vs-sm="11" vs-lg="11">
                    <vs-row vs-type="flex" vs-justify="space-between" vs-align="center">
                      <vs-col style="padding: 0;" vs-w="12" vs-align="center">
                        <span>Start Date: {{getHypenatedDate(reserves[0].added_on)}}</span>
                        <a target="_blank" :href="reserves[0].etherscan_url">
                          <span class="icon-wrapper etherscan-link">
                            <vs-icon size="12px" icon="launch" class="launch-icon"></vs-icon>
                          </span>
                        </a>
                      </vs-col>
                    </vs-row>
                  </vs-col>
                </vs-row>
                <vs-row vs-justify="center" vs-align="center">
                  <vs-col :class="{'pl-0': updatedWidth >= 768}" vs-align="center" vs-type="flex" vs-sm="1" vs-xs="2" vs-lg="1">
                    <feather-icon class="expanded-icons" style="color: rgb(53, 118, 253);" icon="CalendarIcon"></feather-icon>
                  </vs-col>
                  <vs-col :class="{'pl-2': updatedWidth > 768, 'pl-0' : updatedWidth <= 768}" vs-align="center" vs-xs="10" vs-lg="11" vs-sm="11">
                    <vs-row vs-type="flex" vs-justify="space-between" vs-align="center">
                      <vs-col style="padding: 0;" vs-w="10">
                        <span>End Date: {{getHypenatedDate(reserves[0].ending_on)}}</span>
                        <a target="_blank" :href="reserves[0].end_etherscan_url">
                          <span
                            v-if="reserves[0] && reserves[0].end_etherscan_url"
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
      </vs-col>
    </vs-row>
  </vx-card>
</template>
<script>
import SearchService from "@/services/SearchService";
import VueApexCharts from "vue-apexcharts";
import { getReserveOrderStatus } from "@/utils/util.js";
import { formatDate } from "@/static/util.js";
import ExpandableRowGraph from "@/views/ExpandableRowGraph.vue";

export default {
  data() {
    return {
      reserves: [
        {
          ending_on: "2047-05-30T12:32:25.000Z",
          added_on: "2020-01-12T12:30:26.068Z",
          etherscan_url:
            "https://etherscan.io/tx/0x80e6b05cf045bb13e5f751bb5d707b90210c6fa0aecbdf0f8b0090cca04bdf57",
          error_message: null,
          order_hash:
            "0x9bf6e4bf27083d71b4da625398228e84aa79a8bbe2a97275484ed8a94c4ece00",
          id: 8281,
          amount: 0.06372,
          amount_primary: 9.4993776,
          days_passed: 1,
          tenure: 10000,
          current_amount: 0.06372,
          current_amount_primary: 9.4993776,
          gains: 0,
          gains_primary: 0,
          gains_new: 0,
          gains_new_primary: 0,
          status: 1,
          cancel_status: 5,
          completed_status: 5,
          currency: {
            decimal_count: 18,
            id: 14,
            name: "Ethereum",
            short_name: "ETH",
            image_url:
              "https://s3.ap-south-1.amazonaws.com/nuo-public/nuo_web/images/eth.png",
            base_address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
          }
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
  methods: {
    getHypenatedDate(date) {
      var d = new Date(date);
      return d.toDateString();
    },
    formatDate(val) {
      return formatDate(val);
    },
    convertToPreciseFloat(val, places) {
      if (Number.isFinite(val)) {
        return val.toFixed(places);
      } else {
        return val;
      }
    },
    convertToHtml(url, reserveAmount, reserveCurrency) {
      if (url.slice(-7) == "knc.jpg" || url.slice(-7) == "knc.svg") {
        url = url.slice(0, -7) + "kyber.png";
      }
      reserveAmount = this.convertToPreciseFloat(reserveAmount, 2);
      return `<div class='reserve-order-width-acceptable'><img class='img-icon' width=20 height=20 src='${url}'> ${reserveAmount} ${reserveCurrency}</div>`;
    },
    getStatus(status, cancel_status, completed_status) {
      var computedStatus = getReserveOrderStatus(
        status,
        cancel_status,
        completed_status
      );
      var label = computedStatus.label;
      var icon = computedStatus.icon;
      return `<div class='reserve-order-width-acceptable' style="display: flex; align-items: center; justify-content: flex-start;"><div class='h-3 bottom w-3 rounded-full mr-2 bg-${icon}''></div><div>${label}</div></div>`;
    },
    async searchByOrderHash() {
      let data = await SearchService.searchByOrderHash(
        this.orderHash,
        this.primaryCurrency,
        "reserve"
      );
      this.reserves = data.data.data;
      this.orderType = "reserve";
    }
  },
  async mounted() {
    if (this.orderHash) await this.searchByOrderHash();
    else if (Object.keys(this.orderData).length != 0) {
      this.reserves = [this.orderData];
      this.orderType = "reserve";
    }
  },
  computed: {
    updatedWidth() {
      return parseInt(screen.width);
    },
    primaryCurrencySelected() {
      return this.$store.state.primaryCurrency;
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
.reserve-order-width-acceptable {
  width: max-content !important;
}
</style>
<style scoped lang="scss">
  .launch-icon {
    position: relative;
    bottom: 2px;
    left: 2px;
  }
  .center-align {
    text-align: center;
  }
</style>