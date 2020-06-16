<!-- =========================================================================================
  File Name: DashboardAnalytics.vue
  Description: Dashboard Analytics
  ----------------------------------------------------------------------------------------
  Item Name: Vuesax Admin - VueJS Dashboard Admin Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <div id="dashboard-reserves">
    <!-- GENERAL RESERVE INFO -->
    <vs-row vs-type="flex" vs-justify="space-between">
      <vs-col class="mb-5" vs-sm="12" vs-md="6" vs-lg="6" vs-xl="6">
        <overview-card
          :iconRight="true"
          icon="ArrowUpRightIcon"
          :statistic="totalReserveValueStatistic"
          :showCurrencySymbol="true"
          statisticTitle="Total Reserve Value"
          :chartOptionsData="totalReserveValueOptions"
          :chartSeriesData="totalReserveValueSeries"
          type="area"
          name="reserve"
          :transition="transition"
          transitionSize="reserve-page-row-1"
        ></overview-card>
      </vs-col>

      <vs-col class="mb-5" vs-sm="12" vs-md="6" vs-lg="6" vs-xl="6">
        <overview-card
          :iconRight="true"
          icon="ArrowUpRightIcon"
          :statistic="totalReserveCountStatistic"
          statisticTitle="Total Reserve Count"
          :chartOptionsData="totalReserveCountOptions"
          :chartSeriesData="totalReserveCountSeries"
          type="area"
          name="reserves_count"
          :transition="transition"
          transitionSize="reserve-page-row-1"
        ></overview-card>
      </vs-col>
    </vs-row>

    <vs-row>
      <vs-col class="mt-4 mb-4" vs-sm="12" vs-md="6" vs-lg="6">
        <vx-card>
          <vs-row vs-type="flex" vs-justify="space-between">
            <vs-col vs-lg="11" vs-sm="10">
              <div :class="{'hide': !transition}" class="mt-5" v-html="getFrame('text-label-long')"></div>
              <h5 style="cursor: pointer;" @click="openNewRoute('reserve_utilization')" :class="{'hide': transition}" class="mt-5 mb-5">Reserve Utilization</h5>
              <h3 style="height: 25px;"></h3>
            </vs-col>
            <vs-col style="display: flex; align-items: flex-start;" vs-lg="1" vs-sm="2">
              <feather-icon
                @click="openNewRoute('reserve_utilization')"
                class="reserve-feather-icon"
                icon="ArrowUpRightIcon"
              ></feather-icon>
            </vs-col>
          </vs-row>
          <vs-row>
            <vs-col class="p-6 pb-0" vs-w="12">
              <span v-if="transition" v-html="getFrame('large')"></span>
              <span :class="{'hide': transition}">
                <vue-apex-charts
                  type="bar"
                  height="300"
                  width="100%"
                  :options="reserveUtilization.options"
                  :series="reserveUtilization.series"
                ></vue-apex-charts>
              </span>
            </vs-col>
          </vs-row>
        </vx-card>
      </vs-col>
      <vs-col class="mt-4" vs-sm="12" vs-md="6" vs-lg="6">
        <vx-card>
          <vs-row vs-type="flex" vs-justify="space-between">
            <vs-col vs-lg="11" vs-sm="10">
              <div :class="{'hide': !transition}" class="mt-5" v-html="getFrame('text-label-long')"></div>
              <h5 style="cursor: pointer;" @click="openNewRoute('premium')" :class="{'hide': transition}" class="mt-5 mb-5">Premium Earned</h5>
              <div :class="{'hide': !transition}" v-html="getFrame('text-label')"></div>
              <h3 :class="{'hide': transition}">{{numberWithCommas(totalPremiumGenerated, $store.state.primaryCurrency.symbol)}}</h3>
            </vs-col>
            <vs-col style="display: flex; align-items: flex-start;" vs-lg="1" vs-sm="2">
              <feather-icon @click="openNewRoute('premium')" class="reserve-feather-icon" icon="ArrowUpRightIcon"></feather-icon>
            </vs-col>
          </vs-row>
          <vs-row>
            <vs-col class="p-6 pb-0" vs-w="12">
              <span v-if="transition" v-html="getFrame('large')"></span>
              <span :class="{'hide': transition}">
                <vue-apex-charts
                  type="bar"
                  height="300"
                  width="100%"
                  :options="monthlyPremiumGenerated.options"
                  :series="monthlyPremiumGenerated.series"
                ></vue-apex-charts>
              </span>
            </vs-col>
          </vs-row>
        </vx-card>
      </vs-col>
    </vs-row>
    <!-- RESERVE DETAILS -->
    <vs-row>
      <vs-col>
        <TableReserveDetailsFull :showPagination="false" :showFilters="false"></TableReserveDetailsFull>
      </vs-col>
    </vs-row>
  </div>
</template>

<script>
import VueApexCharts from "vue-apexcharts";
import {getFrame} from "@/utils/util.js";
import OverviewCard from "@/components/statistics-cards/OverviewCard.vue";
import analyticsData from "./ui-elements/card/analyticsData.js";
import ChangeTimeDurationDropdown from "@/components/ChangeTimeDurationDropdown.vue";
import TableReserveDetailsFull from "./ui-elements/table/TableReserveDetailsFull.vue";
import ChartjsBarChart from "./charts-and-maps/charts/chartjs/ChartjsBarChart.vue";
import ChartjsHorizontalBarChart from "./charts-and-maps/charts/chartjs/ChartjsHorizontalBarChart.vue";
export default {
  data() {
    return {
      analyticsData: analyticsData,
      transition: true,
      totalReserveValueSeries: [{
        name: "",
        data: []
      }],
      totalReserveValueOptions: {
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
      totalReserveValueStatistic: "0",

      totalReserveCountSeries: [
        {
          name: "",
          data: []
        }
      ],
      totalReserveCountOptions: {
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
      totalReserveCountStatistic : "0",
      reserveUtilization: {
        series: [{
          name: "",
          data: []
        }],
        options: {
          chart: {
            animations: {
              enabled: false
            }
          },
          yaxis: {
            labels: {
              show: false
            },
            min: 0
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
      monthlyPremiumGenerated: {
        series: [{
          name: "",
          data: []
        }],
        options: {
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
      globalReserveData: [],
      totalPremiumGenerated : "0"
    };
  },
  components: {
    VueApexCharts,
    ChangeTimeDurationDropdown,
    TableReserveDetailsFull,
    ChartjsBarChart,
    ChartjsHorizontalBarChart,
    OverviewCard
  },
  async mounted() {
    if (this.$store.state.theme == "dark") {
      this.$vs.loading({
        color: "#fff",
        container: "#dashboard-reserves",
        type: "sound"

      });
    } else {
      this.$vs.loading({
        container: "#dashboard-reserves",
        type: "sound"
      });
    }
    await this.getGlobalData();
    this.$vs.loading.close("#dashboard-reserves > .con-vs-loading");
  },
  watch: {
    "$store.state.primaryCurrency": async function() {
      if (this.$store.state.theme == "dark") {
        this.$vs.loading({
          color: "#fff",
          container: "#dashboard-reserves",
          type: "sound"
        });
      } else {
        this.$vs.loading({
          container: "#dashboard-reserves",
          type: "sound"
        });
      }
      await this.getGlobalData();
      this.$vs.loading.close("#dashboard-reserves > .con-vs-loading");
      this.$forceUpdate();
    }
  },
  methods: {
    numberWithCommas(x, currencySymbol) {
      var formattedText;
      if (Number.isFinite(x)) {
        var sign = (x < 0)? -1:1;
        x = Math.abs(x);
        if (x > 1000000000) {
          x = x/1000000000;
          formattedText = (Number.isInteger(x))?(sign*x + "B"):(sign*x.toFixed(2) + "B");
        } else if (x > 1000000) {
          x = x/1000000;
          formattedText = (Number.isInteger(x))?(sign*x + "M"):(sign*x.toFixed(2) + "M");
        } else if (x > 1000) {
          x = x/1000;
          formattedText = (Number.isInteger(x))?(sign*x + "K"):((sign*x).toFixed(2) + "K");
        } else {
          formattedText = (sign*x).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
      } else {
        formattedText = "0";
      }
      return currencySymbol + formattedText;
    },
    getFrame(size) {
      let isDark = this.$store.state.theme == 'dark';
      return getFrame(size, isDark);
    },
    openNewRoute(name) {
      this.$ga.event({
        eventCategory: 'Reserves Overview',
        eventAction: 'Clicked',
        eventLabel: name
      });
      this.$router.push({ path: "/graph/" + name });
    },
    async getGlobalData() {
      await this.$store.dispatch("fetchReserve", this.$store.state.primaryCurrency.short_name);
      this.globalReserveData = this.$store.state.globalReserveDetails;
      this.totalPremiumGenerated = this.globalReserveData.total_premium_generated;
      console.log(this.globalReserveData, "global Reserve");
      this.getApexChartData();
    },
    generatePremiumEarnedChart() {
      var self = this;
      var data = this.$store.state.globalReserveDetails.premium_generated;
      var i = 0;
      var X = [];
      var Y = [];
      for (var key in data) {
        X[i] = key;
        Y[i] = data[key]["value"];
        i++;
      }
      this.monthlyPremiumGenerated.series = [
        {
          name: "Monthly Premium",
          data: Y
        }
      ];
      this.monthlyPremiumGenerated.options = {
        chart: {
          stacked: true,
          toolbar: {
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
          }
        },
        dataLabels: {
          enabled: false
        },
        colors: ["rgba(53, 118, 253)"],
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
          axisTicks: {
            show: false
          },
          labels: {
            show: true,
            formatter: function(val) {
              return val.slice(0, 3);
            }
          },
          crosshairs: {
            show: false
          }
        },
        yaxis: {
          labels: {
            offsetX: -10,
            formatter: function(val) {
              if (val >= 1000000000) {
                return parseFloat(val) / 1000000000 + "B";
              } else if (val >= 1000000) {
                return parseFloat(val) / 1000000 + "M";
              } else if (val >= 1000) {
                return parseFloat(val) / 1000 + "K";
              } else {
                return parseInt(val);
              }
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
              var currency = self.$store.state.primaryCurrency.symbol;
              return (
                currency + ((value)?
                (value.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")):0)
              );
            }
          }
        },
        fill: {
          opacity: 1
        },

        legend: {
          position: "top",
          horizontalAlign: "left",
          offsetX: 40
        }
      };
    },
    generateReserveUtilization() {
      var data = this.$store.state.globalReserveDetails.reserve_utilization;
      var amountBorrowed = [];
      var amountAvailableInReserve = [];
      var X = [];
      var self = this;
      var sortable = [];
      //index 0 will have the key
      //index 1 will have the reserve_amount
      //index 2 will have the loan_amount
      for (var key in data) {
        sortable.push([key, data[key]["reserve_amount"], data[key]["loan_amount"]]);
      }
      sortable.forEach(
        (element, index) => {
          X[index] = element[0];
          amountBorrowed[index] = element[2];
          amountAvailableInReserve[index] =
          element[1] - element[2];
        }
      );
      this.reserveUtilization.series = [
        {
          name: "Amount Lent",
          data: amountBorrowed
        },
        {
          name: "Amount Available",
          data: amountAvailableInReserve
        }
      ];

      this.reserveUtilization.options = {
        chart: {
          animations: {
            enabled: false
          },
          stacked: true,
          toolbar: {
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
            },
            min: 0
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
        title: {
          text: ""
        },
        xaxis: {
          categories: X,
          axisTicks: {
            show: false
          },
          labels: {
            show: true,
            formatter: function(val) {
              return val;
            }
          },
          title: {
            text: "Top 3 tokens"
          },
          crosshairs: {
            show: false
          }
        },
        yaxis: {
          labels: {
            offsetX: -10,
            formatter: function(val) {
              if (val >= 1000000000) {
                return parseInt(val / 1000000000) + "B";
              } else if (val >= 1000000) {
                return parseInt(val / 1000000) + "M";
              } else if (val >= 1000) {
                return parseInt(val / 1000) + "K";
              } else {
                return parseInt(val);
              }
            }
          },
          min: 0,
          tickAmount: 3
        },
        tooltip: {
          shared: true,
          intersect: false,
          custom: function({ series, dataPointIndex}) {
            var container = '<div class="light" style="left: 159.651px; top: 24px;">';
            var title =
              '<div class="apexcharts-tooltip-title" style="font-family: Helvetica, Arial, sans-serif; font-size: 12px;">';
            var seriesGroupActive =
              '<div class="tooltip-series-group active">';
            var tooltipMarker1 =
              '<span class="apexcharts-tooltip-marker" style="background-color: rgba(53, 118, 253, 0.75); display: inline-block;">';
            var tooltipMarker2 =
              '<span class="apexcharts-tooltip-marker" style="background-color: rgba(53, 118, 253); display: inline-block;">';
            var tooltipText =
              '<div class="apexcharts-tooltip-text" style="width: fit-content; font-family: Helvetica, Arial, sans-serif; font-size: 12px;">';
            var tooltipYGp = '<div class="apexcharts-tooltip-y-group" style="width: 100%; display: flex; justify-content: space-between">';
            var tooltipZGp = '<div class="apexcharts-tooltip-z-group" style="width: 100%; display: flex; justify-content: space-between">';
            var tooltipTextLabel =
              '<span class="apexcharts-tooltip-text-label">';
            var tooltipTextValue =
              '<span class="apexcharts-tooltip-text-value">';
            var endSpan = "</span>";
            var endDiv = "</div>";
            var amount_lent =
            series[0][dataPointIndex]
              ? series[0][dataPointIndex].toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : 0;
            var amount_available =
            series[1][dataPointIndex]
              ? series[1][dataPointIndex].toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : 0;
            var reserveUtilizationPercentage = ((100*series[0][dataPointIndex])/(series[0][dataPointIndex] + series[1][dataPointIndex])).toFixed(2);
            var htmlText =
            `
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
    },
    generateTotalReserveValueChart() {
      var data = this.$store.state.globalReserveDetails.reserve_locked;
      var self = this;
      var i = 0;
      var X = [];
      var Y = [];
      for (var key in data) {
        X[i] = key;
        Y[i] = data[key]["ALL"]["value"];
        i++;
      }
      this.totalReserveValueStatistic = this.$store.state.globalReserveDetails.total_reserves_locked;
      this.totalReserveValueSeries = [
        {
          name: "Reserve Value",
          data: Y
        }
      ];
      this.totalReserveValueOptions = {
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
          categories: X,
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
              return self.$store.state.primaryCurrency.symbol + (value
                ? (value.toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : 0);
            }
          }
        }
      };
    },
    generateTotalReserveCountChart() {
      var data = this.$store.state.globalReserveDetails.reserve_locked;
      var i = 0;
      var X = [];
      var Y = [];
      for (var key in data) {
        X[i] = key;
        Y[i] = data[key]["ALL"]["count"];
        i++;
      }

      this.totalReserveCountStatistic = this.$store.state.globalReserveDetails.total_reserves_count;
      this.totalReserveCountSeries = [
        {
          name: "Reserve Count",
          data: Y
        }
      ];
      this.totalReserveCountOptions = {
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
          categories: X,
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
              return (value
                ? (parseInt(value)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : 0);
            }
          }
        }
      };
    },
    async getApexChartData() {
      this.generateTotalReserveValueChart();
      this.generateTotalReserveCountChart();
      this.generateReserveUtilization();
      this.generatePremiumEarnedChart();
      this.transition = false;
    }
  }
};
</script>

<style lang="scss">
  .reserve-feather-icon {
    width: 15px;
    height: 15px;
    cursor: pointer;
    margin-top: 18px;
  }
  .hide {
    display: none;
  }
  .show {
    display: block;
    min-width: 466px !important;
  }
  .tooltip-container {
    border-radius: 5px;
    box-shadow: 2px 2px 6px -4px #999;
    cursor: default;
    font-size: 14px;
    opacity: 0;
    pointer-events: none;
    position: absolute;
    overflow: hidden;
    white-space: nowrap;
    z-index: 12;
    transition: 0.15s ease all;
  }
  .tooltip-title {
    background: #ECEFF1;
    border-bottom: 1px solid #ddd;
    padding: 6px;
    font-size: 15px;
    margin-bottom: 4px;
  }
  .tooltip-series-group.active:last-child {
    padding-bottom: 4px;
  }
  .tooltip-series-group {
    padding: 0 10px;
    display: none;
    text-align: left;
    justify-content: left;
    align-items: center;
    display: flex;
  }
  .tooltip-marker {
    width: 12px;
    height: 12px;
    position: relative;
    top: 0px;
    margin-right: 10px;
    border-radius: 50%;
    background-color: rgb(53, 118, 253);
  }
  .tooltip-y-group {
    padding: 6px 0 5px;
    display: flex;
    justify-content: space-between;
  }
  .tooltip-series-group {
    width: fit-content;
  }
</style>
<style scoped lang="scss">
  #dashboard-reserves {
    position: relative;
    top: 10px !important;
  }
</style>
