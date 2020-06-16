<template>
  <vx-card class="relative" id="reserve-table">
    <vs-row vs-type="flex" vs-justify="space-between">
      <vs-col vs-lg="8" vs-sm="8" style="display: flex; justify-content: flex-start;">
        <h5 class="pt-3 pb-3">RESERVE ORDERS</h5>
      </vs-col>
      <vs-col v-if="!showFilters" vs-lg="4" vs-sm="4" style="display: flex; justify-content: flex-end; align-items: center;">
        <feather-icon
          v-if="!showFilters"
          @click="openNewRoute()"
          style="cursor: pointer; height: 15px; width: 15px;"
          icon="ArrowUpRightIcon"
        >
        </feather-icon>
      </vs-col>
      <vs-col vs-type="flex" style="display: flex; justify-content: flex-end;"  vs-lg="4" vs-sm="12" vs-xs="12">
        <vs-row vs-type="flex" vs-justify="flex-end" vs-align="center">
          <vs-col vs-lg="6" class="status-wrapper" style="display: flex; margin-right: 0;" vs-sm="6">
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
          <vs-col vs-lg="6" :style="(updatedWidth < 768)? 'padding-left: 0; padding-right: 0;': ''" style="display: flex; justify-content: flex-end; margin-right: 0;" vs-sm="6">
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
    <vs-row vs-type="flex" vs-w="12">
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
      <vs-col vs-w="12" :class="{'hide': transition}">
        <vs-table :class="{'mt-5': (updatedWidth < 768), 'mt-2': (updatedWidth >= 768)}" style="width: 100%;" v-if="showTable" :hoverFlat="false" :data="reserves">
          <template slot="header"></template>
          <template slot="thead">
            <vs-th><div class="reserve-width-acceptable">AGE</div></vs-th>
            <vs-th><div class="reserve-width-acceptable">ORDER ID</div></vs-th>
            <vs-th><div class="reserve-width-acceptable">INITIAL AMOUNT</div></vs-th>
            <vs-th><div class="reserve-width-acceptable">CURRENT AMOUNT</div></vs-th>
            <vs-th><div class="reserve-width-acceptable">GAINS</div></vs-th>
            <vs-th><div class="reserve-width-acceptable m-auto">DURATION (D)</div></vs-th>
            <vs-th><div class="reserve-width-acceptable">STATUS</div></vs-th>
          </template>
          <template slot-scope="{data}">
            <vs-tr :ref="tr.id" :id="tr.id" class="pointer row-expand" :key="indextr" v-for="(tr, indextr) in data">
              <vs-td :data="currentTime"><div class="reserve-width-acceptable">{{formatDate(data[indextr].added_on)}}</div></vs-td>
              <vs-td><div class="reserve-width-acceptable">{{tr.id}}</div></vs-td>
              <vs-td
                v-html="convertToHtml(data[indextr].currency.image_url, data[indextr].amount, data[indextr].currency.short_name)"
                :data="data[indextr].id"
              ></vs-td>
              <vs-td :data="data[indextr].id">
                <div class="reserve-width-acceptable">
                  {{convertToPreciseFloat(data[indextr].current_amount, 2)}}
                  {{data[indextr].currency.short_name}}
                </div>
              </vs-td>

              <vs-td
                :data="data[indextr].id"
              >
              <div class="reserve-width-acceptable">
              {{convertToPreciseFloat(data[indextr].gains_new, 2)}} {{data[indextr].currency.short_name}}
              </div>
              </vs-td>

              <vs-td :data="data[indextr].id">
                <div class="reserve-width-acceptable m-auto">
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
                      >Gains: {{(data[indextr].gains_new)?data[indextr].gains_new.toFixed(2):0}}%</vs-col>
                      <vs-col
                        vs-w="4"
                        style="text-align: center;"
                      >Duration: {{data[indextr].days_passed}} days</vs-col>
                    </vs-row>
                  </vs-col>
                  <vs-col vs-w="12" :class="{'pl-0': updatedWidth > 768}">
                    <vs-row vs-type="flex" vs-justify="space-between">
                      <vs-col :class="{'pl-0': updatedWidth > 768}" vs-w="8" vs-align="center" vs-justify="center">
                        <expandable-row-graph
                          v-if="showGraph"
                          orderType="reserve"
                          :orderData="data[indextr]"
                          :primaryCurrency="updatedPrimaryCurrency"
                          :isDark="$store.state.theme == 'dark'"
                        ></expandable-row-graph>
                        <div class="center-align">{{tr.currency.short_name}} vs {{$store.state.primaryCurrency.short_name}}</div>
                      </vs-col>
                      <vs-col style="flex-direction: column; justify-content: space-evenly;" vs-type="flex" vs-align="center" vs-w="4">
                        <vs-row vs-justify="center" vs-align="center">
                          <vs-col :style="(updatedWidth > 768)?'padding-left: 0;':''" class="mt-1" vs-lg="1" vs-sm="1">
                            <feather-icon class="expanded-icons" style="color: rgb(53, 118, 253);" icon="SendIcon"></feather-icon>
                          </vs-col>
                          <vs-col class="" vs-align="flex-end" vs-sm="11" vs-lg="11">
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
                          <vs-col :style="(updatedWidth > 768)?'padding-left: 0;':''" class="mt-1" vs-sm="1" vs-lg="1">
                            <feather-icon class="expanded-icons" style="color: rgb(53, 118, 253);" icon="CalendarIcon"></feather-icon>
                          </vs-col>
                          <vs-col class="" vs-align="flex-end" vs-lg="11" vs-sm="11">
                            <vs-row vs-type="flex" vs-justify="space-between" vs-align="center">
                              <vs-col style="padding: 0;" vs-w="10">
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
      <div v-if="showPagination && reserves.length > 0" class="table-page-change mt-3">
        <vs-row vs-w="12" vs-justify="space-between">
          <vs-col vs-sm="2" vs-lg="2" :class="{'pt-1': updatedWidth < 768}" vs-justify="left">
            <vs-dropdown class="cursor-pointer" vs-trigger-click>
              <vs-button
                class="btn-drop table-page-btn"
                size="small"
                type="border"
                icon="expand_more"
              ><span :class="{'hide': (updatedWidth < 768)}">Items: </span>{{pageSize}}</vs-button>
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
      <div v-else-if="!showPagination && reserves.length > 0" class="p-6 pb-0 pt-2">
        <span @click="openNewRoute" style="cursor: pointer; color: #3576FD;">Show More</span>
      </div>
    </template>
  </vx-card>
</template>
<script>
import ReserveDetailService from "@/services/ReserveDetailService";
import Pusher from "pusher-js";
import {pusherKey} from "@/config/settings.js"
import { getReserveOrderStatus, getFrame, getHyphenSeparatedDate } from "@/utils/util.js";
import { formatDate } from "@/static/util";
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
      currentTime: (new Date()).getMilliseconds(),
      transition: true,
      frames: new Array(10),
      showTable: true,
      reserves: [],
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
          value: "Terminated",
          text: "Terminated"
        },
        {
          value: "Failed",
          text: "Failed"
        }
      ],
      futureMonths: 0,
      pastMonths: 3,
      startDate: "2019-01-01",
      endDate: "2019-12-01",
      minDate: "02-01-2019",
      maxDate: Date(Date.now()).toString(),
      dateRange: {},
      opens: "left",
      showGraph: true
    };
  },
  async mounted() {
    var pusher = new Pusher(pusherKey, {
      cluster: "ap2",
      forceTLS: true
    });
    var channel = pusher.subscribe("order");
    var self = this;
    channel.bind("reserve", function(data) {
      if (self.$store.state.pusher) {
        let orderId = data.id;
        var orderIdMatch = false;
        let matchedIndex = -1;
        self.reserves.forEach((item, index, arr) => {
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
            data.completed_status
          );
          let statusMatch = (self.status == "" || self.status == "All")?true: self.matchStatus(self.status, statusNew);
          if (statusMatch) {
            self.reserves.pop();
            self.reserves.unshift(data);
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
          self.reserves.splice(matchedIndex, 1);
          self.reserves.unshift(data);
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
    await this.getReserveOrders();
    this.transition = false;
    setInterval(this.setCurrentTime, 1000);
    setInterval(this.expandRowAfterClick, 10);
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
  methods: {
    setCurrentTime() {
      this.currentTime = (new Date()).getTime();
    },
    openNewRoute() {
      this.$ga.event({
        eventCategory: 'Reserves',
        eventAction: 'Clicked',
        eventLabel: 'Reserve Orders'
      });
      this.$router.push({ path: "/reserve/orders"});
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
      var pendingStatuses = ["Pending", "Creation Pending", "Stop Pending"];
      if ((newStatusLabel == originalStatusLabel) == "Active") {
        return true;
      } else if (
        originalStatusLabel == "Pending" &&
        pendingStatuses.includes(newStatusLabel)
      ) {
        return true;
      } else if ((originalStatusLabel == newStatusLabel) == "Terminated") {
        return true;
      } else if (
        originalStatusLabel == "Failed" &&
        newStatusLabel == "Creation Failed"
      ) {
        return true;
      } else if (originalStatusLabel == "All" || originalStatusLabel == "") {
        return true;
      } else {
        return false;
      }
    },
    getHyphenSeparatedDate(date) {
      return getHyphenSeparatedDate(date);
    },
    async getReserveOrders() {
      if (this.dateRange.startDate) {
        this.startDate = this.getHyphenSeparatedDate(this.dateRange.startDate);
      }
      if (this.dateRange.endDate) {
        this.endDate = this.getHyphenSeparatedDate(this.dateRange.endDate);
      }
      var reserves = await ReserveDetailService.getReserveOrdersFull(
        this.$store.state.primaryCurrency.short_name,
        this.activePage,
        this.pageSize,
        this.sortKey,
        this.order,
        this.status,
        this.startDate,
        this.endDate
      );
      this.reserves = reserves.data.data;
      this.orderCount = reserves.data.count;
      this.showTable = false;
      var self = this;
      this.$nextTick(() => {
        self.showTable = true;
      });
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
      return `<div class="reserve-width-acceptable set-in-middle"><img class='img-icon' width=20 height=20 src='${url}'> ${reserveAmount} ${reserveCurrency}</div>`;
    },
    getStatus(status, cancel_status, completed_status) {
      var computedStatus = getReserveOrderStatus(
        status,
        cancel_status,
        completed_status
      );
      var label = computedStatus.label;
      var icon = computedStatus.icon;
      return `<div class='reserve-width-acceptable' style="display: flex; align-items: center; justify-content: flex-start;"><div class='h-3 bottom w-3 rounded-full mr-2 bg-${icon}''></div><div>${label}</div></div>`;
    },
    getStatusLabel(status, cancel_status, completed_status) {
      var computedStatus = getReserveOrderStatus(
        status,
        cancel_status,
        completed_status
      );
      var label = computedStatus.label;
      return label;
    },
    clipLarge(val) {
      if (val) return val.slice(0, 10) + "...";
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
    },
    updatedPrimaryCurrency() {
      return this.$store.state.primaryCurrency;
    }
  },
  watch: {
    activePage: async function() {
      await this.getReserveOrders();
    },
    pageSize: async function() {
      await this.getReserveOrders();
    },
    sortKey: async function() {
      await this.getReserveOrders();
    },
    order: async function() {
      await this.getReserveOrders();
    },
    status: async function() {
      await this.getReserveOrders();
    },
    dateRange: async function() {
      await this.getReserveOrders();
    },
    "$store.state.primaryCurrency": function() {
      this.showTable = false;
      this.$nextTick(
        () => {
          this.showTable = true;
        }
      );
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

.flex-center {
  .vs-table-text {
    justify-content: center !important;
  }
}
.top {
  position: relative;
  left: 15px;
}
.bg-info {
  background-color: #007bff !important;
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
.reserve-width-acceptable {
  width: max-content !important;
}
</style>
<style scoped lang="scss">
  #reserve-table {
    position: relative;
    top: 20px !important;
  }
  .cursor-pointer {
    cursor: pointer !important;
  }
  .center-align {
    text-align: center;
  }
  .right-align {
    text-align: right;
  }
  .left-align {
    text-align: left;
  }
  .date-range-picker-box {
    // margin-right: 75px;
    margin-top: 1px;
    width: 160px;
  }
  .table-page-btn {
    padding-left: 10px !important;
  }
  .show {
    display: flex;
  }
  .hide {
    display: none;
  }
  .currency-dropdown-caret {
    position: relative;
    top: 3px;
  }
  .input-select {
    height: 33px;
    border-radius: 0;
  }
  .pointer {
    cursor: pointer !important;
  }
  .launch-icon {
    position: relative;
    bottom: 5px;
    left: 2px;
    height: 15px;
    width: 15px;
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