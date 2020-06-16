<template>
  <vx-card class="relative" id="trade-table">
    <vs-row vs-type="flex" vs-justify="space-between">
      <vs-col vs-lg="8" vs-md="8" vs-sm="8">
        <h5 class="pt-3 pb-3">TRADE ORDERS</h5>
      </vs-col>
      <vs-col v-if="!showFilters" vs-lg="4" vs-sm="4" style="display: flex; justify-content: flex-end; align-items: center;">
        <feather-icon
          v-if="!showFilters"
          @click="openNewRoute()"
          style="cursor: pointer; height: 15px; width: 15px;"
          icon="ArrowUpRightIcon"
        ></feather-icon>
      </vs-col>
      <vs-col style="display: flex; justify-content: flex-end;" vs-lg="4" vs-sm="12" vs-xs="12" vs-type="flex">
        <vs-row vs-type="flex" vs-align="center" vs-lg-justify="flex-end" vs-sm-justify="space-around">
          <vs-col class="status-wrapper" style="display: flex;" vs-align="center" vs-lg="6" vs-sm="6">
            <vs-select
              v-if="showFilters"
              placeholder="Filter"
              :width="filterWidth"
              autocomplete
              class="selectExample status-picker"
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
          <vs-col :style="(updatedWidth < 900)?'justify-content: flex-start; padding-left: 0; padding-right: 0;':'justify-content: flex-end;'" style="display: flex; justify-content: flex-end;" vs-align="center" vs-lg="6" vs-sm="6">
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
      <vs-col vs-w="12" v-if="showTable" :class="{'hide': !transition, 'show': transition}">
        <vs-table style="width: 100%;" :hoverFlat="false" :data="frames">
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
      <vs-col vs-w="12" :class="{'hide': transition, 'show': !transition}" v-if="showTable">
        <vs-table :class="{'mt-5': updatedWidth < 768}" style="width: 100%;" :hoverFlat="false" :data="trades">
          <template slot="header"></template>
          <template slot="thead">
            <vs-th><div class="trade-width-acceptable">AGE</div></vs-th>
            <vs-th class="flex-center"><div class="trade-width-acceptable">ORDER ID</div></vs-th>
            <vs-th><div class="trade-width-acceptable">TRADE</div></vs-th>
            <vs-th class="flex-center"><div class="trade-width-acceptable">POSITION</div></vs-th>
            <vs-th><div class="trade-width-acceptable">POSITION AMOUNT</div></vs-th>
            <vs-th><div class="trade-width-acceptable">GAINS</div></vs-th>
            <vs-th><div class="trade-width-acceptable">ENTRY PRICE</div></vs-th>
            <vs-th><div class="trade-width-acceptable">CURRENT/CLOSING</div></vs-th>
            <vs-th><div class="trade-width-acceptable">STATUS</div></vs-th>
          </template>
          <template slot-scope="{data}">
            <vs-tr class="row-expand" :id="tr.id" :key="indextr" v-for="(tr, indextr) in data">
              <vs-td :data="currentTime">
                <div class="trade-width-acceptable">
                  {{formatDate(tr.added_on)}}
                </div>
              </vs-td>
              <vs-td class="center-align">
                <transition name="list" mode="out-in">
                  <div class="trade-width-acceptable m-auto">
                      {{tr.id}}
                  </div>
                </transition>
              </vs-td>
              <vs-td
                v-html="convertToHtml(data[indextr].position_currency.image_url,data[indextr].position_currency.short_name,data[indextr].market_currency.short_name)"
                :data="data[indextr].id"
              ></vs-td>
              <vs-td class="center-align" :data="data[indextr].id">
                <div class="trade-width-acceptable m-auto" :class="{'position-long': tr.position_type == 'LONG', 'position-short': tr.position_type == 'SHORT'}">
                  {{convertToPreciseFloat(tr.initial_leverage, 0)}}x {{data[indextr].position_type}}
                </div>
              </vs-td>

              <vs-td :data="data[indextr].id" class="center-align">
                <div class="trade-width-acceptable">
                  {{convertToPreciseFloat(data[indextr].position_amount, 2)}} {{data[indextr].position_currency.short_name}}
                </div>
              </vs-td>

              <vs-td class="center-align" :data="data[indextr].id">
                <div class="trade-width-acceptable" :class="{'red':tr.gains_new < 0, 'green': tr.gains_new >= 0 }">
                  {{convertToPreciseFloat(data[indextr].gains_new, 2)}} {{gainsCurrency(tr)}}
                </div>
              </vs-td>
              <vs-td class="center-align" :data="data[indextr].id">
                <div class="trade-width-acceptable">
                  {{convertToPreciseFloat(data[indextr].entry_price, 2)}} {{data[indextr].market_currency.short_name}}
                </div>
              </vs-td>
              <vs-td :data="data[indextr].id" class="center-align">
                <div class="trade-width-acceptable">
                {{(data[indextr].status == 1 || data[indextr].cancel_status == 2)?
                convertToPreciseFloat(data[indextr].current_price, 2)
                :convertToPreciseFloat(data[indextr].current_exit_price)}}
                {{data[indextr].market_currency.short_name}}
                </div>
              </vs-td>
              <vs-td
                :data="data[indextr].id"
                v-html="getStatus(data[indextr].status,
                  data[indextr].cancel_status,
                  data[indextr].completed_status,
                  data[indextr].stop_loss_status,
                  data[indextr].take_profit_status)"
              ></vs-td>
              <template :id="indextr" :line="tr" class="expand-user" slot="expand">
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
                      >Liquidation Buffer: {{(data[indextr].buffer)?data[indextr].buffer:0}}%</vs-col>
                      <vs-col
                        vs-w="4"
                        style="text-align: center;"
                      >Stop Loss: {{(data[indextr].stop_loss)?data[indextr].stop_loss:0}}%</vs-col>
                      <vs-col
                        vs-w="4"
                        style="text-align: center;"
                      >Take Profit: {{(data[indextr].take_profit)?data[indextr].take_profit:0}}%</vs-col>
                    </vs-row>
                  </vs-col>
                  <vs-col :style="(updatedWidth > 768)?'padding-left: 0;':''" vs-w="12">
                    <vs-row vs-type="flex" vs-justify="space-between">
                      <vs-col :style="(updatedWidth > 768)?'padding-left: 0;':''" vs-w="8" vs-align="center" vs-justify="center">
                        <expandable-row-graph
                          :orderData="data[indextr]"
                          :primaryCurrency="$store.state.primaryCurrency"
                          :isDark="$store.state.theme == 'dark'"
                        ></expandable-row-graph>
                      </vs-col>
                      <vs-col style="flex-direction: column; justify-content: space-evenly;" vs-type="flex" vs-align="center" vs-w="4">
                        <vs-row vs-justify="center" vs-align="center">
                          <vs-col :style="(updatedWidth > 768)?'padding-left: 0;':''" class="mt-1" vs-lg="1" vs-sm="1">
                            <feather-icon class="expanded-icons" style="color: rgb(53, 118, 253);" icon="DollarSignIcon"></feather-icon>
                          </vs-col>
                          <vs-col class="pl-2" vs-align="flex-end" vs-lg="11" vs-sm="11">
                            <span style="position: relative; bottom: 2px;">Fee: {{$store.state.primaryCurrency.symbol}}{{tr.fee_primary | handleFloat(4)}}</span>
                          </vs-col>
                        </vs-row>
                        <vs-row vs-justify="center" vs-align="center">
                          <vs-col :style="(updatedWidth > 768)?'padding-left: 0;':''" class="mt-1" vs-lg="1" vs-sm="1">
                            <feather-icon class="expanded-icons" style="color: rgb(53, 118, 253);" icon="SendIcon"></feather-icon>
                          </vs-col>
                          <vs-col class="pl-2" vs-align="flex-end" vs-lg="11" vs-sm="11">
                            <vs-row vs-type="flex" vs-justify="space-between" vs-align="center">
                              <vs-col style="padding: 0;" vs-w="12">
                                <span style="position: relative; bottom: 2px;">Start Date: {{getHypenatedDate(tr.added_on)}}</span>
                                <a
                                target="_blank"
                                :href="tr.etherscan_url"
                                >
                                  <span v-if="tr.etherscan_url" class="icon-wrapper etherscan-link">
                                    <vs-icon size="12px" icon="launch" class="launch-icon"></vs-icon>
                                  </span>
                                </a>
                              </vs-col>
                            </vs-row>
                          </vs-col>
                        </vs-row>
                        <vs-row vs-justify="center" vs-align="center">
                          <vs-col :style="(updatedWidth > 768)?'padding-left: 0;':''" class="mt-1" vs-sm="1" vs-lg="1">
                            <feather-icon class="expanded-icons" style="color: rgb(53, 118, 253);" icon="CalendarIcon"></feather-icon>
                          </vs-col>
                          <vs-col class="pl-2" vs-align="flex-end" vs-sm="11" vs-lg="11">
                            <vs-row vs-type="flex" vs-justify="space-between" vs-align="center">
                              <vs-col style="padding: 0;" vs-w="12">
                                <span>End Date: {{(getHypenatedDate(tr.ending_on))?getHypenatedDate(tr.ending_on):getTenureAddedDate(tr.added_on, tr.tenure)}}</span>
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
      <div v-if="showPagination && trades.length > 0" class="table-page-change mt-3">
        <vs-row vs-w="12" vs-justify="space-between">
          <vs-col vs-lg="2" vs-sm="2" :class="{'pt-1': updatedWidth < 768}" style="display: flex; justify-content: flex-start;">
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
          <vs-col style="display: flex; justify-content: flex-end;" vs-lg="4" vs-md="4" vs-sm="8">
            <div>
              <vs-pagination :max="getMaxPages()" :total="getPagesCount" v-model="activePage"></vs-pagination>
            </div>
          </vs-col>
        </vs-row>
      </div>
      <div v-else-if="!showPagination && trades.length > 0" class="p-6 pb-0 pt-2">
        <span style="color: #3576FD; cursor: pointer;" @click="openNewRoute()">Show More</span>
      </div>
    </template>
  </vx-card>
</template>
<script>
import TradeDetailService from "@/services/TradeDetailService";
import Pusher from "pusher-js";
import {pusherKey} from "@/config/settings.js"
import {getTradeOrderStatus, getFrame, getHyphenSeparatedDate} from "@/utils/util.js";
import { formatDate } from "@/static/util.js";
import VueApexCharts from "vue-apexcharts";
import ExpandableRowGraph from "@/views/ExpandableRowGraph.vue";
import DateRangePicker from "vue2-daterange-picker";
import "vue2-daterange-picker/dist/vue2-daterange-picker.css";

export default {
  props: {
    showPagination: {
      type: Boolean,
      default: true
    },
    showFilters: {
      type: Boolean,
      default: true
    },
    showExpandable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      trades: [],
      currentTime: (new Date()).getMilliseconds(),
      rowClicked: 0,
      transition: true,
      showTable: true,
      activePage: 1,
      pageSize: 20,
      frames: new Array(10),
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
  components: {
    VueApexCharts,
    ExpandableRowGraph,
    DateRangePicker
  },
  async mounted() {
    var pusher = new Pusher(pusherKey, {
      cluster: "ap2",
      forceTLS: true
    });
    var channel = pusher.subscribe("order");
    var self = this;
    channel.bind("trade", function(data) {
      if (self.$store.state.pusher) {
        let orderId = data.id;
        var orderIdMatch = false;
        let matchedIndex = -1;
        self.trades.forEach((item, index, arr) => {
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
            data.stop_loss_status,
            data.take_profit_status
          );
          let statusMatch = (self.status == "" || self.status == "All")?true:self.matchStatus(self.status, statusNew);
          if (statusMatch) {
            self.trades.pop();
            self.trades.unshift(data);
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
          self.trades.splice(matchedIndex, 1);
          self.trades.unshift(data);
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
    await this.getTradeOrders();
    this.transition = false;
    setInterval(this.setCurrentTime, 1000);
    setInterval(this.expandRowAfterClick, 10);
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
  methods: {
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
    getHyphenSeparatedDate(date) {
      return getHyphenSeparatedDate(date);
    },
    setCurrentTime() {
      this.currentTime = (new Date()).getTime();
    },
    openNewRoute() {
      this.$ga.event({
        eventCategory: 'Trades',
        eventAction: 'Clicked',
        eventLabel: 'Trade Orders'
      });
      this.$router.push({ path: "/trade/orders"});
    },
    getMaxPages() {
      return 5;
    },
    getHypenatedDate(date) {
      if (date != null) {
        var d = new Date(date);
        return d.toDateString();
      } else {
        return null;
      }
    },
    getTenureAddedDate(startDate, tenure) {
      var endDateFormatted;
      if (tenure != null) {
        let startDateFormatted = new Date(startDate);
        let day = parseInt(startDateFormatted.getDate());
        endDateFormatted = new Date(startDateFormatted.setDate(day + parseInt(tenure)));
        endDateFormatted = endDateFormatted.toDateString();
      } else {
        endDateFormatted = null;
      }
      return endDateFormatted;
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
    formatDate(date) {
      return formatDate(date);
    },
    getSeries(rowId) {
      if (this.graphParamsMap[rowId]) {
        return this.graphParamsMap[rowId].series;
      } else {
        return [];
      }
    },
    getOptions(rowId) {
      if (this.graphParamsMap[rowId]) {
        return this.graphParamsMap[rowId].options;
      } else {
        return {};
      }
    },
    getFrame(size) {
      let isDark = (this.$store.state.theme == 'dark');
      return getFrame(size, isDark);
    },
    convertToPreciseFloat(val, places) {
      if (Number.isFinite(val)) {
        return (val.toFixed(places)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      } else {
        return val;
      }
    },
    async getTradeOrders() {
      if (this.dateRange.startDate) {
        this.startDate = this.dateRange.startDate;
      }
      if (this.dateRange.endDate) {
        this.endDate = this.dateRange.endDate;
      }
      var trades = await TradeDetailService.getTradeOrdersFull(
        this.$store.state.primaryCurrency.short_name,
        this.activePage,
        this.pageSize,
        this.sortKey,
        this.order,
        this.status,
        this.startDate,
        this.endDate
      );
      this.trades = trades.data.data;
      this.orderCount = trades.data.count;
      this.showTable = false;
      var self = this;
      this.$nextTick(() => {
        self.showTable = true;
      });
    },
    convertToHtml(url, tradeCurrency, market_currency) {
      if (url.slice(-7) == "knc.jpg" || url.slice(-7) == "knc.svg") {
        url = url.slice(0, -7) + "kyber.png";
      }
      return `<div class="trade-width-acceptable set-in-middle"><img class='img-icon' width=20 height=20 src='${url}'> ${tradeCurrency}/${market_currency}</div>`;
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
      return `<div class='trade-width-acceptable' style='display: flex; justify-content: flex-start;' ><div class='down h-3 w-3 rounded-full mr-2 bg-${icon}''></div><div>${label}</div></div>`;
    },
    getStatusLabel(
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
      return label;
    },
    matchStatus(originalStatusLabel, newStatusLabel) {
      var pendingStatuses = [
        "Pending",
        "Creation Pending",
        "Liquidation Pending"
      ];
      var liquidatedStatuses = [
        "Trade Liquidated",
        "Trade Tenure Completed"
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
    clipLarge(val) {
      if (val) return val.slice(0, 5) + "...";
      else return val;
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
  },
  computed: {
    getPagesCount() {
      var maxItems = parseFloat(this.pageSize);
      var totalNumberOfOrders = parseFloat(this.orderCount);
      return Math.ceil(totalNumberOfOrders / maxItems);
    },
    updatedWidth() {
      return parseInt(screen.width);
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
      await this.getTradeOrders();
    },
    pageSize: async function() {
      await this.getTradeOrders();
    },
    sortKey: async function() {
      await this.getTradeOrders();
    },
    order: async function() {
      await this.getTradeOrders();
    },
    status: async function() {
      await this.getTradeOrders();
    },
    dateRange: async function() {
      await this.getTradeOrders();
    },
    "$store.state.primaryCurrency": async function() {
      this.showTable = false;
      await this.getTradeOrders();
      this.showTable = true;
    },
    "$store.state.theme": async function() {
      this.showTable = false;
      await this.getTradeOrders();
      this.showTable = true;
    }
  }
};
</script>
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
.expand-transaction {
  width: 100%;
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
.content-tr-expand {
  justify-content: center !important;
}
.icon-text {
  position: relative;
  top: 4px;
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
.trade-width-acceptable {
  width: max-content !important;
}
.hide {
  display: none !important;
}
.show {
  display: flex !important;
}
</style>
<style scoped lang="scss">
  #trade-table {
    position: relative;
    top: 20px !important;
  }
  .cursor-pointer {
    cursor: pointer !important;
  }
  .launch-icon {
    position: relative;
    bottom: 5px;
    left: 2px;
  }
  .center-align {
    text-align: center;
  }
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
  .row-expand {
    cursor: pointer !important;
  }
  .table-page-btn {
    padding-left: 10px !important;
  }
  .currency-dropdown-caret {
    position: relative;
    top: 3px;
  }
  .date-range-picker-box {
    width: 160px;
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