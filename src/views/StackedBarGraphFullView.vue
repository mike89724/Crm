<template>
  <div id="dashboard-stacked-graph">
    <vx-card>
      <vs-row vs-align="center" vs-type="flex" vs-justify="space-between" vs-w="12">
        <vs-col vs-lg="6" vs-md="6" vs-sm="12">
          <vs-breadcrumb :class="{'ml-10 mb-3 mt-3': screenWidth > 768, 'ml-10': !parentName}">
            <li v-if="parentName">
              <span class="home-route" @click="openNewRoute()">Reserves Overview</span>
              <span>
                <vs-icon icon="chevron_right"></vs-icon>
              </span>
            </li>
            <li aria-current="page" class="active">
              <span class="current-route">{{title}}</span>
            </li>
          </vs-breadcrumb>
        </vs-col>
        <vs-col style="padding-left: 0; padding-right: 0;" vs-lg="6" vs-md="6" vs-sm="12">
          <vs-row vs-type="flex" vs-justify="flex-end">
            <vs-col
              vs-lg="6"
              vs-md="6"
              vs-sm="4"
              style="display: flex; padding-left: 0px; padding-right: 0px;"
              :style="updatedWidth < 768?'justify-content: flex-start;': 'justify-content: flex-end;'"
            >
              <vs-checkbox :class="{'hide': showAll}" class="mt-5" v-model="showAll">Show All</vs-checkbox>
            </vs-col>
            <vs-col
              vs-lg="6"
              vs-md="6"
              vs-sm="8"
              style="display: flex; justify-content: flex-end; padding-left: 0; padding-right: 0;"
            >
              <vs-select
                placeholder="Tokens"
                :width="(updatedWidth < 768)?'200px':'250px'"
                :multiple="true"
                autocomplete
                class="mt-3"
                v-model="tokensSelected"
              >
                <vs-select-item
                  :key="index"
                  :value="item.value"
                  :text="item.text"
                  v-for="(item,index) in tokens"
                />
              </vs-select>
            </vs-col>
          </vs-row>
        </vs-col>
      </vs-row>
      <vs-row :class="{'mt-5': (updatedWidth < 768)}" vs-align="center" vs-type="flex" vs-justify="flex-start" vs-w="12">
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
          <div class="line-area-chart" id="graph-full-view">
            <vue-apex-charts
              ref="apexChart"
              :type="type"
              height="500"
              width="100%"
              :options="chartOptionsUpdated"
              :series="chartSeriesUpdated"
            ></vue-apex-charts>
          </div>
        </vs-col>
      </vs-row>
    </vx-card>
  </div>
</template>
<script>
import GraphService from "@/services/GraphFullViewService";
import VueApexCharts from "vue-apexcharts";
import DateRangePicker from "vue2-daterange-picker";
import {HOME_URL, RESERVE_URL, LOAN_URL, TRADE_URL, getHyphenSeparatedDate} from "@/utils/util.js";

// you need to import the CSS manually (in case you want to override it)
import "vue2-daterange-picker/dist/vue2-daterange-picker.css";
export default {
  data() {
    return {
      parentName: "",
      screenWidth: 1100,
      title: "",
      showAll: false,
      screenSize: "1100",
      graphName: "",
      isCustomFormatter: false,
      seriesNames: [],
      seriesMultiDimensionalArray: [],
      seriesPercentageMultiDimensionalArray: [],
      series: [],
      labels: [],
      type: "area",
      options: {},
      currency: "",
      tokens: [
        { text: "ETH", value: "ETH" },
        { text: "DAI", value: "DAI" },
        { text: "WBTC", value: "WBTC" },
        { text: "ALL", value: "ALL" }
      ],

      futureMonths: 3,
      pastMonths: 1,
      startDate: "2019-01-01",
      endDate: Date.now(),
      minDate: "02-01-2019",
      maxDate: Date(Date.now()).toString(),
      dateRange: {},
      opens: "left",
      tokensSelected: [],
      APR: ""
    };
  },
  watch: {
    tokensSelected: async function(value) {
      if (value.length != 0 && value.length != this.tokens.length) {
        this.showAll = false;
      } else if (value.length == 0) {
        this.showAll = true;
      }
      await this.getGraphDetails();
    },
    dateRange: async function() {
      await this.getGraphDetails();
    },
    showAll: function(val) {
      if (val == true) this.tokensSelected = [];
    },
    "$store.state.primaryCurrency": async function() {
      await this.getGraphDetails();
      this.$forceUpdate();
    }
  },
  components: {
    VueApexCharts,
    DateRangePicker
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (from.path == HOME_URL) {
        vm.parentName = "Home";
      } else if (from.path == RESERVE_URL) {
        vm.parentName = "Reserve Overview";
      } else if (from.path == LOAN_URL) {
        vm.parentName = "Loan Overview";
      } else if (from.path == TRADE_URL) {
        vm.parentName = "Trade Overview";
      } else {
        vm.parentName = false;
      }
    });
  },
  async created() {
    this.screenWidth = window.screen.width;
    this.setMaxDate();
    this.setBeginDate();
    this.setGraphCredentials();
    this.getTokens();
    this.showAll = true;
    await this.getGraphDetails();
    this.adjustSpacingOfSearchBar();
    document.querySelectorAll('.input-select')[0].setAttribute("readonly", "true");
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
    getHyphenSeparatedDate(date) {
      return getHyphenSeparatedDate(date);
    },
    openNewRoute() {
      this.$router.go(-1);
    },
    formattedLabel(val) {
      var sign = val < 0 ? -1 : 1;
      var absVal = Math.abs(val);
      if (absVal >= 1000000000) {
        return (sign * (parseInt(absVal)) / 1000000000).toFixed(2) + "B";
      } else if (absVal >= 1000000) {
        return (sign * (parseInt(absVal)) / 1000000).toFixed(2) + "M";
      } else if (absVal >= 1000) {
        return (sign * (parseInt(absVal)) / 1000).toFixed(2) + "K";
      } else {
        if (this.graphDataKey == "value") {
          return (sign * absVal).toFixed(2);
        } else {
          return sign * absVal;
        }
      }
    },
    setGraphCredentials() {
      if (this.$route.name == "reserve_utilization") {
        this.type = "bar";
        this.isCustomFormatter = false;
        this.title = this.toTitleCase(this.$route.name);
        this.graphName = "reserve:utilization";
      }
      this.currency = this.$store.state.primaryCurrency.symbol;
      // this.showAll = true;
      // this.tokensSelected = this.ifTokenMultiSelector() ? ["ALL"] : "ALL";
    },
    toTitleCase(text) {
      if (text && text.length) {
        text = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
        var arr = text.split("_");
        return arr.join(" ");
      } else return text;
    },
    async getGraphDetails() {
      var self = this;
      var data = await GraphService.getData(
        this.graphName,
        this.$store.state.primaryCurrency.short_name,
        this.getHyphenSeparatedDate(this.startDate),
        this.getHyphenSeparatedDate(this.endDate),
        ["ALL"]
      );
      this.seriesMultiDimensionalArray = [];
      self.seriesNames = ["loan_amount", "reserve_amount"];
      data = data.data;
      self.labels = [];
      self.seriesMultiDimensionalArray = new Array(2);
      self.seriesMultiDimensionalArray[0] = [];
      self.seriesMultiDimensionalArray[1] = [];
      var index = 0;
      Object.keys(data).forEach(tkn => {
        if (
          this.showAll ||
          this.tokensSelected.find(element => {
            return element == tkn;
          })
        ) {
          self.labels[index] = tkn;
          self.seriesMultiDimensionalArray[0][index] = data[tkn]["loan_amount"]
            ? data[tkn]["loan_amount"]
            : 0;
          self.seriesMultiDimensionalArray[1][index] = data[tkn][
            "reserve_amount"
          ]
            ? data[tkn]["reserve_amount"]
            : 0;
          index++;
        }
      });
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
    setBeginDate() {
      //Sets the default dateRange to 3 months past to present
      // var temp = new Date(Date.now());
      // this.dateRange.endDate = temp.toString();
      // this.dateRange.startDate = new Date(
      //   temp.setMonth(temp.getMonth() - this.pastMonths)
      // ).toString();
      this.dateRange.startDate = this.startDate;
      this.dateRange.endDate = this.endDate;
    },
    async getTokens() {
      this.tokens = [];
      var tokensNames = this.$store.state.tokens;
      this.tokensSelected = [];
      for (var i = 0; i < tokensNames.length; i++) {
        this.tokens[i] = {
          text: tokensNames[i].short_name,
          value: tokensNames[i].short_name
        };
        this.tokensSelected[i] = this.tokens[i].value;
      }
    },
    elapsedTime(startTime) {
      let x = new Date(startTime);
      let now = new Date();
      var timeDiff = now - x;
      timeDiff /= 1000;

      var seconds = Math.round(timeDiff);
      timeDiff = Math.floor(timeDiff / 60);

      var minutes = Math.round(timeDiff % 60);
      timeDiff = Math.floor(timeDiff / 60);

      var hours = Math.round(timeDiff % 24);
      timeDiff = Math.floor(timeDiff / 24);

      var days = Math.round(timeDiff % 365);
      timeDiff = Math.floor(timeDiff / 365);

      var years = timeDiff;

      if (years > 0) {
        return years + (years > 1 ? " Years " : " Year ") + "ago";
      } else if (days > 0) {
        return days + (days > 1 ? " Days " : " Day ") + "ago";
      } else if (hours > 0) {
        return hours + (hours > 1 ? " Hrs " : " Hour ") + "ago";
      } else if (minutes > 0) {
        return minutes + (minutes > 1 ? " Mins " : " Min ") + "ago";
      } else if (seconds > 0) {
        return seconds + (seconds > 1 ? `${seconds} sec ago` : "just now");
      }

      return "Just Now";
    },
    ifTokenMultiSelector() {
      if (this.$route.name == "premium") {
        return false;
      } else {
        return true;
      }
    }
  },
  computed: {
    updatedWidth() {
      let width = screen.width;
      if (width < 768) {
        return parseInt(width * 0.9);
      } else {
        return parseInt(width * 0.75);
      }
    },
    chartOptionsUpdated() {
      var self = this;
      var X = self.labels;
      var updatedOptions = {
        chart: {
          stacked: true,
          toolbar: {
            show: false
          },
          width: '100%'
        },
        dataLabels: {
          enabled: false
        },
        colors: ["rgba(53, 118, 253)", "rgba(53, 118, 253, 0.75)"],
        plotOptions: {
          bar: {
            horizontal: false
          }
        },
        stroke: {
          show: false,
          width: 1,
          colors: ["#fff"]
        },
        title: {
          text: ""
        },
        xaxis: {
          categories: X,
          labels: {
            formatter: function(val) {
              return val;
            },
            offsetY: 0
          },
          axisBorder: {
            show: false
          },
          axisTicks: {
            show: false
          },
          crosshairs: {
            show: false
          }
        },
        yaxis: {
          labels: {
            formatter: function(val) {
              if (val >= 0) return self.formattedLabel(val);
              else return "";
            }
          },
          axisBorder: {
            show: false
          },
          min: 0,
          tickAmount: 5
        },
        grid: {
          show: true,
          xaxis: {
            lines: {
              show: false
            }
          },
          yaxis: {
            lines: {
              show: false
            }
          },
          row: {
            colors: ["transparent", "transparent"], // takes an array which will be repeated on columns
            opacity: 0.1
          }
        },
        tooltip: {
          shared: true,
          intersect: false,
          custom: function({ series, dataPointIndex}) {
            var container =
              '<div class="light" style="left: 159.651px; top: 24px;">';
            var title =
              '<div class="apexcharts-tooltip-title" style="font-family: Helvetica, Arial, sans-serif; font-size: 12px;">';
            var seriesGroupActive = '<div class="tooltip-series-group active">';
            var tooltipMarker1 =
              '<span class="apexcharts-tooltip-marker" style="background-color: rgba(53, 118, 253, 0.75); display: inline-block;">';
            var tooltipMarker2 =
              '<span class="apexcharts-tooltip-marker" style="background-color: rgba(53, 118, 253); display: inline-block;">';
            var tooltipText =
              '<div class="apexcharts-tooltip-text" style="width: fit-content; font-family: Helvetica, Arial, sans-serif; font-size: 12px;">';
            var tooltipYGp =
              '<div class="apexcharts-tooltip-y-group" style="width: 100%; display: flex; justify-content: space-between">';
            var tooltipZGp =
              '<div class="apexcharts-tooltip-z-group" style="width: 100%; display: flex; justify-content: space-between">';
            var tooltipTextLabel =
              '<span class="apexcharts-tooltip-text-label">';
            var tooltipTextValue =
              '<span class="apexcharts-tooltip-text-value">';
            var endSpan = "</span>";
            var endDiv = "</div>";
            var amount_lent = series[0][dataPointIndex]
              ? series[0][dataPointIndex]
                  .toFixed(0)
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : 0;
            var amount_available = series[1][dataPointIndex]
              ? series[1][dataPointIndex]
                  .toFixed(0)
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : 0;
            var reserveUtilizationPercentage = 100*series[0][dataPointIndex]/(series[0][dataPointIndex] + series[1][dataPointIndex]);
            if (reserveUtilizationPercentage.toFixed(2) == 0) {
              reserveUtilizationPercentage = reserveUtilizationPercentage.toFixed(4);
            } else {
              reserveUtilizationPercentage = reserveUtilizationPercentage.toFixed(2);
            }
            var htmlText = `
            ${container}
              ${title}
                Reserve Utilization: ${tooltipTextValue}${reserveUtilizationPercentage}%${endSpan}
              ${endDiv}
              ${seriesGroupActive}
                ${tooltipMarker1}
                ${endSpan}
                ${tooltipText}
                  ${tooltipYGp}
                    ${tooltipTextLabel}
                      Amount Available:
                    ${endSpan}
                    ${tooltipTextValue}
                      ${self.$store.state.primaryCurrency.symbol}${amount_available}
                    ${endSpan}
                  ${endDiv}
                ${endDiv}
              ${endDiv}
              ${seriesGroupActive}
                ${tooltipMarker2}
                ${endSpan}
                ${tooltipText}
                  ${tooltipZGp}
                    ${tooltipTextLabel}
                      Amount Lent:
                    ${endSpan}
                    ${tooltipTextValue}
                      ${self.$store.state.primaryCurrency.symbol}${amount_lent}
                    ${endSpan}
                  ${endDiv}
                ${endDiv}
              ${endDiv}

            ${endDiv}
            `;

            return htmlText;
          }
        },
        fill: {
          opacity: 1
        },

        legend: {
          position: "top",
          horizontalAlign: "left",
          offsetX: 40,
          onItemClick: {
            toggleDataSeries: false
          }
        }
      };
      return updatedOptions;
    },
    chartSeriesUpdated() {
      var self = this;
      self.series = [];
      var labels = ["Amount Borrowed", "Amount Available"];
      this.seriesMultiDimensionalArray.forEach((item, index) => {
        var dataItem = [];
        var otherIndex = index == 1 ? 0 : index == 0 ? 1 : index;
        if (self.seriesNames[index] == "loan_amount") {
          dataItem = self.seriesMultiDimensionalArray[index];
        } else if (self.seriesNames[index] == "reserve_amount") {
          for (
            var i = 0;
            i < self.seriesMultiDimensionalArray[index].length;
            i++
          ) {
            dataItem.push(
              self.seriesMultiDimensionalArray[index][i] -
                self.seriesMultiDimensionalArray[otherIndex][i]
            );
          }
        }
        self.series.push({
          name: labels[index],
          data: dataItem
        });
      });
      return self.series;
    }
  }
};
</script>
<style lang="scss">
.theme-dark {
  :not(.apexcharts-legend-marker, .apexcharts-tooltip-marker) {
    background: rgba(16, 22, 58, 1) !important;
    color: #fff !important;
  }
}

.input-select {
  height: 33px;
  border-radius: 0;
}

.hide {
  display: none;
}

.tooltip-series-group {
  padding: 0 10px;
  display: none;
  text-align: left;
  justify-content: left;
  align-items: center;
  display: flex;
}

.home-route {
  cursor: pointer;
  font-size: 20px;
  font-family: 'Rubik', sans-serif;
  color: #1F74FF;
}

.current-route {
  font-size: 20px;
  font-family: 'Rubik', sans-serif;
}
#dashboard-stacked-graph {
  position: relative;
  top: 20px !important;
}
.vs-select--options ul {
  max-height: fit-content !important;
}
</style>
<style scoped lang="scss">
  #graph-full-view {
    width: 100%;
  }
</style>