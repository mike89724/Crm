<template>
  <vx-card class="relative" id="loan-table">
    <vs-row vs-type="flex" vs-justify="space-between">
      <vs-col vs-lg="8" vs-sm="6" style="display: flex; justify-content: flex-start;">
        <h5 class="pt-3 pb-3">ACTION HISTORY</h5>
      </vs-col>
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
        <vs-table :class="{'mt-5': (updatedWidth < 768), 'mt-2': (updatedWidth >= 768)}" style="width: 100%;" v-if="showTable" :hoverFlat="false" :data="history">
          <template slot="header"></template>
          <template slot="thead">
            <vs-th><div class="loan-width-acceptable">ID</div></vs-th>
            <vs-th><div style="text-align: center;" class="loan-width-acceptable">META DATA</div></vs-th>
            <vs-th><div class="loan-width-acceptable">MESSAGE</div></vs-th>
            <vs-th><div class="loan-width-acceptable">STATUS</div></vs-th>
            <vs-th class="flex-center"><div style="text-align: center;" class="loan-width-acceptable">ACTION</div></vs-th>
            <vs-th><div class="loan-width-acceptable">PATH</div></vs-th>
          </template>
          <template slot-scope="{data}">
            <vs-tr :id="tr.id" class="row-expand" :key="indextr" v-for="(tr, indextr) in data">
              <vs-td :data="currentTime"><div class="loan-width-acceptable">{{data[indextr].id}}</div></vs-td>
              <vs-td class="center-align"><div class="loan-width-acceptable">{{data[indextr].metadata}}</div></vs-td>
              <vs-td
              >
              {{data[indextr].message}}
              </vs-td>
              <vs-td         
              >{{data[indextr].status}}</vs-td>
                {{data[indextr].action.title}}
              <vs-td>
              {{data[indextr].product.title}}/{{data[indextr].section.title}}/{{data[indextr].page.title}}
              </vs-td>
            </vs-tr>
          </template>
        </vs-table>
      </vs-col>
    </vs-row>
    <template>
      <div v-if="showPagination && history.length > 0" class="table-page-change mt-3">
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
      <div v-else-if="!showPagination && history.length > 0" class="p-6 pb-0 pt-2">
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
import axios from 'axios';

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
      history: [],
      transition: true,
      frames: new Array(10),
      offset: '',
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
    await this.getHistory();
    this.transition = false;
    setInterval(this.setCurrentTime, 1000);
    setInterval(this.expandRowAfterClick, 10);
  },
  methods: {
    async getOffset() {
      if(this.activePage > 1) {
        this.offset = (this.activePage - 1)*this.pageSize
      }
      if(this.offset != '') {
        await this.getHistory();
      }
    },
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
    async getHistory() {
      const response = await axios.get('https://api-crm.nuofox.com/action/history',{
        params: {
          offset: this.offset,
          limit: this.pageSize
        },
        headers: { 
          Authorization: 'Bearer ' + this.$store.state.profileData.data.data.token
        }
      })
      this.history = response.data.data;
      this.orderCount = history.length;
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
      await this.getOffset();
    },
    pageSize: async function() {
      await this.getHistory();
    },
    sortKey: async function() {
      await this.getHistory();
    },
    order: async function() {
      await this.getHistory();
    },
    status: async function() {
      await this.getHistory();
    },
    dateRange: async function() {
      await this.getHistory();
    },
    "$store.state.primaryCurrency": async function() {
      this.showTable = false;
      await this.getHistory();
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