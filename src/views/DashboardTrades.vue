<!-- =========================================================================================
  File Name: DashboardAnalytics.vue
  Description: Dashboard Analytics
  ----------------------------------------------------------------------------------------
  Item Name: Vuesax Admin - VueJS Dashboard Admin Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <div id="dashboard-trades">
    <vs-row>
      <vs-col class="mb-5" vs-lg="6" vs-sm="12">
        <overview-card
          :iconRight="true"
          icon="ArrowUpRightIcon"
          :statistic="tradeGeneratedValueStatistic"
          statisticTitle="Trades Value"
          :chartOptionsData="tradeGeneratedValueOptions"
          :chartSeriesData="tradeGeneratedValueSeries"
          name="trade"
          type="area"
          :showCurrencySymbol="true"
          :transition="transition"
          transitionSize="trade-page-row-1"
        ></overview-card>
      </vs-col>

      <vs-col class="mb-5" vs-lg="6" vs-sm="12">
        <overview-card
          :iconRight="true"
          icon="ArrowUpRightIcon"
          :statistic="tradeGeneratedCountStatistic"
          statisticTitle="Trades Count"
          :chartOptionsData="tradeGeneratedCountOptions"
          :chartSeriesData="tradeGeneratedCountSeries"
          name="tradetx"
          type="area"
          :showCurrencySymbol="false"
          :transition="transition"
          transitionSize="trade-page-row-1"
        ></overview-card>
      </vs-col>
    </vs-row>

    <vs-row>
      <vs-col class="mb-5" vs-lg="6" vs-sm="12">
        <vx-card>
          <span :class="{'hide': !transition}" class="mt-4" v-html="getFrame('text-label-long')"></span>
          <vs-row vs-type="flex" vs-justify="flex-start">
            <vs-col vs-w="10">
              <h5 :class="{'hide': transition}" class="mt-4">{{averageInitialLeverage.title}}</h5>
            </vs-col>
          </vs-row>
          <span v-if="transition" v-html="getFrame('trade-page-row-2')"></span>
          <span :class="{'hide': transition}">
            <vue-apex-charts
              type="bar"
              height="200"
              width="100%"
              :options="averageInitialLeverage.chartOptions"
              :series="averageInitialLeverage.series"
            ></vue-apex-charts>
          </span>
        </vx-card>
      </vs-col>
      <vs-col class="mb-5" vs-lg="6" vs-sm="12">
        <vx-card>
          <span :class="{'hide': !transition}" class="mt-4" v-html="getFrame('text-label-long')"></span>
          <vs-row vs-type="flex" vs-justify="flex-start">
            <vs-col vs-w="10">
              <h5 :class="{'hide': transition}" class="mt-4">{{averageTradeAmount.title}}</h5>
            </vs-col>
          </vs-row>
          <span v-if="transition" v-html="getFrame('trade-page-row-2')"></span>
          <span :class="{'hide': transition}">
            <vue-apex-charts
              type="bar"
              height="200"
              width="100%"
              :options="averageTradeAmount.chartOptions"
              :series="averageTradeAmount.series"
            ></vue-apex-charts>
          </span>
        </vx-card>
      </vs-col>
    </vs-row>

    <!-- Tabs of Trade,  Loan and Reserve Details-->
    <vs-row>
      <vs-col vs-w="12">
        <TableTradeDetailsFull :showPagination="false" :showFilters="false"></TableTradeDetailsFull>
      </vs-col>
    </vs-row>
  </div>
</template>

<script>
import VueApexCharts from "vue-apexcharts";
import OverviewCard from "@/components/statistics-cards/OverviewCard.vue";
import analyticsData from "./ui-elements/card/analyticsData.js";
import ChangeTimeDurationDropdown from "@/components/ChangeTimeDurationDropdown.vue";
import apexChatData from "@/views/charts-and-maps/charts/apex-charts/apexChartData.js";
import TableTradeDetailsFull from "./ui-elements/table/TableTradeDetailsFull.vue";
import {getFrame} from "@/utils/util.js";

export default {
  data() {
    return {
      transition: true,
      analyticsData: analyticsData,
      apexChatData: apexChatData,
      isImp: false,
      navbarSearchAndPinList: this.$store.state.navbarSearchAndPinList,
      show: false,
      items: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      nextNum: 10,
      tableList: [
        "vs-th: Component",
        "vs-tr: Component",
        "vs-td: Component",
        "thread: Slot",
        "tbody: Slot",
        "header: Slot"
      ],
      tradeGeneratedValueStatistic: "0",
      tradeGeneratedValueOptions: {
        chart: {
          animations: {
            enabled: false
          }
        },
        yaxis: {
          labels: {
            show: false
          }
        },
        xaxis: {
          labels: {
            show: false
          },
          axisBorder: {
            show: false
          }
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
        }
      },
      tradeGeneratedValueSeries: [
        {
          name: "",
          data: []
        }
      ],

      tradeGeneratedCountStatistic: "0",
      tradeGeneratedCountOptions: {
        chart: {
          animations: {
            enabled: false
          }
        },
        yaxis: {
          labels: {
            show: false
          }
        },
        xaxis: {
          labels: {
            show: false
          },
          axisBorder: {
            show: false
          }
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
        }
      },
      tradeGeneratedCountSeries: [
        {
          name: "",
          data: []
        }
      ],
      averageInitialLeverage: {
        title: "",
        series: [{
          name: "",
          data: []
        }],
        chartOptions: {
          chart: {
            animations: {
              enabled: false
            }
          },
          yaxis: {
            labels: {
              show: false
            }
          },
          xaxis: {
            labels: {
              show: false
            },
            axisBorder: {
              show: false
            }
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
          }
        }
      },
      averageTradeAmount: {
        title: "",
        series: [{
          name: "",
          data: []
        }],
        chartOptions: {
          chart: {
            animations: {
              enabled: false
            }
          },
          yaxis: {
            labels: {
              show: false
            }
          },
          xaxis: {
            labels: {
              show: false
            },
            axisBorder: {
              show: false
            }
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
          }
        }
      }
    };
  },
  components: {
    VueApexCharts,
    ChangeTimeDurationDropdown,
    TableTradeDetailsFull,
    OverviewCard
  },
  async mounted() {
    if (this.$store.state.theme == "dark") {
      this.$vs.loading({
        color: "#fff",
        container: "#dashboard-trades",
        type: "sound"
      });
    } else {
      this.$vs.loading({
        container: "#dashboard-trades",
        type: "sound"
      });
    }
    await this.getTradesOverviewData();
    this.generateTradeValueAndCountChart();
    this.generateAverageInitialLeverage();
    this.generateAverageTradeAmount();
    // setTimeout(
      // () => {
        this.$vs.loading.close('#dashboard-trades > .con-vs-loading');
      // }
    // , 1000000);
    this.transition = false;
  },
  watch: {
    "$store.state.primaryCurrency": async function() {
      if (this.$store.state.theme == "dark") {
        this.$vs.loading({
          color: "#fff",
          container: "#dashboard-trades",
          type: "sound"
        });
      } else {
        this.$vs.loading({
          container: "#dashboard-trades",
          type: "sound"
        });
      }
      await this.getTradesOverviewData();
      this.initializeValues();
      this.generateTradeValueAndCountChart();
      this.generateAverageInitialLeverage();
      this.generateAverageTradeAmount();
      this.$forceUpdate();
      this.$vs.loading.close('#dashboard-trades > .con-vs-loading');
    }
  },
  methods: {
    initializeValues() {
      this.tradeGeneratedValue.series = [];
      this.tradeGeneratedCount.series = [];
      this.averageInitialLeverage.series = [];
      this.averageTradeAmount.series = [];
    },
    formattedLabel(val) {
      var sign = (val < 0)? -1: 1;
      var absVal = Math.abs(val);
      if (absVal >= 1000000000) {
        return (sign * parseInt(absVal) / 1000000000) + "B";
      } else if (absVal >= 1000000) {
        return (sign * parseInt(absVal) / 1000000) + "M";
      } else if (absVal >= 1000) {
        return (sign * parseInt(absVal) / 1000) + "K";
      } else {
        if (this.graphDataKey == "value") {
          if (absVal < 10) {
            return (sign * absVal).toFixed(2);
          } else
            return sign * absVal;
        } else {
          return (sign * absVal);
        }
      }
    },
    getFrame(size) {
      let isDark = this.$store.state.theme == 'dark';
      return getFrame(size, isDark);
    },
    async getTradesOverviewData() {
      await this.$store.dispatch("fetchTradesOverview", this.$store.state.primaryCurrency.short_name);
    },
    generateTradeValueAndCountChart() {
      var self = this;
      this.tradeGeneratedValueStatistic = this.$store.state.globalTradeOverviewDetails.total_trades_amount;
      this.tradeGeneratedCountStatistic = this.$store.state.globalTradeOverviewDetails.total_trades_count;
      var data = this.$store.state.globalTradeOverviewDetails.trade_generated;
      var value = [];
      var count = [];
      var dateTime = [];
      for (var key in data) {
        dateTime.push(key);
        var index = 0;
        for (var tkn in data[key]) {
          if (!value[index]) {
            value[index] = [];
          }
          if (!count[index]) {
            count[index] = [];
          }
          value[index].push(data[key][tkn]["value"]);
          count[index].push(data[key][tkn]["count"]);
          index++;
        }
      }
      value.forEach((item, index) => {
        self.$set(self.tradeGeneratedValueSeries, index, {
          name: "Trade Value",
          data: item
        });
      });
      count.forEach((item, index) => {
        self.$set(self.tradeGeneratedCountSeries, index, {
          name: "Trade Count",
          data: item
        });
      });
      this.tradeGeneratedValueOptions = {
        grid: {
          show: false,
          padding: {
            left: 0,
            right: 0
          }
        },
        chart: {
          toolbar: {
            show: false
          },
          sparkline: {
            enabled: true
          },
          offsetY: -10
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: "smooth",
          width: 1
        },
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 0.9,
            opacityFrom: 1,
            opacityTo: 0.7
          }
        },
        xaxis: {
          labels: {
            style: {
              cssClass: "text-grey fill-current"
            }
          },
          axisTicks: {
            show: false
          },
          categories: dateTime,
          axisBorder: {
            show: false
          },
          tooltip: {
            enabled: false
          }
        },
        yaxis: [
          {
            y: 0,
            offsetX: 0,
            offsetY: 0,
            padding: { left: 0, right: 0 },
            min: 0
          }
        ],
        tooltip: {
          x: { show: true },
          y: {
            show: true,
            formatter: function(
              value
            ) {
              if (Number.isFinite(value)) {
                if (!Number.isInteger(value)) {
                  value = value.toFixed(2);
                }
                return self.$store.state.primaryCurrency.symbol + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
              }
              else
                return self.$store.state.primaryCurrency.symbol + 0;
            }
          }
        }
      };
      this.tradeGeneratedCountOptions = {
        grid: {
          show: false,
          padding: {
            left: 0,
            right: 0
          }
        },
        chart: {
          toolbar: {
            show: false
          },
          sparkline: {
            enabled: true
          },
          offsetY: -10
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: "smooth",
          width: 1
        },
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 0.9,
            opacityFrom: 1,
            opacityTo: 0.7
          }
        },
        xaxis: {
          labels: {
            style: {
              cssClass: "text-grey fill-current"
            }
          },
          axisTicks: {
            show: false
          },
          categories: dateTime,
          axisBorder: {
            show: false
          },
          tooltip: {
            enabled: false
          }
        },
        yaxis: [
          {
            y: 0,
            offsetX: 0,
            offsetY: 0,
            padding: { left: 0, right: 0 },
            min: 0
          }
        ],
        tooltip: {
          x: { show: true },
          y: {
            show: true,
            formatter: function(
              value
            ) {
              return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
          }
        }
      };
    },
    generateAverageInitialLeverage() {
      var data = this.$store.state.globalTradeOverviewDetails
        .average_initial_leverage;
      var leverage = [];
      var months = [];
      for (var key in data) {
        months.push(key.toString().substring(0,3));
        leverage.push(data[key]);
      }
      this.averageInitialLeverage.title = "Average Initial Leverage";
      this.averageInitialLeverage.series = [
        {
          name: "Average Initial Leverage",
          data: leverage
        }
      ];
      this.averageInitialLeverage.chartOptions = {
        chart: {
          stacked: false,
          toolbar: {
            show: false
          },
          offsetY: 20,
          offsetX: -4
        },
        grid: {
          xaxis: {
            lines: {
              show: false
            }
          },
          yaxis: {
            lines: {
              show: false
            }
          }
        },
        colors: ["rgba(53, 118, 253)", "rgba(53, 118, 253, 0.75)"],
        plotOptions: {
          bar: {
            horizontal: false
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          show: false,
          width: 1,
          colors: ["#fff"]
        },
        xaxis: {
          categories: months,
          labels: {
            offsetY: 0,
            show: true,
            formatter: function(val) {
              return val;
            }
          },
          axisTicks: {
            show: false
          },
          crosshairs: {
            show: false
          }
        },
        yaxis: {
          tickAmount: 3,
          labels: {
            show: true,
            offsetX: -10,
            formatter: function(val) {
              if (Number.isFinite(val)) {
                return val.toFixed(1);
              } else {
                return 0;
              }
            }
          }
        },
        tooltip: {
          shared: true,
          intersect: false,
          y: {
            show: true,
            labels: {
              formatter: function(val) {
                return val.toFixed(2);
              }
            }
          }
        },
        fill: {
          opacity: 1,
          colors: ["rgba(53, 118, 253)", "rgba(53, 118, 253, 0.75)"]
        },

        legend: {
          position: "top",
          horizontalAlign: "left",
          offsetX: 40
        }
      };
    },
    generateAverageTradeAmount() {
      var self = this;
      var data = this.$store.state.globalTradeOverviewDetails
        .average_trade_monthly;
      var avgTradeAmt = [];
      var months = [];
      for (var key in data) {
        months.push(key.toString().substring(0,3));
        avgTradeAmt.push(data[key]);
      }
      this.averageTradeAmount.title = "Average Trade Amount";
      this.averageTradeAmount.series = [
        {
          name: "Average Trade Amount",
          data: avgTradeAmt
        }
      ];
      this.averageTradeAmount.chartOptions = {
        chart: {
          stacked: false,
          toolbar: {
            show: false
          },
          offsetY: 20,
          offsetX: -4
        },
        grid: {
          xaxis: {
            lines: {
              show: false
            }
          },
          yaxis: {
            lines: {
              show: false
            }
          }
        },
        colors: ["rgba(53, 118, 253)", "rgba(53, 118, 253, 0.75)"],
        plotOptions: {
          bar: {
            horizontal: false
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          show: false,
          width: 1,
          colors: ["#fff"]
        },
        xaxis: {
          categories: months,
          labels: {
            show: true,
            offsetY: 0,
            formatter: function(val) {
              return val;
            }
          },
          axisTicks: {
            show: false
          },
          crosshairs: {
            show: false
          }
        },
        yaxis: {
          tickAmount: 1,
          labels: {
            show: true,
            offsetX: -10,
            formatter: function(val) {
              return self.formattedLabel(val);
            }
          }
        },
        tooltip: {
          shared: true,
          intersect: false,
          y: {
            show: true,
            formatter: function(
              value
            ) {
                if (Number.isFinite(value)) {
                  if (!Number.isInteger(value)) {
                    value = value.toFixed(2);
                  }
                  return self.$store.state.primaryCurrency.symbol + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                }
                else
                  return self.$store.state.primaryCurrency.symbol + 0;
              }
            }
        },
        fill: {
          opacity: 1,
          colors: ["rgba(53, 118, 253)", "rgba(53, 118, 253, 0.75)"]
        },

        legend: {
          position: "top",
          horizontalAlign: "left",
          offsetX: 40
        }
      };
    }
  }
};
</script>

<style scoped lang="scss">
  svg.feather.feather-maximize-2 {
    width: 20px;
    height: 20px;
  }
  #bannerInfo {
    margin: 0px 15px 0px;
    padding: 5px 0px;
    font-size: 15px;
    text-align: center;
    background-color: rgba(88, 170, 72, 0.4);
  }
  .theme-dark {
    #bannerInfo {
      margin: 0px 15px 0px;
      padding: 5px 0px;
      font-size: 15px;
      text-align: center;
      background-color: rgba(88, 170, 72, 0.8);
      a {
        color: #ffffff;
      }
    }
  }
  .expandable-view {
    display: flex;
    .top-right {
      align-items: flex-start !important;
      position: relative !important;
      bottom: 43px;
      right: 28px;
      left: 7px;
    }
  }
  .hide {
    display: none;
  }
  .show {
    display: inline;
  }
  #dashboard-trades {
    position: relative;
    top: 10px;
  }
</style>
<style lang="scss">
</style>
