<!-- =========================================================================================
  File Name: DashboardAnalytics.vue
  Description: Dashboard Analytics
  ----------------------------------------------------------------------------------------
  Item Name: Vuesax Admin - VueJS Dashboard Admin Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <div id="dashboard-swaps">
    <vs-row>
        <vs-col class="mb-5" vs-lg="6" vs-sm="12">
        <overview-card
          :statistic="1002"
          statisticTitle="Referrals"
          :chartOptionsData="swapGeneratedValueOptions"
          :chartSeriesData="swapGeneratedValueSeries"
          name="swap"
          type="area"
          :showCurrencySymbol="false"
          :transition="transition"
          transitionSize="trade-page-row-1"
        ></overview-card>
      </vs-col>

      <vs-col class="mb-5" vs-lg="6" vs-sm="12">
        <vx-card>
          <span :class="{'hide': !transition}" class="mt-4" v-html="getFrame('text-label-long')"></span>
          <vs-row vs-type="flex" vs-justify="flex-start">
            <vs-col vs-w="10">
              <h5 :class="{'hide': transition}" class="mt-4">KYC Statistics</h5>
            </vs-col>
          </vs-row>
          <span v-if="transition" v-html="getFrame('trade-page-row-1')"></span>
          <span :class="{'hide': transition}">
            <vue-apex-charts
              class = "swap-chart"
              type="area"
              height="175"
              width="100%"
              :options="splitValueCountOptions"
              :series="splitValueCountSeries"
            ></vue-apex-charts>
          </span>
        </vx-card>
      </vs-col>
    </vs-row>

    <!-- Tabs of Trade,  Loan and Reserve Details-->
    <vs-row>
      <vs-col vs-w="12">
        <TableSwapDetailsFull :showPagination="false" :showFilters="false"></TableSwapDetailsFull>
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
import TableSwapDetailsFull from "./ui-elements/table/TableSwapDetailsFull.vue";
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
      swapGeneratedValueStatistic: "0",
      swapGeneratedValueOptions: {
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
      swapGeneratedValueSeries: [
        {
          name: "",
          data: []
        }
      ],
      splitValueCountOptions: {
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
      splitValueCountSeries: [
        {
          name: "",
          data: []
        }
      ],
      mostExchangedSourceCurrency: {
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
      mostExchangedDestinationCurrency: {
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
    TableSwapDetailsFull,
    OverviewCard
  },
  async mounted() {
    if (this.$store.state.theme == "dark") {
      this.$vs.loading({
        color: "#fff",
        container: "#dashboard-swaps",
        type: "sound"
      });
    } else {
      this.$vs.loading({
        container: "#dashboard-swaps",
        type: "sound"
      });
    }
    await this.getSwapsOverviewData();
    this.generateSwapValueAndSplitChart();
    this.generatemostExchangedSourceCurrency();
    this.generatemostExchangedDestinationCurrency();
    // setTimeout(
      // () => {
        this.$vs.loading.close('#dashboard-swaps > .con-vs-loading');
      // }
    // , 1000000);
    this.transition = false;
  },
  watch: {
    "$store.state.primaryCurrency": async function() {
      if (this.$store.state.theme == "dark") {
        this.$vs.loading({
          color: "#fff",
          container: "#dashboard-swaps",
          type: "sound"
        });
      } else {
        this.$vs.loading({
          container: "#dashboard-swaps",
          type: "sound"
        });
      }
      await this.getSwapsOverviewData();
      this.initializeValues();
      this.generateSwapValueAndSplitChart();
      this.generatemostExchangedSourceCurrency();
      this.generatemostExchangedDestinationCurrency();
      this.$forceUpdate();
      this.$vs.loading.close('#dashboard-swaps > .con-vs-loading');
    }
  },
  methods: {
    initializeValues() {
      this.swapGeneratedValue.series = [];
      this.splitValueCountSeries = [];
      this.mostExchangedSourceCurrency.series = [];
      this.mostExchangedDestinationCurrency.series = [];
    },
    formattedLabel(val) {
      let sign = (val < 0)? -1: 1;
      let absVal = Math.abs(val);
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
    async getSwapsOverviewData() {
      await this.$store.dispatch("fetchSwapsOverview", this.$store.state.primaryCurrency.short_name);
      // await this.$store.dispatch("fetchSwapsOverview");
    },
    generateSwapValueAndSplitChart() {
      let self = this;
      this.swapGeneratedValueStatistic = this.$store.state.globalSwapOverviewDetails.total_exchange_source_volume;
      let data = this.$store.state.globalSwapOverviewDetails.cumulative_exchange_volume;
      let exchangeSplit = this.$store.state.globalSwapOverviewDetails.exchange_split;
      let exchangeCurrencies= [];
      let firstDate = {};
      let allDates = {};
      allDates = Object.keys(exchangeSplit);
      firstDate = Object.keys(exchangeSplit)[0];
      let firstDateObject = exchangeSplit[firstDate];
      Object.keys(firstDateObject).forEach((currency) => {
        exchangeCurrencies.push(currency)
      })
      let currencyValues = [];
      exchangeCurrencies.forEach((currency) => {
        let currencyYaxis = {}
        currencyYaxis.name = currency
        currencyYaxis.data = [];
        Object.keys(exchangeSplit).forEach((date) => {
          let data = exchangeSplit[date];
          currencyYaxis.data.push(data[currency]['ALL']['value'])
        })
        currencyValues.push(currencyYaxis);
      })
      let value = [];
      let count = [];
      let dateTime = [];
      for (let key in data) {
        dateTime.push(key);
        let index = 0;
        for (let tkn in data[key]) {
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
        self.$set(self.swapGeneratedValueSeries, index, {
          name: "Swap Value",
          data: item
        });
      });
      this.splitValueCountSeries = currencyValues;
      this.splitValueCountSeries[0].name = "APPROVED";
      this.splitValueCountSeries[1].name = "PENDING";
      this.splitValueCountSeries[2].name = "DECLINED";
      this.splitValueCountSeries[3].name = "SUCCESS";

      this.swapGeneratedValueOptions = {
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
                return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
              }
              else
                return self.$store.state.primaryCurrency.symbol + 0;
            }
          }
        }
      };
      this.splitValueCountOptions = {
        grid: {
          show: true,
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
          gradient: {
            inverseColors: false,
            shade: "light",
            type: "vertical",
            opacityFrom: 0.85,
            opacityTo: 0.35
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
          categories: allDates,
          axisBorder: {
            show: true
          },
          tooltip: {
            enabled: false
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
    },
    generatemostExchangedSourceCurrency() {
      let self = this;
      let data = this.$store.state.globalSwapOverviewDetails
        .most_exchanged_source_currency;
      let currencies = [];
      let currencyValues = [];
      for (let key in data) {
        currencies.push(key)
        currencyValues.push(data[key]);
      }
      currencies = currencies.splice(0,5)
      currencyValues = currencyValues.splice(0,5)
      this.mostExchangedSourceCurrency.title = "Top 5 Source Currencies";
      this.mostExchangedSourceCurrency.series = [
        {
          name: "Amount",
          data: currencyValues
        }
      ];
      this.mostExchangedSourceCurrency.chartOptions = {
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
          categories: currencies,
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
    },
    generatemostExchangedDestinationCurrency() {
      let self = this;
      let data = this.$store.state.globalSwapOverviewDetails
        .most_exchanged_destination_currency;
      let currencies = [];
      let currencyValues = [];
      for (let key in data) {
        currencies.push(key)
        currencyValues.push(data[key]);
      }
      currencies = currencies.splice(0,5)
      currencyValues = currencyValues.splice(0,5)
      this.mostExchangedDestinationCurrency.title = "Top 5 Receive Currencies";
      this.mostExchangedDestinationCurrency.series = [
        {
          name: "Amount",
          data: currencyValues
        }
      ];
      this.mostExchangedDestinationCurrency.chartOptions = {
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
          categories: currencies,
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
  #dashboard-swaps {
    position: relative;
    top: 10px;
  }
</style>
<style>
#dashboard-swaps .apexcharts-legend {
  bottom: auto !important;
  left: auto !important;
}
@media screen and (max-width: 768px) {
  #dashboard-swaps .apexcharts-legend {
    bottom: auto !important;
    left: auto !important;
    top: 14px !important;
  }
}
</style>
