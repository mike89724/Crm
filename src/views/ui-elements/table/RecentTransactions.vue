<template>
  <vx-card id="recent-transactions" class="relative">
    <div slot="no-body">
      <vs-row vs-type="flex" vs-justify="space-between">
        <vs-col vs-w="4">
          <h5 class="p-5">RECENT TRANSACTIONS</h5>
        </vs-col>
        <vs-col style="display: flex; justify-content: flex-end; align-items: center;" v-if="showIcon" vs-w="2">
          <feather-icon
            @click="openNewRoute"
            style="cursor: pointer; height: 15px; width: 15px;"
            icon="ArrowUpRightIcon"
          ></feather-icon>
        </vs-col>
      </vs-row>
      <vs-row vs-type="flex">
        <vs-col vs-w="12" style="width: 100%;" :class="{'hide': !transition}">
          <vs-table style="width: 100%;" :data="frames">
            <template slot="header"></template>
            <template slot="thead">
              <vs-th>LOADING</vs-th>
            </template>
            <template slot-scope="{data}">
              <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                <vs-td v-html="getFrame('row-thin')"></vs-td>
              </vs-tr>
            </template>
          </vs-table>
        </vs-col>
        <vs-col vs-w="12" :class="{'hide': transition}">
          <vs-table style="width: 100%;" :hoverFlat="true" v-if="showTable" :data="transactions">
            <template slot="header"></template>
            <template slot="thead">
              <vs-th><div class="transaction-width-acceptable">TRANSACTION HASH</div></vs-th>
              <vs-th><div class="transaction-width-acceptable">AGE</div></vs-th>
              <vs-th><div class="transaction-width-acceptable">FUNCTION</div></vs-th>
              <vs-th><div class="transaction-width-acceptable">BLOCK NUMBER</div></vs-th>
              <vs-th><div class="transaction-width-acceptable">GAS USED</div></vs-th>
            </template>
            <template slot-scope="{data}">
              <vs-tr :id="tr.id" :key="indextr" v-for="(tr, indextr) in data">
                <vs-td>
                  <vs-row vs-type="flex" class="transaction-width-acceptable" vs-justify="flex-start" vs-align="center">
                    <vs-col style="padding: 0;" class="transaction-width-acceptable" vs-w="12">
                      <a
                      @click="searchByTransactionHash(tr.transaction_hash)"
                      class="transaction-width-acceptable"
                      style="cursor: pointer;"
                      >
                      {{clipLarge(tr.transaction_hash)}}
                      </a>
                    </vs-col>
                  </vs-row>
                </vs-td>
                <vs-td :data="currentTime"><div class="transaction-width-acceptable">{{formatDate(tr.added_on)}}</div></vs-td>
                <vs-td>
                  <div class="transaction-width-acceptable">
                    {{getFunctionName(tr.contract_method_name)}}
                  </div>
                </vs-td>
                <vs-td>
                  <vs-row vs-type="flex" vs-justify="flex-start" vs-align="center">
                    <vs-col style="padding: 0;" vs-w="12">
                      <a
                        :href="`https://www.etherscan.io/block/${tr.block_number}`"
                        target="_blank"
                      >
                      {{tr.block_number}}
                      </a>
                    </vs-col>
                  </vs-row>
                </vs-td>

                <vs-td>
                  <div class="transaction-width-acceptable">
                    {{data[indextr].gas_used}}
                  </div>
                </vs-td>
              </vs-tr>
            </template>
          </vs-table>
        </vs-col>
      </vs-row>
      <div v-if="showPagination" class="table-page-change mt-3 pb-3">
        <vs-row vs-w="12" vs-justify="space-between">
          <vs-col vs-sm="2" vs-lg="2" :class="{'pt-1': updatedWidth < 768}" vs-justify="left">
            <vs-dropdown class="cursor-pointer" vs-trigger-click>
              <vs-button
                class="btn-drop table-page-btn"
                size="small"
                type="border"
                icon="expand_more"
              ><span class="items-text">Items: </span>{{pageSize}}</vs-button>
              <vs-dropdown-menu class="items-per-page-dropdown">
                <vs-dropdown-item @click="pageSize = 10">
                  <span>10</span>
                </vs-dropdown-item>
                <vs-dropdown-item @click="pageSize = 20">
                  <span>20</span>
                </vs-dropdown-item>
                <vs-dropdown-item @click="pageSize = 50">
                  <span>50</span>
                </vs-dropdown-item>
                <vs-dropdown-item @click="pageSize = 100">
                  <span>100</span>
                </vs-dropdown-item>
              </vs-dropdown-menu>
            </vs-dropdown>
          </vs-col>
          <vs-col vs-lg="4" vs-sm="10" vs-justify="right">
            <div>
              <vs-pagination :max="5" :total="getPagesCount" v-model="activePage"></vs-pagination>
            </div>
          </vs-col>
        </vs-row>
      </div>
      <div v-if="!showPagination" class="p-6 pb-2 pt-2">
        <span style="cursor: pointer; color: #3576FD;" @click="openNewRoute()">Show More</span>
      </div>
    </div>
  </vx-card>
</template>
<script>
import TransactionDetailService from "@/services/TransactionDetailService.js";
import { getFrame } from "@/utils/util.js";
import { formatDate } from "@/static/util";
import Pusher from "pusher-js";
import {pusherKey} from "@/config/settings.js"

export default {
  data() {
    return {
      transition: true,
      frames: new Array(20),
      showTable: true,
      activePage: 1,
      pageSize: 20,
      orderCount: 10,
      transactions: [],
      currentTime: (new Date()).getMilliseconds()
    };
  },
  computed: {
    getPagesCount() {
      var maxItems = parseFloat(this.pageSize);
      var totalNumberOfOrders = parseFloat(this.orderCount);
      return Math.ceil(totalNumberOfOrders / maxItems);
    },
    updatedWidth() {
      return parseInt(screen.width);
    }
  },
  async mounted() {
    var pusher = new Pusher(pusherKey, {
      cluster: "ap2",
      forceTLS: true
    });
    var channel = pusher.subscribe("order");
    var self = this;
    channel.bind("transaction", function(data) {
      if (self.$store.state.pusher) {
        let orderId = data.id;
        var orderIdMatch = false;
        let matchedIndex = -1;
        self.transactions.forEach((item, index, arr) => {
          if (item.id == orderId) {
            orderIdMatch = true;
            arr[index] = data;
            matchedIndex = index;
          }
        });
        if (orderIdMatch == false) {
          self.transactions.pop();
          self.transactions.unshift(data);
          self.orderCount++;
          self.showTable = false;
          self.$nextTick(() => {
            self.showTable = true;
          });
          setTimeout(() => {
            let topRow = document.getElementById(data.id);
            if (topRow)
              topRow.className += " fade-1";
          }, 100);
          setTimeout(() => {
            let topRow = document.getElementById(data.id);
            if (topRow)
              topRow.className += " fade-2";
          }, 300);
          setTimeout(() => {
            let topRow = document.getElementById(data.id);
            if (topRow)
              topRow.className += " fade-3";
          }, 600);
          setTimeout(() => {
            let topRow = document.getElementById(data.id);
            if (topRow)
              topRow.className += " fade-4";
          }, 900);
          setTimeout(() => {
            let topRow = document.getElementById(data.id);
            if (topRow)
              topRow.className += " fade-5";
          }, 1200);
        } else {
          self.transactions.splice(matchedIndex, 1);
          self.transactions.unshift(data);
          self.showTable = false;
          self.$nextTick(() => {
            self.showTable = true;
          });
          setTimeout(() => {
            let topRow = document.getElementById(data.id);
            topRow.className += " fade-1";
          }, 0);
          setTimeout(() => {
            let topRow = document.getElementById(data.id);
            topRow.className += " fade-2";
          }, 300);
          setTimeout(() => {
            let topRow = document.getElementById(data.id);
            topRow.className += " fade-3";
          }, 600);
          setTimeout(() => {
            let topRow = document.getElementById(data.id);
            topRow.className += " fade-4";
          }, 900);
          setTimeout(() => {
            let topRow = document.getElementById(data.id);
            topRow.className += " fade-5";
          }, 1200);
        }
      }
    });
    await this.recentTransactionsData();
    setInterval(this.setCurrentTime, 1000);
  },
  methods: {
    setCurrentTime() {
      this.currentTime = (new Date()).getTime();
    },
    searchByTransactionHash(txHash) {
      this.$router.push({name: 'query', params:
        {
          query: txHash
        }
      });
    },
    openNewRoute() {
      this.$ga.event({
        eventCategory: 'Home',
        eventAction: 'Clicked',
        eventLabel: "transactions"
      });
      this.$router.push({ path: "/transactions"});
    },
    getFunctionName(methodName) {
      if (!methodName) {
        return "NA";
      }
      let orderType = "";
      switch(methodName) {
        case "margin_trade_kernal_create_order":
          orderType = "Margin Trade Created";
          break;
        case "margin_trade_kernal_liquidate_trade":
          orderType = "Margin Trade Manually Liquidated";
          break;
        case "margin_trade_kernal_process_trade_for_stop_profit":
          orderType = "Margin Trade Take Profit Hit";
          break;
        case "margin_trade_kernal_process_trade_for_expiry":
          orderType = "Margin Trade Tenure Ended";
          break;
        case "margin_trade_kernal_process_trade_for_stop_loss":
          orderType = "Margin Trade Stop Loss Hit";
          break;
        case "debt_kernal_create_order":
          orderType = "Loan Created";
          break;
        case "debt_kernal_repay":
          orderType = "Loan Repaid";
          break;
        case "debt_kernal_process":
          orderType = "Loan Liquidated";
          break;
        case "trading_account_transfer_by_user":
          orderType = "User Transferred Tokens";
          break;
        case "trading_account_add_user":
          orderType = "New Wallet Linked";
          break;
        case "trading_account_remove_user":
          orderType = "Existing Wallet Removed";
          break;
        case "trading_account_factory_new_account":
          orderType = "Trading Account Created";
          break;
        case "reserve_create_order":
          orderType = "Reserve Created";
          break;
        case "reserve_cancel_order":
          orderType = "Reserve Stopped";
          break;
        case "reserve_process_order":
          orderType = "Reserve Tenure Ended";
          break;
        case "reserve_update_reserve_values_for":
          orderType = "Reserve Values Updated";
          break;
        case "update_order_cumulative_value_batch":
          orderType = "Update Order Cumulative Value Batch";
          break;
        case "trading_account_factory_new_account_by_user":
          orderType = "Trading Account Created By User";
          break;
        case "sai_dai_create_order":
          orderType = "SAI<>DAI Exchange Created";
          break;
        case "trading_account_change_implementation":
          orderType = "Trading Account Implementation Changed";
          break;
        case "nuo_exchange_create_order":
          orderType = "Swap Created";
          break;
      }
      return orderType;
    },
    getOrderType(methodName) {
      if (!methodName) {
        return "NA";
      }
      let orderType1 = "";
      let splitArray = methodName.split('_');

      if (splitArray.includes("margin") && splitArray.includes("trade")) {
        orderType1 = "Margin Trade";
      } else if (splitArray.includes("debt")) {
        orderType1 = "Loan";
      } else if (splitArray.includes("reserve")) {
        orderType1 = "Reserve";
      } else {
        orderType1 = "User Account";
      }
      return orderType1;
    },
    getFrame(size) {
      let isDark = (this.$store.state.theme == 'dark');
      return getFrame(size, isDark);
    },
    formatDate(val) {
      return formatDate(val);
    },
    clipLarge(val) {
      if (val) return val.slice(0, 15) + "...";
      else return val;
    },
    async recentTransactionsData() {
      this.transition = true;
      var transactionData = await TransactionDetailService.getTransactions(
        this.$store.state.primaryCurrency.short_name,
        this.activePage,
        this.pageSize
      );
      if (transactionData.data.data) {
        this.transactions = transactionData.data.data;
      }
      var self = this;
      if (transactionData.data.count)
        this.orderCount = transactionData.data.count;
      this.showTable = false;
      this.$nextTick(() => {
        self.showTable = true;
      });
      this.transition = false;
    },
    convertToPreciseFloat(val, places = 2) {
      if (val != "" && val != null && typeof val == "number") {
        return val.toFixed(places);
      } else {
        return 0;
      }
    }
  },
  props: {
    showFilters: {
      type: Boolean,
      default: true
    },
    showPagination: {
      type: Boolean,
      default: true
    },
    showIcon: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    activePage: async function() {
      await this.recentTransactionsData();
    },
    pageSize: async function(val) {
      this.frames = new Array(val);
      await this.recentTransactionsData();
    },
  }
};
</script>
<style scoped lang="scss">
.cursor-pointer {
  cursor: pointer !important;
}
.fade-1 {
  opacity: 0.1;
}
.fade-1.fade-2 {
  opacity: 0.2;
}
.fade-1.fade-2.fade-3 {
  opacity: 0.5;
}
.fade-1.fade-2.fade-3.fade-4 {
  opacity: 0.9;
}
.fade-1.fade-2.fade-3.fade-4.fade-5 {
  opacity: 1;
}
.bg-info {
  background-color: #007bff !important;
}
.transaction-width-acceptable {
  width: max-content !important;
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
.center-align {
  text-align: center;
}
.topAndRight {
  position: relative;
  bottom: 16px;
  left: 15px;
}
.show {
  display: flex;
}
.hide {
  display: none;
}
.launch-icon {
  height: 15px;
  width: 15px;
  cursor: pointer;
}
.icon-wrapper {
  position: relative;
  top: -5px;
  left: 0px;
  cursor: pointer;
  color: #626262;
}
.width-100 {
  width: 100px !important;
}
#recent-transactions {
  position: relative;
  top: 20px;
}
@media only screen and (max-width: 600px) {
  .width-acceptable {
    width: 110px !important;
  }
  .table-page-btn {
    padding: 0.5rem !important;
  }
  .items-text {
    display: none;
  }
}
</style>