<template>
  <vx-card id="token-price-ticker-card">
    <div id="token-price-ticker">
      <vs-row class="mt-4" vs-w="12" vs-justify="space-between">
        <vs-col :class="{'mb-5': updatedWidth < 768}" vs-type="block" vs-justify="left" vs-align="center" vs-lg="5" vs-sm="12">
          <h3 v-if="!showLatest">Historical Prices</h3>
          <h4 v-else class = "same-line__title">Token Prices (Last Updated: <transition name="fade" mode="out-in"><span v-if="showPrice">{{displayDay}}, {{displayHours}}:{{displayMinutes}}:{{displaySeconds}} {{dayTime}}</span></transition>)</h4>
          <span v-if="showLatest" class="same-line">{{getTimer}}</span>
        </vs-col>
        <vs-col :style="(showLatest)?'visibility: hidden;': ''" style="display: flex; justify-content: flex-end; padding-left: 0; padding-right: 0;" vs-align="center" vs-lg="2" vs-sm="12">
          <vs-select
            placeholder="Tokens"
            width="100px"
            class="selectExample token-picker mb-2"
            autocomplete
            v-model="tokenSelected"
          >
            <vs-select-item
              :key="index"
              :value="item.value"
              :text="item.text"
              v-for="(item,index) in tokenNames"
            />
          </vs-select>
        </vs-col>
        <vs-col  style="display: flex; padding-left: 0; padding-right: 0;" vs-align="center" vs-lg="2" vs-sm="6">
          <vs-checkbox v-model="showLatest">Latest Prices</vs-checkbox>
        </vs-col>
        <vs-col style="display: flex; justify-content: flex-end; padding-left: 0; padding-right:0;" vs-align="center" vs-lg="2" vs-sm="6">
          <date-range-picker
          class="date-range-picker-box mb-2"
          :class="{'theme-dark': $store.state.theme == 'dark'}"
          ref="picker"
          v-model="dateRange"
          :minDate="minDate"
          :maxDate="maxDate"
          :opens="opens">
            <div slot="input" slot-scope="picker" style="min-width: 130px; align-text: center;">
              <span v-if="showLatest">Pick date range</span>
              <span v-else>
                {{ picker.startDate | date }} - {{ picker.endDate | date }}
              </span>
              <vs-icon class="currency-dropdown-caret" icon="expand_more"></vs-icon>
            </div>
          </date-range-picker>
          
        </vs-col>
      </vs-row>
      <vs-table class="mt-5" id="overview" v-if="showLatest" :hoverFlat="true" :data="tokenPricesList">
        <template slot="thead">
          <vs-th id="name">NAME</vs-th>
          <vs-th class="text-center width-wide" id="price"><div style="width: 100%;">PRICE({{$store.state.primaryCurrency.symbol}})</div></vs-th>
        </template>

        <template slot-scope="{data}">
          <vs-tr :key="indextr" v-for="(tr, indextr) in data">
            <vs-td :data="data[indextr].price" class="tableData">
              <span class="token-image">
                <img
                  style="display: inline;"
                  height="30"
                  width="30"
                  :src="getUrlFromName(data[indextr].name)"
                  alt
                />
              </span>
              <span class="token-short-name">
                {{data[indextr].name}}
              </span>
            </vs-td>
            <vs-td :data="data[indextr].price" class="tableData text-center">
              <transition name="fade" mode="out-in">
                <span v-if="showPrice" class="token-price">{{parseFloat(data[indextr].price).toFixed(6)}}</span>
              </transition>
            </vs-td>
          </vs-tr>
        </template>
      </vs-table>
      <vs-table class="mt-5" id="details" v-else :hoverFlat="true" :data="tokenPricesList">
        <template slot="thead">
          <vs-th>TOKEN</vs-th>
          <vs-th class="text-center">DATE TIME (GMT)</vs-th>
          <vs-th class="text-center">PRICE(ETH)</vs-th>
        </template>
        <template slot-scope="{data}">
          <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
            <vs-td :class="{'small-stretch': screenSize < 768}">
              <div class="width-acceptable lh-cus-37">
                <span class="token-image">
                  <img
                    style="display: inline;"
                    height="30"
                    width="30"
                    :src="tr.url"
                  />
                </span>
                <span class="token-short-name">
                  {{tr.tokenName}}
                </span>
              </div>
            </vs-td>
            <vs-td class="text-center token-price">
              <div class="width-wide-date-time">
                {{tr.dateTime}}
              </div>
            </vs-td>
            <vs-td class="text-center">
              <div class="token-price width-acceptable">
                {{parseFloat(tr.price).toFixed(6)}}
              </div>
            </vs-td>
          </vs-tr>
        </template>
      </vs-table>
      <template>
        <div v-if="!showLatest" class="table-page-change mt-3">
          <vs-row vs-w="12" vs-justify="space-between">
            <vs-col vs-lg="2" vs-sm="2" :class="{'pt-1': updatedWidth < 768}" vs-justify="left">
              <vs-dropdown class="cursor-pointer" vs-trigger-click>
                <vs-button
                  class="btn-drop table-page-btn"
                  size="small"
                  type="border"
                  icon="expand_more"
                ><span :class="{'hide': updatedWidth < 768}">Items: </span>{{maxItems}}</vs-button>
                <vs-dropdown-menu class="items-per-page-dropdown">
                  <vs-dropdown-item>
                    <span @click="changeMaxItems(10)">10</span>
                  </vs-dropdown-item>
                  <vs-dropdown-item>
                    <span @click="changeMaxItems(20)">20</span>
                  </vs-dropdown-item>
                  <vs-dropdown-item>
                    <span @click="changeMaxItems(50)">50</span>
                  </vs-dropdown-item>
                  <vs-dropdown-item>
                    <span @click="changeMaxItems(100)">100</span>
                  </vs-dropdown-item>
                </vs-dropdown-menu>
              </vs-dropdown>
            </vs-col>
            <vs-col vs-lg="4" vs-sm="10" vs-justify="right">
              <div>
                <vs-pagination :max="updatedPaginationPages" :total="getPagesCount" v-model="activePage"></vs-pagination>
              </div>
            </vs-col>
          </vs-row>
        </div>
      </template>
    </div>
  </vx-card>
</template>
<script>

import TokenPriceService from "@/services/TokenPriceService.js";
import DateRangePicker from "vue2-daterange-picker";
import Pusher from "pusher-js";
import {getHyphenSeparatedDate} from "@/utils/util.js"
import {addZero} from "@/utils/util.js"
import {pusherKey} from "@/config/settings.js"

export default {
  data() {
    return {
      screenSize: 1100,
      tokenPricesList: [
        {
          id: 1,
          dateTime: "2",
          name: "OMG",
          price: "7"
        },
        {
          id: 2,
          dateTime: "2",
          name: "OMG",
          price: "7"
        },
        {
          id: 3,
          dateTime: "2",
          name: "OMG",
          price: "7"
        },
        {
          id: 4,
          dateTime: "2",
          name: "OMG",
          price: "7"
        },
        {
          id: 5,
          dateTime: "2",
          name: "OMG",
          price: "7"
        }
      ],
      totalTokenListCount: 0,
      tokenNames: [
        { text: "IT", value: 0 },
        { text: "Blade Runner", value: 2 },
        { text: "Thor Ragnarok", value: 3 }
      ],
      tokenUrls: [],
      rowFlat: true,
      tokenSelected: "ETH",
      activePage: 1,
      maxItems: 10,
      latestDateTime: "",
      tokenPriceDateTime: "",
      displayDay: "",
      displayHours: "",
      displayMinutes: "",
      displaySeconds: "",
      dayTime: "",
      timePassed: 0,
      timerInterval: null,
      showLatest: true,
      futureMonths: 0,
      pastMonths: 1,
      startDate: "2019-01-01",
      endDate: "2019-12-01",
      minDate: "02-01-2019",
      maxDate: Date(Date.now()).toString(),
      dateRange: {},
      opens: "left",
      showPrice: true
    };
  },
  components: {
    DateRangePicker
  },
  mounted() {
    this.startTimer();
  },
  methods: {
    adjustSpacingOfSearchBar() {
      var wrapperDivs = document.querySelectorAll('.vx-navbar-wrapper');
      var length = wrapperDivs.length;
      var styleProp = "top: -10px !important";
      for (var i = 0; i < length; i++) {
        wrapperDivs[i].setAttribute("style", styleProp);
      }
    },
    startTimer() {
      this.timerInterval = setInterval(() => (this.timePassed += 1), 1000);
    },
    onTimesUp() {
      clearInterval(this.timerInterval);
    },
    getHyphenSeparatedDate(date) {
      return getHyphenSeparatedDate(date);
    },
    setMaxDate() {
      var temp = new Date(Date.now());
      this.maxDate = new Date(
        temp.setMonth(temp.getMonth() + this.futureMonths)
      ).toString();
    },
    setBeginDate() {
      var temp = new Date(Date.now());
      this.dateRange.endDate = this.getHyphenSeparatedDate(Date.now());
      temp = new Date(temp.setMonth(temp.getMonth() - this.pastMonths));
      this.dateRange.startDate = this.getHyphenSeparatedDate(temp);
    },
    getUrlFromName(name) {
      if (name) {
        var url = this.$store.getters.getTokenImgUrl(name);
        if (url && (name == "WBTC" || name=="LINK" || name == "SAI")) {
          if (url.match(".*.png$") != null) {
            url = url.replace("png", "svg");
          }
        }
        return url;
      }
      else return "";
    },
    changeMaxItems(val) {
      this.maxItems = val;
    },
    getTokens() {
      var tokens = this.$store.state.tokens;
      for (var i = 0; i < tokens.length; i++) {
        this.tokenNames[i] = {
          text: tokens[i].short_name,
          value: tokens[i].short_name
        };
      }
    },
    getFormattedDate(rawDate) {
      var date = new Date(rawDate);
      var dd = date.getDate();
      var mm = date.getMonth() + 1;
      var yy = date.getFullYear();
      if (dd < 10) {
        dd = "0" + dd;
      }
      if (mm < 10) {
        mm = "0" + mm;
      }
      return yy + "-" + mm + "-" + dd;
    },
    async getOverview() {
      if (this.$store.state.theme == "dark") {
        this.$vs.loading({
          color: "#fff",
          container: "#token-price-ticker",
          type: "sound"
        });
      } else {
        this.$vs.loading({
          container: "#token-price-ticker",
          type: "sound"
        });
      }
      if(this.showLatest) {
        var data = await TokenPriceService.getTokenPriceOverview(this.$store.state.primaryCurrency.short_name);
        var tokenOverview = data.data.data;
        this.tokenPricesList = [];

        //gets and parses latest date and time.
        this.latestDateTime = new Date(tokenOverview["datetimes"][0]).toLocaleString();
        this.tokenPriceDateTime = new Date(tokenOverview["datetimes"][0])
        var tokenPriceDay = this.tokenPriceDateTime.getDate();
        var tokenPriceHours = this.tokenPriceDateTime.getHours();
        var tokenPriceMinutes = this.tokenPriceDateTime.getMinutes();
        var tokenPriceSeconds = this.tokenPriceDateTime.getSeconds();
        var currentDateTime = new Date();
        var currentDay = currentDateTime.getDate();

        //checks the day and returns today or no. of days ago.
        if (currentDay === tokenPriceDay) {
          this.displayDay = "Today"
        } else {
          var diff = currentDay - tokenPriceDay;
          this.displayDay = diff + "days ago";
        }
        
        //checks the hour and returns AM or PM accordingly.
        if(tokenPriceHours > 12) {
          tokenPriceHours = tokenPriceHours - 12
          this.displayHours = addZero(tokenPriceHours)
          this.displayMinutes = addZero(tokenPriceMinutes)
          this.displaySeconds = addZero(tokenPriceSeconds)
          this.dayTime = "PM"
        } else {
          this.displayHours = addZero(tokenPriceHours)
          this.displayMinutes = addZero(tokenPriceMinutes)
          this.displaySeconds = addZero(tokenPriceSeconds)
          this.dayTime = "AM"
        }

        delete tokenOverview["datetimes"];

        for (var tkn in tokenOverview) {
          if (tkn.length > 0 && tkn.charAt(0) == tkn.charAt(0).toUpperCase()) {
            this.tokenPricesList.push({
              price: tokenOverview[tkn][0],
              name: tkn
            });
          }
        }
      }
      this.$vs.loading.close('#token-price-ticker > .con-vs-loading');
    },
    getDateHeading(date) {
      var dateObj = new Date(date);
      return dateObj.toGMTString();
    },
    async getTokenPriceDetails() {
      if (this.$store.state.theme == "dark") {
        this.$vs.loading({
          color: "#fff",
          container: "#token-price-ticker",
          type: "sound"
        });
      } else {
        this.$vs.loading({
          container: "#token-price-ticker",
          type: "sound"
        });
      }
      var startDate = this.getHyphenSeparatedDate(this.dateRange.startDate);
      var endDate = this.getHyphenSeparatedDate(this.dateRange.endDate);
      var data = await TokenPriceService.getTokenPriceDetails(
        startDate,
        endDate,
        this.tokenSelected,
        this.activePage,
        this.maxItems
      );
      this.tokenPricesList = [];
      this.totalTokenListCount = data.data.count;
      var tokenData = data.data.data[this.tokenSelected];
      var dateTimes = data.data.data["datetimes"];
      if (dateTimes && tokenData) {
        for (var i = 0; i < dateTimes.length; i++) {
          this.tokenPricesList.push(
            {
              dateTime: (new Date(dateTimes[i])).toGMTString(),
              tokenName: this.tokenSelected,
              url: this.getUrlFromName(this.tokenSelected),
              price: this.$options.filters.toCurrencyFloat(tokenData[i], 4)
            }
          );
        }
      }
      setTimeout(() => {
        this.$vs.loading.close('#token-price-ticker > .con-vs-loading');
      }, 1000)
    },
    
  },
  async created() {
    var pusher = new Pusher(pusherKey, {
      cluster: "ap2",
      forceTLS: true
    });
    var channel = pusher.subscribe("price");
    var self = this;
    channel.bind("wrt"+self.$store.state.primaryCurrency.short_name, function(data) {
      if (self.$store.state.pusher && self.showLatest) {
        // resets timer.
        self.timePassed = 0;
        self.timerInterval = null;

        //gets and parses latest date and time.
        self.latestDateTime = (new Date()).toLocaleString();
        self.tokenPriceDateTime = (new Date());
        var tokenPriceDay = self.tokenPriceDateTime.getDate();
        var tokenPriceHours = self.tokenPriceDateTime.getHours();
        var tokenPriceMinutes = self.tokenPriceDateTime.getMinutes();
        var tokenPriceSeconds = self.tokenPriceDateTime.getSeconds();
        var currentDateTime = new Date();
        var currentDay = currentDateTime.getDate();

        //checks the day and returns today or no. of days ago.
        if (currentDay === tokenPriceDay) {
          self.displayDay = "Today"
        } else {
          var diff = currentDay - tokenPriceDay;
          self.displayDay = diff + "days ago";
        }

        //checks the hour and returns AM or PM accordingly.
        if(tokenPriceHours > 12) {
          tokenPriceHours = tokenPriceHours - 12
          self.displayHours = addZero(tokenPriceHours)
          self.displayMinutes = addZero(tokenPriceMinutes)
          self.displaySeconds = addZero(tokenPriceSeconds)
          self.dayTime = "PM"
        } else {
          self.displayHours = addZero(tokenPriceHours)
          self.displayMinutes = addZero(tokenPriceMinutes)
          self.displaySeconds = addZero(tokenPriceSeconds)
          self.dayTime = "AM"
        }


        self.showPrice = false;
        self.tokenPricesList.forEach(
          (element) => {
            element.price = data[element.name];
          }
        );
        self.$nextTick(() => {
          self.showPrice = true;
        });
      }
    });
    this.screenSize = window.screen.width;
    this.setMaxDate();
    this.setBeginDate();

    await this.getTokens();
    await this.getOverview();
    this.adjustSpacingOfSearchBar();
  },
  computed: {
    getTimer() {
      const timeLeft = this.timeLeft
      let minutes = Math.floor(timeLeft / 60)
      let hours = Math.floor(minutes / 60)
      let seconds = timeLeft % 60
      let minSeconds = `0${seconds}`
      let minMinutes = `0${minutes}`

      if(minutes == 0 && hours == 0){
        return "Prices refreshed" + " " +`${seconds}` + " " + "seconds" + " " + "ago"
      } else if(hours == 0){
        return "Prices refreshed" + " " +`${minutes}:${minSeconds}` + " " + "minutes" + " " + "ago"
      } else {
        return "Prices refreshed" + " " +`${hours}:${minMinutes}:${minSeconds}` + " " + "hours" + " " + "ago"
      }

    },

    timeLeft() {
      return this.timePassed
    },

    getPagesCount() {
      var maxItems = parseFloat(this.maxItems);
      var totalNumberOfOrders = parseFloat(this.totalTokenListCount);
      return Math.ceil(totalNumberOfOrders / maxItems);
    },
    updatedPaginationPages() {
      return 5;
    },
    updatedWidth() {
      return screen.width;
    }
  },
  watch: {
    timeLeft(newValue) {
      if (newValue === 86400) {
        this.onTimesUp();
      }
    },
    activePage: async function() {
      await this.getTokenPriceDetails();
    },
    maxItems: async function() {
      await this.getTokenPriceDetails();
    },
    tokenSelected: async function() {
      if (!this.showLatest) {
        await this.getTokenPriceDetails();
      }
      else {
        await this.getOverview();
      }
    },
    dateRange: async function(value) {
      if (value.startDate != value.endDate) {
        this.showLatest = false;
        await this.getTokenPriceDetails();
      } else {
        await this.getOverview();
      }
    },
    showLatest: async function(val) {
      if (val == true) {
        await this.getOverview();
      } else {
        await this.getTokenPriceDetails();
      }
    },
    "$store.state.primaryCurrency": async function() {
      this.$forceUpdate();
      await this.getOverview();
    }
  }
};
</script>
<style scoped lang="scss">
  .cursor-pointer {
    cursor: pointer !important;
  }
  #token-price-ticker-card {
    position: relative !important;
    top: 20px !important;
  }
</style>
<style lang="scss">
.lh-cus-37 {
  line-height: 37px;
}
.same-line__title {
  width: 109%;
}
.same-line {
  white-space: nowrap;
}
.vs-select--options ul {
  max-height: fit-content !important;
}
.cancelBtn {
  cursor: pointer;
}
.applyBtn {
  cursor: pointer;
}
.tr-expand {
  justify-content: left !important;
}
.content-tr-expand {
  justify-content: left !important;
}


.vs-table--tbody-table .tr-values.selected {
    cursor: text;
}

.date-picker-caret {
  position: relative;
  right: 20px;
  top: 3px;
  cursor: pointer;
}
.token-image {
  position: relative;
  top: 10px;
}
.tooltip-text {
  visibility: hidden;
  border-radius: 6px;
  padding: 5px;
  text-align: center;
  background-color: black;
  width: fit-content;
  z-index: 1;
  position: relative;
  top: 5px;
  right: 5px;
  color: #fff;
}
.icon-col:hover .tooltip-text {
  visibility: visible;
}
.token-short-name {
  font-size: 1.1rem;
  margin-left: 5px;
}
.token-price {
  font-size: 1.2rem;
}
.text-center {
  .vs-table-text {
    justify-content: center !important;
  }
}
.date-range-picker-box {
  // margin-right: 75px;
  width: 160px;
}

.currency-dropdown-caret {
  position: relative;
  top: 3px;
}

.hide {
  display: none !important;
}
.vs-select--input {
  border-radius: 0 !important;
  height: 33px !important;
}
.small-stretch {
  width: 50%;
}
.theme-dark > .form-control{
  background-color: #262c49 !important;
  color: #c2c6dc !important;
  border: 0;
}
.fade-enter-active {
  transition: opacity 3s ease;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
.fade-leave, .fade-enter-to {
  opacity: 1;
}
.width-wide-date-time {
  width: 100%;
  min-width: 300px;
}
.width-wide {
  width: 598px;
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
@media only screen and (max-width: 600px) {
  .width-acceptable {
    width: 110px !important;
  }
  .disp-bl {
    display: block;
  }
  .width-wide {
    width: 250px !important;
  }
  .table-page-btn {
    max-width: 50px !important;
  }
}


</style>