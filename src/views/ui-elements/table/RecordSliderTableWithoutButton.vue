<template>
  <vx-card class="relative" id="table-swap">
    <vs-row vs-type="flex" vs-justify="space-between">
      <vs-col vs-lg="8" vs-md="8" vs-sm="8">
        <h5 v-if="title" class="pt-3 pb-3">{{title}}</h5>
        <h5 v-else class="pt-3 pb-3">{{table.title}}</h5>
        <div>{{this.tableText}}</div>
      </vs-col>
      <vs-col v-if="!showFilters" vs-lg="4" vs-sm="4" style="display: flex; justify-content: flex-end; align-items: center;">
        <div v-if="table.buttons.length > 0">
          <div v-for="(button,index) in table.buttons" :key="index">
            <vs-button class="text-xs" @click="buttonAction(button.sub_page)" style="margin-top: -3.5%; margin-right: 10%;">{{button.title}}</vs-button>
          </div>
        </div>
        <vs-prompt   
          vs-title=""                
          :vs-is-valid="validName"
          :vs-active.sync="activePrompt1">
          <div class="con-exemple-prompt">
            
            <vs-input type="checkbox" placeholder="Search" v-model="valMultipe.value1" class="mt-4 mb-2 w-full" />
            <vs-alert :vs-active="!validName" color="danger" vs-icon="new_releases" >
              Fields can not be empty please enter the data
            </vs-alert>
          </div>
        </vs-prompt>
        <feather-icon
          v-if="!showFilters"
          @click="openNewRoute()"
          style="cursor: pointer; height: 15px; width: 15px;"
          icon="ArrowUpRightIcon"
        ></feather-icon>
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
      <vs-col vs-w="12" :class="{'hide': transition, 'show': !transition}">
        <vs-table :class="{'mt-5': updatedWidth < 768}" style="width: 100%;" :hoverFlat="false" :data="table['main_values']">
          <template slot="header"></template>
          <template slot="thead">
            <vs-th v-for="(column, index) in table.main_columns" :key="index">
               <div>
                <v-menu offset-y>
                  <template v-slot:activator="{ on }">
                    <div style="white-space: nowrap;" type="border" :href="`#${index}`" v-on="on" class="cursor-pointer outline">
                          {{column.title}}
                          <feather-icon class="h-3" icon="ChevronsDownIcon"></feather-icon>
                    </div>
                  </template>
                  <v-list class="vs-con-tbody vs-table--tbody absolute" style="width: max-content;">
                    <div class="p-2 cursor-pointer" @click="showPrompt(column.col_tag)">
                      <feather-icon icon="FilterIcon"></feather-icon>FILTER
                    </div>
                    <vs-prompt
                      :id="`${index}`"
                      vs-title="Filter"
                      @vs-accept="filter(table.sub_page_tag)"
                      :vs-active.sync="activePrompt">
                      <div class="">
                        
                        <vs-input placeholder="Search" v-model="valMultipe.value1" class="mt-4 mb-2 w-full" />
                        <vs-alert :vs-active="!validName" color="danger" vs-icon="new_releases" >
                          Fields can not be empty please enter the data
                        </vs-alert>
                      </div>
                    </vs-prompt>
                    <div class="p-2" @click="sort(2, column.col_tag, table.sub_page_tag)"><feather-icon class="h-3" icon="ChevronsDownIcon"></feather-icon>ASCENDING</div>
                    <div class="p-2" @click="sort(1, column.col_tag, table.sub_page_tag)"><feather-icon class="h-3" icon="ChevronsUpIcon"></feather-icon>DESCENDING</div>
                  </v-list>
                </v-menu>   
              </div>
            </vs-th>
          </template>
          <template slot-scope="{data}">
            <vs-tr class="row-expand" v-for="(item, index) in data" :key="index">
              <vs-td v-for="(rowItem, i) in item" :key="i">
                {{rowItem}}
              </vs-td>
              <template class="expand-user" slot="expand">
                <div style="display: block; width: 100%;">
                  <table style="width: 80%; margin: auto;">
                    <thead>
                      <td style="border: 1px solid; text-align: center" class="pl-5" v-for="(item, x) in table.secondary_columns" :key="x">
                        <div>{{item.title}}</div>
                      </td>
                    </thead>
                    <tbody>
                      <td style="border: 1px solid; text-align: center">
                        <img style="height: 50px; width: 50px; border-radious: 50%; display: inline;" :src="table.secondary_values[index][0]">
                      </td>
                    </tbody>  
                  </table>
                  <div style="margin-top: 5%; width: 80%; margin: auto; padding-top: 5%;" class="flex">
                    <div class="pl-5" v-for="(button, y) in table.action_columns" :key="y">
                      <button v-if="table.action_values[index][y]" :class="getClassByCode(button.style.color)" @click="buttonAction(button.sub_page)" style="margin-top: -3.5%; margin-right: 10%; padding: .75rem 2rem; font-family: Montserrat, Helvetica, Arial, sans-serif;
                        font-size: 1rem; color: #ffffff; border-radius: 6px;">{{button.title}}</button>
                    </div>
                  </div>
                </div>
              </template>
            </vs-tr>
          </template>
        </vs-table>
      </vs-col>
    </vs-row>
    <template>
      <div v-if="showPagination" class="table-page-change mt-3">
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
      <div v-if="!showPagination" class="p-6 pb-0 pt-2">
        <span style="color: #3576FD; cursor: pointer;" @click="openNewRoute()">Show More</span>
      </div>
    </template>
  </vx-card>
</template>
<script>
import TradeDetailService from "@/services/TradeDetailService";
import SwapDetailService from "@/services/SwapDetailService";
import Pusher from "pusher-js";
import {pusherKey} from "@/config/settings.js"
import {getTradeOrderStatus, getFrame, getHyphenSeparatedDate} from "@/utils/util.js";
import { formatDate } from "@/static/util.js";
import VueApexCharts from "vue-apexcharts";
import ExpandableRowGraph from "@/views/ExpandableRowGraph.vue";
import ExpandableRowTable from "@/views/ExpandableRowTable.vue";
import DateRangePicker from "vue2-daterange-picker";
import "vue2-daterange-picker/dist/vue2-daterange-picker.css";
import axios from 'axios';

export default {
  props: {
    title: {
      type: String,
      required: true
    },
    name: {
      type: String
    },
    value: {
      type: Object
    },
    showPagination: {
      type: Boolean,
      default: true
    },
    showFilters: {
      type: Boolean,
      default: true
    },
  },
  data() {
    return {
      swaps: [],
      table: {},
      colTag: '',
      modalData: {},
      tag: '',
      sectionTag: '',
      productTag: '',
      currentTime: (new Date()).getMilliseconds(),
      rowClicked: 0,
      transition: true,
      activePrompt:false,
      activePrompt1:false,
      val:'',
      valMultipe: {
        value1:'',
        value2:''
      },
      showTable: true,
      // tableText: '',
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
          value: "Completed",
          text: "Completed"
        },
        {
          value: "Pending",
          text: "Pending"
        },
        {
          value: "Failed",
          text: "Failed"
        },
      ],
      futureMonths: 0,
      pastMonths: 3,
      startDate: "2020-03-25",
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
    ExpandableRowTable,
    DateRangePicker
  },
  async mounted() {
    if(this.value){
      this.table = this.value
    } else {
      const response = await axios.post('https://api-crm.nuofox.com/page',{
        page_tag: "user",
        section_tag: "access_control",
        product_tag: "settings",
        get_main_page: 0, 
        sub_page: [
          {
            tag: "all_users_table",
            params: {}}]
      },
      {
        headers: {
        Authorization: "Bearer " + this.$store.state.profileData.data.data.token
        },
      })
      this.table = response.data.data[0]
    }
    this.transition = false;
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
  created() {
    this.setTags();
  },
  methods: {
    getClassByCode(color) {
      if(color == 'link') {
        return 'link-button'
      } else if(color == 'safe') {
        return 'safe-button'
      } else if(color == 'medium') {
        return 'medium-button'
      } else if(color == 'danger') {
        return 'danger-button'
      } else if(color == 'inactive') {
        return 'inactive-button'
      } else if(color == 'white') {
        return 'white-button'
      }
    },
    setTags() {
      if(this.$store.state.profileData) {
        for (let i = 0; i < this.$store.state.profileData.data.data.products.length; i++) {
          for (let j = 0; j < this.$store.state.profileData.data.data.products[i].sections.length; j++) {
            for (let k = 0; j < this.$store.state.profileData.data.data.products[i].sections[j].pages.length; j++) {
              if(this.$store.state.profileData.data.data.products[i].sections[j].pages[k].slug === this.$route.params.pageSlug) {
                this.tag = this.$store.state.profileData.data.data.products[i].sections[j].pages[k].tag
                this.sectionTag = this.$store.state.profileData.data.data.products[i].sections[j].tag
                this.productTag = this.$store.state.profileData.data.data.products[i].tag
              }
              else return

            }
          }
        }
      }
    },
    buttonAction(subPage) {
      this.activePrompt1 = true;
      this.modalData = this.subPage
    },
    showPrompt(id) {
      this.activePrompt = true;
      this.colTag = id;
    },
    async sort(number, tag, pageTag) {
      const response = await axios.post('https://api-crm.nuofox.com/page',{
        page_tag: this.tag,
        section_tag: this.sectionTag,
        product_tag: this.productTag,
        get_main_page: 0,
        sub_page: [{
          tag: pageTag,
          params: {
            sort: number,
            sort_col: tag
          }
        }]
      },
      {
        headers: {
        Authorization: "Bearer " + this.$store.state.profileData.data.data.token
        },
      })
      this.tableText = 'sorted by ' + number + '' + tag
      console.log('printing sort response')
      console.log(response)
      this.showTable = false;
      this.table = response.data.data[0]
      this.$nextTick(() => {
        this.showTable = true;
      });
    },
     async filter(pageTag) {
      const response = await axios.post('https://api-crm.nuofox.com/page',{
        page_tag: this.tag,
        section_tag: this.sectionTag,
        product_tag: this.productTag,
        main_page: 0,
        get_main_page: 0,
        sub_page: [{
          tag: pageTag,
          params: {
            search_list: [this.valMultipe.value1], search_col: this.colTag
          }
        }]
      },
      {
        headers: {
        Authorization: "Bearer " + this.$store.state.profileData.data.data.token
        },
      })
      this.tableText = 'filtered by ' + this.valMultipe.value1 + '' + pageTag
       this.showTable = false;
      this.table = response.data.data[0]
      this.$nextTick(() => {
        this.showTable = true;
      });
    },
    acceptAlert() {
      this.clearValMultiple();
      this.$vs.notify({
        color:'success',
        title:'Accept Selected',
        text:'search successful'
      })
    },
    close(){
      this.$vs.notify({
        color:'danger',
        title:'Closed',
        text:'You closed search!'
      })
    },
    clearValMultiple() {
      this.valMultipe.value1 = "";
      this.valMultipe.value2 = "";
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
    getHyphenSeparatedDate(date) {
      return getHyphenSeparatedDate(date);
    },
    setCurrentTime() {
      this.currentTime = (new Date()).getTime();
    },
    openNewRoute() {
      this.$ga.event({
        eventCategory: 'Swaps',
        eventAction: 'Clicked',
        eventLabel: 'Swap Orders'
      });
      this.$router.push({ path: "/" + this.$route.params.tag + "/" + this.$route.params.sectionTag + "/" + this.$route.params.productTag + "/" + this.table.sub_page_tag});
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
    async getSwapOrders() {
      if (this.dateRange.startDate) {
        this.startDate = this.dateRange.startDate;
      }
      if (this.dateRange.endDate) {
        this.endDate = this.dateRange.endDate;
      }
      var swaps = await SwapDetailService.getSwapOrdersFull(
        this.$store.state.primaryCurrency.short_name,
        this.activePage,
        this.pageSize,
        this.sortKey,
        this.order,
        this.status,
        this.startDate,
        this.endDate
      );
      this.orderCount = swaps.data.count;
      this.swaps = swaps.data.data;
      this.showTable = false;
      var self = this;
      this.$nextTick(() => {
        self.showTable = true;
      });
    },
    matchStatus(originalStatusLabel, newStatusLabel) {
      if (originalStatusLabel == "Completed" && newStatusLabel === 1) {
        return true;
      } else if (originalStatusLabel == "Pending" && newStatusLabel == 4) {
        return true;
      } else if (originalStatusLabel == "Failed" && newStatusLabel == 2
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
      var totalNumberOfOrders = 5
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
      await this.getSwapOrders();
    },
    pageSize: async function() {
      await this.getSwapOrders();
    },
    sortKey: async function() {
      await this.getSwapOrders();
    },
    order: async function() {
      await this.getSwapOrders();
    },
    status: async function() {
      await this.getSwapOrders();
    },
    dateRange: async function() {
      await this.getSwapOrders();
    },
    "$store.state.primaryCurrency": async function() {
      this.showTable = false;
      await this.getSwapOrders();
      this.showTable = true;
    },
    "$store.state.theme": async function() {
      this.showTable = false;
      await this.getSwapOrders();
      this.showTable = true;
    }
  }
};
</script>
<style lang="scss">
.link-button {
  background: #007bff !important;
}
.safe-button {
  background: #28c76f !important;
}
.medium-button {
  background: orange !important;
}
.danger-button {
  background: #ea5455 !important;
}
.inactive-button {
  background: #262c49 !important;
}
.white-button {
  background: #ffffff !important;
}
.oval-green {
  background-color: #28c76f !important;
}
.oval-blue {
  background-color: #007bff !important;
}
.oval-red {
  background-color: #ea5455 !important;
}
.rounded-border {
  width: 8px;
  height: 8px;
  display: inline-flex;
  margin-right: 0.5rem;
  border-radius: 50%;
}
.disp-fl {
  display: flex;
}
.feather {
  height: 10px;
}
.image-icon {
  margin-right: 5%;
  height: 20px;
  width: 20px;
}
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
.swap-width-acceptable {
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
  #table-swap {
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

<style>
#table-swap .vs-table--tbody-table .tr-values td {
  padding: 25px !important;
}
#table-swap .vs-con-table .vs-con-tbody .vs-table--tbody-table .vs-table--thead th {
  padding: 25px !important;
  text-align: center !important;
}
#table-swap .con-vs-dialog .vs-dialog-dark {
  background: transparent !important;
}
</style>