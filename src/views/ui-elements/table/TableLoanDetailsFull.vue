<template>
  <vx-card class="relative" id="loan-table">
    <vs-row vs-type="flex" vs-justify="space-between">
      <vs-col vs-lg="8" vs-sm="6" style="display: flex; justify-content: flex-start;">
        <h5 class="pt-3 pb-3">LOAN ORDERS</h5>
      </vs-col>
      <vs-col v-if="!showFilters" vs-lg="4" vs-sm="4" style="display: flex; justify-content: flex-end; align-items: center;">
        <feather-icon
          v-if="!showFilters"
          @click="openNewRoute()"
          style="cursor: pointer; height: 15px; width: 15px;"
          icon="ArrowUpRightIcon"
        ></feather-icon>
      </vs-col>
      <vs-col vs-lg="4" vs-sm="12" vs-xs="12" style="display: flex; justify-content: flex-end;">
        <vs-row vs-type="flex" vs-justify="flex-end" vs-align="center">
          <vs-col class="status-wrapper" vs-type="flex" vs-align="center" vs-lg="6" vs-sm="6">
            <vs-select
              v-if="showFilters"
              placeholder="Filter"
              :width="filterWidth"
              class="selectExample status-picker"
              autocomplete
              v-model="status"
            >
              <vs-select-item
                :key="index"
                :value="item.value"
                :text="item.text"
                v-for="(item,index) in statusNames"
              />
            </vs-select>
          </vs-col>
          <vs-col style="padding-left: 0; padding-right: 0; display: flex; justify-content: flex-end;" vs-type="flex" vs-align="center" vs-lg="6" vs-md="6" vs-sm="6">
            <date-range-picker
              v-if="showFilters"
              class="date-range-picker-box"
              :class="{'theme-dark': $store.state.theme == 'dark'}"
              ref="picker"
              v-model="dateRange"
              :minDate="minDate"
              :maxDate="maxDate"
              :opens="opens"
            >
              <div slot="input" slot-scope="picker" style="min-width: 130px; align-text: center;">
                {{ picker.startDate | date }} - {{ picker.endDate | date }}
                <vs-icon class="currency-dropdown-caret" icon="expand_more"></vs-icon>
              </div>
            </date-range-picker>
          </vs-col>
        </vs-row>
      </vs-col>
    </vs-row>
    <vs-row>
      <vs-col vs-w="12" :class="{'hide': !transition, 'show': transition}">
        <vs-table style="width: 100%;" v-if="showTable" :hoverFlat="true" :data="frames">
          <template slot="header"></template>
          <template slot="thead">
            <vs-th>LOADING</vs-th>
          </template>
          <template slot-scope="{data}">
            <vs-tr :key="indextr" v-for="(tr, indextr) in data">
              <vs-td v-html="getFrame('row')"></vs-td>
            </vs-tr>
          </template>
        </vs-table>
      </vs-col>
      <vs-col vs-w="12" :class="{'show': !transition, 'hide': transition}">
        <vs-table :class="{'mt-5': (updatedWidth < 768), 'mt-2': (updatedWidth >= 768)}" style="width: 100%;" v-if="showTable" :hoverFlat="false" :data="loans">
          <template slot="header"></template>
          <template slot="thead">
            <vs-th><div class="loan-width-acceptable">AGE</div></vs-th>
            <vs-th><div style="text-align: center;" class="loan-width-acceptable">ORDER ID</div></vs-th>
            <vs-th><div class="loan-width-acceptable">LOAN</div></vs-th>
            <vs-th><div class="loan-width-acceptable">COLLATERAL</div></vs-th>
            <vs-th class="flex-center"><div style="text-align: center;" class="loan-width-acceptable">CURRENT LEVERAGE</div></vs-th>
            <vs-th><div class="loan-width-acceptable">PREMIUM</div></vs-th>
            <vs-th class="flex-center"><div class="loan-width-acceptable">DURATION (D)</div></vs-th>
            <vs-th><div class="loan-width-acceptable">STATUS</div></vs-th>
          </template>
          <template slot-scope="{data}">
            <vs-tr :id="tr.id" class="row-expand" :key="indextr" v-for="(tr, indextr) in data">
              <vs-td :data="currentTime"><div class="loan-width-acceptable">{{formatDate(data[indextr].added_on)}}</div></vs-td>
              <vs-td class="center-align" :data="data[indextr].id"><div class="loan-width-acceptable">{{tr.id}}</div></vs-td>
              <vs-td
                v-html="convertToHtml(data[indextr].loan_currency.image_url, data[indextr].loan_amount, data[indextr].loan_currency.short_name)"
                :data="data[indextr].id"
              ></vs-td>
              <vs-td
                :data="data[indextr].id"
                v-html="convertToHtml(data[indextr].collateral_currency.image_url, data[indextr].collateral_amount, data[indextr].collateral_currency.short_name)"
              ></vs-td>

              <vs-td
                :data="data[indextr].id"
                class="center-align"
              ><div style="text-align: center;" class="blue m-auto loan-width-acceptable">{{convertToPreciseFloat(data[indextr].current_leverage, 1)}}x</div></vs-td>
              <vs-td
                class="center-align"
                :data="data[indextr].id"
              ><div class="loan-width-acceptable">{{convertToPreciseFloat(data[indextr].premium, 2)}} {{data[indextr].loan_currency.short_name}}</div></vs-td>
              <vs-td class="center-align" :data="data[indextr].id"><div class="loan-width-acceptable m-auto"><span class="blue">{{(data[indextr].days_passed)?data[indextr].days_passed:0}}</span> / {{data[indextr].tenure}}</div></vs-td>
              <vs-td
                :data="data[indextr].id"
                v-html="getStatus(data[indextr].status,
                  data[indextr].cancel_status,
                  data[indextr].completed_status,
                  data[indextr].defaulted_status
                  )"
              ></vs-td>
              <template slot="expand">
                <vs-row class="mt-3">
                  <vs-col vs-w="12">
                    <vs-row
                      vs-type="flex"
                      vs-justify="space-around"
                      style="background: rgba(157, 159, 162, 0.1); padding: 10px; width: 102%;"
                    >
                      <vs-col
                        vs-w="4"
                        style="text-align: left;"
                      >Premium: {{data[indextr].premium.toFixed(2)}} {{data[indextr].collateral_currency.short_name}}</vs-col>
                      <vs-col
                        vs-w="4"
                        style="text-align: center;"
                      >Initial Leverage: {{data[indextr].initial_leverage.toFixed(2)}}x</vs-col>
                      <vs-col
                        vs-w="4"
                        style="text-align: center;"
                      >Current Leverage: {{data[indextr].current_leverage.toFixed(2)}}x</vs-col>
                    </vs-row>
                  </vs-col>
                  <vs-col :class="{'pl-0': updatedWidth > 768}" vs-w="12">
                    <vs-row vs-type="flex" vs-justify="space-between">
                      <vs-col :class="{'pl-0': updatedWidth > 768}" vs-w="8" vs-align="center" vs-justify="center">
                        <expandable-row-graph
                          orderType="loan"
                          :orderData="data[indextr]"
                          :primaryCurrency="$store.state.primaryCurrency"
                          :isDark="$store.state.theme == 'dark'"
                        ></expandable-row-graph>
                      </vs-col>
                      <vs-col style="flex-direction: column; justify-content: space-evenly;" vs-type="flex" vs-align="center" vs-w="4">
                        <vs-row vs-justify="center" vs-align="center">
                          <vs-col :style="(updatedWidth > 768)?'padding-left: 0;':''" class="mt-2" vs-lg="1" vs-sm="1">
                            <feather-icon class="expanded-icons" style="color: rgb(53, 118, 253);" icon="SendIcon"></feather-icon>
                          </vs-col>
                          <vs-col  class="pl-2" vs-align="flex-end" vs-lg="11" vs-sm="11">
                            <vs-row vs-type="flex" vs-justify="space-between" vs-align="center">
                              <vs-col style="padding: 0;" vs-w="12">
                                <span>Start Date: {{getHypenatedDate(tr.added_on)}}</span>
                                <a
                                target="_blank"
                                :href="tr.etherscan_url"
                                >
                                  <span class="icon-wrapper etherscan-link">
                                    <vs-icon size="12px" icon="launch" class="launch-icon"></vs-icon>
                                  </span>
                                </a>
                              </vs-col>
                            </vs-row>
                          </vs-col>
                        </vs-row>
                        <vs-row vs-justify="center" vs-align="center">
                          <vs-col :style="(updatedWidth > 768)?'padding-left: 0;':''" class="mt-2" vs-sm="1" vs-lg="1">
                            <feather-icon class="expanded-icons" style="color: rgb(53, 118, 253);" icon="CalendarIcon"></feather-icon>
                          </vs-col>
                          <vs-col class="pl-2" vs-align="flex-end" vs-sm="11" vs-lg="11">
                            <vs-row vs-type="flex" vs-justify="space-between" vs-align="center">
                              <vs-col style="padding: 0;" vs-w="12">
                                <span>End Date: {{getHypenatedDate(tr.ending_on)}}</span>
                                <a
                                target="_blank"
                                :href="tr.end_etherscan_url"
                                >
                                  <span v-if="tr.end_etherscan_url" class="icon-wrapper etherscan-link">
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
              </template>
            </vs-tr>
          </template>
        </vs-table>
      </vs-col>
    </vs-row>
    <template>
      <div v-if="showPagination && loans.length > 0" class="table-page-change mt-3">
        <vs-row vs-w="12" vs-justify="space-between">
          <vs-col vs-lg="2" vs-sm="2" :class="{'pt-1': (updatedWidth < 768)}" vs-justify="left">
            <vs-dropdown class="cursor-pointer" vs-trigger-click>
              <vs-button
                class="btn-drop table-page-btn"
                size="small"
                type="border"
                icon="expand_more"
              ><span :class="{'hide': updatedWidth < 768}">Items: </span>{{pageSize}}</vs-button>
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
      <div v-else-if="!showPagination && loans.length > 0" class="p-6 pb-0 pt-2">
        <span style="cursor: pointer; color: #3576FD;" @click="openNewRoute()">Show More</span>
      </div>
    </template>
  </vx-card>
</template>
<script>
import LoanDetailService from "@/services/LoanDetailService";
import Pusher from "pusher-js";
import {pusherKey} from "@/config/settings.js"
import {getLoanOrderStatus, getFrame, getHyphenSeparatedDate} from "@/utils/util.js";
import {formatDate} from "@/static/util";
import DateRangePicker from "vue2-daterange-picker";
import "vue2-daterange-picker/dist/vue2-daterange-picker.css";
import ExpandableRowGraph from "@/views/ExpandableRowGraph.vue";

export default {
  components: {
    DateRangePicker,
    ExpandableRowGraph
  },
  props: {
    showPagination: {
      type: Boolean,
      default: true
    },
    showFilters: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      screenSize: 1100,
      currentTime: (new Date()).getMilliseconds(),
      showTable: true,
      loans: [],
      transition: true,
      frames: new Array(10),
      activePage: 1,
      pageSize: 20,
      sortKey: "added_on",
      order: "DESC",
      status: "",
      orderCount: "",
      statusNames: [
        {
          value: "All",
          text: "All"
        },
        {
          value: "Pending",
          text: "Pending"
        },
        {
          value: "Active",
          text: "Active"
        },
        {
          value: "Failed",
          text: "Failed"
        },
        {
          value: "Repaid",
          text: "Repaid"
        },
        {
          value: "Liquidated",
          text: "Liquidated"
        }
      ],
      futureMonths: 0,
      pastMonths: 3,
      startDate: "2019-01-01",
      endDate: "2019-12-01",
      minDate: "02-01-2019",
      maxDate: Date(Date.now()).toString(),
      dateRange: {},
      opens: "left"
    };
  },
  created() {
    this.setMaxDate();
    this.setBeginDate();
  },
  updated() {
    var self = this;
    var rows = document.getElementsByClassName("row-expand");
    if (rows.length) {
      Array.from(rows).forEach(row => {
        var length = row.classList.length;
        var applyEventListener = true;
        for (var i = 0; i < length; i++) {
          if (row.classList[i] == "tr-expandedx") {
            applyEventListener = false;
          }
        }
        if (applyEventListener) {
          row.addEventListener("click", self.clickRow);
        } else {
          row.removeEventListener("click", self.clickRow);
        }
      });
    }
  },
  async mounted() {
    this.screenSize = window.screen.width;
    var pusher = new Pusher(pusherKey, {
      cluster: "ap2",
      forceTLS: true
    });
    var channel = pusher.subscribe("order");
    var self = this;
    channel.bind("loan", function(data) {
      if (self.$store.state.pusher) {
        let orderId = data.id;
        var orderIdMatch = false;
        var matchedIndex = -1;
        self.loans.forEach((item, index, arr) => {
          if (item.id == orderId) {
            orderIdMatch = true;
            arr[index] = data;
            matchedIndex = index;
          }
        });
        if (!orderIdMatch) {
          var statusNew = self.getStatusLabel(
            data.status,
            data.cancel_status,
            data.completed_status,
            data.defaulted_status
          );
          let statusMatch = (self.status == "" || self.status == "All")? true: self.matchStatus(self.status, statusNew);
          if (statusMatch) {
            self.loans.pop();
            self.loans.unshift(data);
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
          }
        } else {
          self.loans.splice(matchedIndex, 1);
          self.loans.unshift(data);
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
        }
      }
    });
    await this.getLoanOrders();
    this.transition = false;
    setInterval(this.setCurrentTime, 1000);
    setInterval(this.expandRowAfterClick, 10);
  },
  methods: {
    setCurrentTime() {
      this.currentTime = (new Date()).getTime();
    },
    openNewRoute() {
      this.$ga.event({
        eventCategory: 'Loans',
        eventAction: 'Clicked',
        eventLabel: 'Loan Orders'
      });
      this.$router.push({ path: "/loan/orders"});
    },
    getHypenatedDate(date) {
      var d = new Date(date);
      return d.toDateString();
    },
    expandRowAfterClick() {
      var trExpand = document.getElementsByClassName("tr-expand");
        Array.from(trExpand).forEach(trItem => {
          trItem.children[0].setAttribute("colspan", "12");
        });
    },
    clickRow(event) {
      var classList = event.target.className.split(" ");
      if (classList.includes("vs-icon")) {
        event.target.parentNode.parentElement.click();
      } else {
        var trExpand = document.getElementsByClassName("tr-expand");
        Array.from(trExpand).forEach(trItem => {
          trItem.children[0].setAttribute("colspan", "12");
        });
        var rowId = parseInt(event.currentTarget.id);
        var alreadyExpanded = true;
        var clickedElementClassList = event.currentTarget.classList;
        for (var i = 0; i < clickedElementClassList.length; i++) {
          if (clickedElementClassList[i] == "tr-expandedx") {
            //if the element is clicked and tr-expandedx class is not there, it means that
            //the element was expanded before but after click the class has just got removed
            alreadyExpanded = false;
          }
        }
        if (alreadyExpanded) {
          return;
        }
        this.rowClicked = rowId;
        var expandedArray = document.getElementsByClassName('tr-expandedx');
        var toBeShut = [];
        for (var rowItem in expandedArray) {
          if (expandedArray[rowItem].id && parseInt(expandedArray[rowItem].id) != rowId) {
            toBeShut.push(expandedArray[rowItem]);
          }
        }
        toBeShut.forEach(
          (item) => {
            item.click();
          }
        );
      }
    },
    setBeginDate() {
      //Sets the default dateRange to 3 months past to present
      this.dateRange.endDate = this.getHyphenSeparatedDate(Date.now());
      var temp = new Date(Date.now());
      temp = new Date(temp.setMonth(temp.getMonth() - this.pastMonths));
      this.dateRange.startDate = this.getHyphenSeparatedDate(temp);
    },
    setMaxDate() {
      //Increase the maxDate to futureMonths months
      //Author: Shubham Sharma
      //Date: 9-09-2019
      var temp = new Date(Date.now());
      this.maxDate = new Date(
        temp.setMonth(temp.getMonth() + this.futureMonths)
      ).toString();
    },
    getFrame(size) {
      let isDark = (this.$store.state.theme == 'dark');
      return getFrame(size, isDark);
    },
    matchStatus(originalStatusLabel, newStatusLabel) {
      var pendingStatuses = [
        "Pending",
        "Creation Pending",
        "Repayment Pending"
      ];
      var liquidatedStatuses = [
        "Defaulted (Collateral Devalued)",
        "Defaulted (Missed Repayment)"
      ];
      if ((originalStatusLabel == newStatusLabel) == "Active") {
        return true;
      } else if (
        originalStatusLabel == "Pending" &&
        pendingStatuses.includes(newStatusLabel)
      ) {
        return true;
      } else if (
        originalStatusLabel == "Failed" &&
        newStatusLabel == "Creation Failed"
      ) {
        return true;
      } else if (
        originalStatusLabel == "Repaid" &&
        newStatusLabel == "Loan Completed"
      ) {
        return true;
      } else if (
        originalStatusLabel == "Liquidated" &&
        liquidatedStatuses.includes(newStatusLabel)
      ) {
        return true;
      } else if (originalStatusLabel == "All" || originalStatusLabel == "") {
        return true;
      } else {
        return false;
      }
    },
    convertToPreciseFloat(value, places) {
      if (value) {
        return value.toFixed(places);
      }
      return value;
    },
    getHyphenSeparatedDate(date) {
      return getHyphenSeparatedDate(date);
    },
    async getLoanOrders() {
      if (this.dateRange.startDate) {
        this.startDate = this.getHyphenSeparatedDate(this.dateRange.startDate);
      }
      if (this.dateRange.endDate) {
        this.endDate = this.getHyphenSeparatedDate(this.dateRange.endDate);
      }
      var loans = await LoanDetailService.getLoanOrdersFull(
        this.$store.state.primaryCurrency.short_name,
        this.activePage,
        this.pageSize,
        this.sortKey,
        this.order,
        this.status,
        this.startDate,
        this.endDate
      );
      this.loans = loans.data.data;
      this.orderCount = loans.data.count;
      this.showTable = false;
      var self = this;
      this.$nextTick(() => {
        self.showTable = true;
      });
    },
    formatDate(val) {
      return formatDate(val);
    },
    convertToHtml(url, loanAmount, loanCurrency) {
      if (url.slice(-7) == "knc.jpg" || url.slice(-7) == "knc.svg") {
        url = url.slice(0, -7) + "kyber.png";
      }
      loanAmount = this.convertToPreciseFloat(loanAmount, 2);
      return `<div class="loan-width-acceptable set-in-middle"><img class='img-icon' width=20 height=20 src='${url}'> ${loanAmount} ${loanCurrency}</div>`;
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
      return `<div class='loan-width-acceptable' style='display: flex; justify-content: flex-start;'><div class='h-3 down w-3 rounded-full mr-2 bg-${icon}''></div><div>${label}</div>`;
    },
    getStatusLabel(status, cancel_status, completed_status, defaulted_status) {
      var computedStatus = getLoanOrderStatus(
        status,
        cancel_status,
        completed_status,
        defaulted_status
      );
      var label = computedStatus.label;
      return label;
    },
    clipLarge(val) {
      if (val) return val.slice(0, 8) + "...";
      else return val;
    }
  },
  computed: {
    getPagesCount() {
      var maxItems = parseFloat(this.pageSize);
      var totalNumberOfOrders = parseFloat(this.orderCount);
      return Math.ceil(totalNumberOfOrders / maxItems);
    },
    updatedWidth() {
      let width = screen.width;
      return width;
    },
    filterWidth() {
      if (screen.width < 1050 && screen.width >= 969) {
        return "80px";
      } else if (screen.width < 969 && screen.width >= 900) {
        return "70px";
      } else {
        if (screen.width >= 768) {
          return "100px";
        } else {
          return "80%";
        }
      }
    }
  },
  watch: {
    activePage: async function() {
      await this.getLoanOrders();
    },
    pageSize: async function() {
      await this.getLoanOrders();
    },
    sortKey: async function() {
      await this.getLoanOrders();
    },
    order: async function() {
      await this.getLoanOrders();
    },
    status: async function() {
      await this.getLoanOrders();
    },
    dateRange: async function() {
      await this.getLoanOrders();
    },
    "$store.state.primaryCurrency": async function() {
      this.showTable = false;
      await this.getLoanOrders();
      this.showTable = true;
    }
  }
};
</script>
<style scoped lang="scss">
  .cursor-pointer {
    cursor: pointer !important;
  }
</style>
<style lang="scss">
.set-in-middle {
  height: 66px;
  line-height: 66px;
}
.cancelBtn {
  cursor: pointer;
}
.applyBtn {
  cursor: pointer;
}
.fade-1 {
  opacity: 0;
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
.status-options {
  font-weight: 400;
  display: flex;
  justify-content: left;
}
.row-expand {
  cursor: pointer;
}

.down {
  position: relative;
  top: 4px;
}
.status-picker {
  height: 33px !important;
  .input-select {
    height: 33px !important;
    border-radius: 0 !important;
  }
}
.bg-info {
  background-color: #007bff !important;
}

.flex-center {
  .vs-table-text {
    justify-content: center !important;
  }
}
.tr-expand {
  justify-content: center !important;
  border-top: 0 !important;
  td {
    .content-tr-expand {
      border-top: 0;
    }
  }
}

.theme-dark > .form-control{
  background-color: #262c49 !important;
  color: #c2c6dc !important;
  border: 0;
}
.theme-dark {
  .calendar-table {
    padding-right: 0 !important;
  }
  .daterangepicker {
    background: rgba(16, 22, 58, 1) !important;
    color: #fff !important;
    th, td:not(.in-range, .off) {
      background: rgba(16, 22, 58, 1) !important;
      color: #fff !important;
      border: 1px solid #262c49 !important;
      border-radius: 0 !important;
    }
    td.in-range:not(.start-date, .end-date) {
      background: #bbcfff !important;
      color: #000 !important;
    }
    td.start-date, td.end-date {
      background: #3576FD !important;
      color: white !important;
      border-radius: 0px !important;
      border: 1px solid #262c49 !important;
      border-color: #3576FD !important;
    }
    td.off {
      background: rgba(16, 22, 58, 1) !important;
      color: grey !important;
      border: 1px solid #262c49 !important;
      border-radius: 0 !important;
    }
    th.prev {
      span {
        border-color: #ffffff !important;
      }
    }
    th.prev:hover {
      background: #3576FD !important;
    }
    th.next {
      span {
        border-color: #ffffff !important;
      }
    }
    th.next:hover {
      background: #3576FD !important;
    }
  }
}
.expanded-icons {
  svg {
    width: 19px;
    height: 19px;
  }
}
.img-icon {
  display: inline !important;
  position: relative;
  top: 5px;
}
.loan-width-acceptable {
  width: max-content !important;
}
</style>
<style scoped lang="scss">
  #loan-table {
    position: relative;
    top: 20px !important;
  }
  .blue {
    color: rgba(var(--vs-primary), 1) !important;
  }
  .center-align {
    text-align: center;
    margin: auto;
  }
  .hide {
    display: none;
  }
  .show {
    display: flex;
  }
  .currency-dropdown-caret {
    position: relative;
    top: 3px;
  }
  .launch-icon {
    position: relative;
    bottom: 5px;
    left: 2px;
  }
  .date-range-picker-box {
    margin-top: 0px;
    width: 145px !important;
  }
  .table-page-btn {
    padding-left: 10px !important;
  }
  @media only screen and (max-width: 768px) {
    .table-page-btn {
      max-width: 50px !important;
    }
  }
  .status-wrapper {
    justify-content: flex-end;
  }
  @media only screen and (max-width: 1050px) {
    .status-wrapper {
      justify-content: flex-start;
      padding-left: 0;
    }
  }
  @media only screen and (max-width: 900px) {
    .status-wrapper {
      padding-left: 15px;
    }
  }
</style>