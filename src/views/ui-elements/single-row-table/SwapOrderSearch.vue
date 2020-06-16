<template>
  <vx-card id= "swap-order-search" v-if="swaps.length > 0" class="mt-2 mb-5">
    <vs-row vs-type="flex" vs-justify="flex-start" vs-align="center">
      <vs-col>
        <h5 class="p-3">SWAP ORDER</h5>
      </vs-col>
    </vs-row>
    <vs-row>
      <vs-col vs-w="12">
        <vs-table style="width: 100%;" :hoverFlat="true" :data="swaps">
          <template slot="header"></template>
          <template slot="thead">
            <vs-th><div class="swap-order-width-acceptable">AGE</div></vs-th>
            <vs-th class="flex-center"><div class="swap-order-width-acceptable">ORDER ID</div></vs-th>
            <vs-th><div class="swap-order-width-acceptable">TOKENS</div></vs-th>
            <vs-th><div class="swap-order-width-acceptable">SLIPPAGE</div></vs-th>
            <vs-th><div class="swap-order-width-acceptable">SENT AMT</div></vs-th>
            <vs-th><div class="swap-order-width-acceptable">RECEIVE AMT</div></vs-th>
            <vs-th><div class="swap-order-width-acceptable">STATUS</div></vs-th>
          </template>
          <template>
              <vs-tr class="row-expand">
              <vs-td>
                <div class="swap-order-width-acceptable">
                  {{formatDate(orderData.added_on)}}
                </div>
              </vs-td>
              <vs-td class="center-align">
                <transition name="list" mode="out-in">
                  <div class="swap-order-width-acceptable m-auto">
                      {{orderData.id}}
                  </div>
                </transition>
              </vs-td>
              <vs-td style="white-space: nowrap"
              >
              <div class="disp-fl"><img class="image-icon" :src="orderData.source_currency.image_url">{{orderData.source_currency.short_name}}/{{orderData.destination_currency.short_name}}
              </div>
              </vs-td>

              <vs-td class="center-align">
                <div class="swap-order-width-acceptable">
                  {{orderData.slippage | handleFloat(4)}}%
                </div>
              </vs-td>

              <vs-td class="center-align" >
                <div class="swap-order-width-acceptable">
                  {{orderData.source_amount | handleFloat(4)}} {{orderData.source_currency.short_name}}
                </div>
              </vs-td>
              <vs-td class="center-align">
                <div class="swap-order-width-acceptable">
                  {{orderData.destination_amount | handleFloat(4)}}{{orderData.destination_currency.short_name}}
                </div>
              </vs-td>
              <vs-td v-if="orderData.status === 1" class="center-align">
                <div class="swap-order-width-acceptable">
                  <div class="rounded-border oval-green"></div>
                  Completed
                </div>
              </vs-td>
               <vs-td v-if="orderData.status === 2" class="center-align">
                <div class="swap-order-width-acceptable">
                  <div class="rounded-border oval-red"></div>
                  Failed
                </div>
              </vs-td>
               <vs-td v-if="orderData.status != 1 && orderData.status != 2" class="center-align">
                <div class="swap-order-width-acceptable">
                  <div class="rounded-border oval-blue"></div>
                  Pending
                </div>
              </vs-td>
            </vs-tr>
          </template>
        </vs-table>
      </vs-col>
    </vs-row>
    <vs-row class="mt-5">
      <vs-col>
        <vs-row vs-type="flex" vs-justify="space-between">
            <vs-col :style="(updatedWidth > 768)?'padding-left: 0;':''" vs-w="8" vs-align="center" vs-justify="center">
            <expandable-row-table 
                :distribution="orderData.distribution"
                :source_currency="orderData.source_currency.short_name"
                :destination_currency="orderData.destination_currency.short_name"
                :source_amount="orderData.source_amount"
                :destination_amount="orderData.destination_amount"
              ></expandable-row-table>
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
                <span>Fee: {{$store.state.primaryCurrency.symbol}}{{(swaps[0]?parseInt(swaps[0].final_fee_primary).toFixed(2):0)}}</span>
              </vs-col>
            </vs-row>
            <vs-row vs-justify="center" vs-align="center" :class="{'pt-1 pb-1': updatedWidth <= 768}">
              <vs-col vs-lg="1" vs-sm="1" vs-xs="2" vs-align="center" :class="{'pl-0' : updatedWidth > 768}" vs-type="flex">
                <feather-icon class="expanded-icons" style="color: rgb(53, 118, 253);" icon="SendIcon"></feather-icon>
              </vs-col>
              <vs-col :class="{'pl-2': updatedWidth > 768, 'pl-0 pt-1 pb-1': updatedWidth <= 768}" vs-align="center" vs-lg="11" vs-sm="10">
                <vs-row vs-type="flex" vs-justify="space-between" vs-align="center">
                  <vs-col style="padding: 0;" vs-w="12" vs-align="center" vs-type="flex">
                    <span>Swapped On: {{getHypenatedDate((swaps[0])?swaps[0].added_on:"")}}</span>
                    <a target="_blank" :href="(swaps[0])?swaps[0].etherscan_url:''">
                      <span
                        v-if="(swaps[0])?swaps[0].etherscan_url:''"
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
import ExpandableRowTable from "@/views/ExpandableRowTable.vue";

export default {
  data() {
    return {
      swaps: [],
      orderType: ""
    };
  },
  components: {
    VueApexCharts,
    ExpandableRowTable
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
        "exchange"
      );
      this.swaps = data.data.data;
      this.orderType = "exchange"
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
      return `<div class="swap-order-width-acceptable"><img class='img-icon' width=20 height=20 src='${url}'> ${tradeCurrency}/${market_currency}</div>`;
    },
    getStatus(
      status,
      cancel_status,
      completed_status,
      stop_loss_status,
      take_profit_status
    ) {
      var computedStatus = getSwapOrderStatus(
        status,
        cancel_status,
        completed_status,
        stop_loss_status,
        take_profit_status
      );
      var label = computedStatus.label;
      var icon = computedStatus.icon;
      return `<div class="swap-order-width-acceptable" style='display: flex; justify-content: flex-start;'><div class='down h-3 w-3 rounded-full mr-2 bg-${icon}''></div><div>${label}</div></div>`;
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
      this.swaps = [this.orderData];
      this.orderType = "swap";
    }
  }
};
</script>

<style lang="scss">
.disp-fl {
  display: flex;
}
.image-icon {
  margin-right: 5%;
  height: 20px;
  width: 20px;
}
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
.swap-order-width-acceptable {
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

<style>
#swap-order-search .table {
  width: 100% !important;
}
</style>