<!-- =========================================================================================
  File Name: DashboardAnalytics.vue
  Description: Dashboard Analytics
  ----------------------------------------------------------------------------------------
  Item Name: Vuesax Admin - VueJS Dashboard Admin Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <div id="dashboard-loans">
      <vs-row vs-type="flex" vs-justify="space-between">
        <vs-col class="mb-5" vs-lg="6" vs-md="6" vs-sm="12">
          <overview-card
            :iconRight="true"
            icon="ArrowUpRightIcon"
            :statistic="loanValueStatistic"
            statisticTitle="Loan Value"
            :chartOptionsData="loanValueOptions"
            :chartSeriesData="loanValueSeries"
            type="area"
            :showCurrencySymbol="true"
            name="loan"
            :transition="transition"
            transitionSize="loan-page-row-1"
          ></overview-card>
        </vs-col>
        <vs-col class="mb-5" vs-lg="6" vs-md="6" vs-sm="12">
          <overview-card
            :iconRight="true"
            icon="ArrowUpRightIcon"
            :statistic="loanCountStatistic"
            statisticTitle="Loan Count"
            :chartOptionsData="loanCountOptions"
            :chartSeriesData="loanCountSeries"
            type="area"
            :showCurrencySymbol="false"
            name="loan_count"
            :transition="transition"
            transitionSize="loan-page-row-1"
          ></overview-card>
        </vs-col>
      </vs-row>

      <vs-row vs-type="flex" vs-justify="space-between" vs-align="center">
        <vs-col class="mb-5" vs-lg="4" vs-md="6" vs-sm="12">
          <vx-card style="height: 217px;">
            <vs-row :class="{'mt-2': !transition}" vs-type="flex" vs-align="center" vs-justify="space-around">
              <vs-col vs-w="11">
                <div :class="{'hide': !transition}" v-html="getFrame('text-label-long')"></div>
                <h5 :class="{'hide': transition}">{{availableAmountsPerToken.title}}</h5>
              </vs-col>
              <vs-col vs-w="1"></vs-col>
            </vs-row>
            <vs-row vs-type="flex" vs-justify="space-between">
              <vs-col vs-w="12">
                <span class="space-top" :class="{'hide': !transition}" v-html="getFrame('loan-page-row-2')"></span>
                <span :class="{'hide': transition}">
                  <vue-apex-charts
                    type="bar"
                    height="180"
                    :options="availableAmountsPerToken.chartOptions"
                    :series="availableAmountsPerToken.series"
                  ></vue-apex-charts>
                </span>
              </vs-col>
            </vs-row>
          </vx-card>
        </vs-col>
        <vs-col class="mb-5" vs-lg="4" vs-sm="12">
          <vx-card style="height: 217px;">
            <vs-row :class="{'mt-2': !transition}" vs-type="flex" vs-justify="space-between">
              <vs-col vs-w="11">
                <div :class="{'hide': !transition}" v-html="getFrame('text-label-long')"></div>
                <h5 :class="{'hide': transition}">{{averageMonthlyLoanAmount.title}}</h5>
              </vs-col>
              <vs-col vs-w="1"></vs-col>
            </vs-row>
            <vs-row vs-type="flex" vs-justify="space-between">
              <vs-col vs-w="12">
                <div class v-if="transition" v-html="getFrame('loan-page-row-2')"></div>
                <span :class="{'hide': transition}">
                  <vue-apex-charts
                    type="bar"
                    height="180"
                    :options="averageMonthlyLoanAmount.chartOptions"
                    :series="averageMonthlyLoanAmount.series"
                  ></vue-apex-charts>
                </span>
              </vs-col>
            </vs-row>
          </vx-card>
        </vs-col>
        <vs-col class="mb-5" vs-lg="4" vs-sm="12">
          <vx-card style="height: 217px;">
            <vs-row :class="{'mt-2': !transition}" vs-type="flex" vs-justify="space-between">
              <vs-col vs-w="11">
                <div :class="{'hide': !transition}" v-html="getFrame('text-label-long')"></div>
                <h5 :class="{'hide': transition}">{{averageInitialCollateralizationRatio.title}}</h5>
              </vs-col>
              <vs-col vs-w="1"></vs-col>
            </vs-row>
            <vs-row vs-type="flex" vs-w="12">
              <vs-col vs-w="12">
                <span :class="{'hide': !transition}" v-html="getFrame('loan-page-row-2')"></span>
                <span :class="{'hide': transition}">
                  <vue-apex-charts
                    type="bar"
                    height="180"
                    :options="averageInitialCollateralizationRatio.chartOptions"
                    :series="averageInitialCollateralizationRatio.series"
                  ></vue-apex-charts>
                </span>
              </vs-col>
            </vs-row>
          </vx-card>
        </vs-col>
      </vs-row>

      <vs-row class="top-20" vs-type="flex" vs-justify="space-between">
        <!-- CARD 9: DISPATCHED ORDERS -->
        <vs-col vs-w="12">
          <TableLoanDetailsFull :showFilters="false" :showPagination="false"></TableLoanDetailsFull>
        </vs-col>
      </vs-row>
  </div>
</template>

<script>
import VueApexCharts from "vue-apexcharts";
import { getFrame } from "@/utils/util.js";
import OverviewCard from "@/components/statistics-cards/OverviewCard.vue";
import analyticsData from "./ui-elements/card/analyticsData.js";
import ChangeTimeDurationDropdown from "@/components/ChangeTimeDurationDropdown.vue";
import apexChatData from "@/views/charts-and-maps/charts/apex-charts/apexChartData.js";
import TableLoanDetailsFull from "./ui-elements/table/TableLoanDetailsFull.vue";
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
      globalLoanData: "",
      loanValueStatistic: "0",
      loanValueOptions: {
        chart: {
          animations: {
            enabled: true
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
          },
          tooltip: {
            enabled: false
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
      loanValueSeries: [
        {
          name: "",
          data: []
        }
      ],
      loanCountStatistic: "0",
      loanCountOptions: {
        chart: {
          animations: {
            enabled: true
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
      loanCountSeries: [
        {
          name: "",
          data: []
        }
      ],
      availableAmountsPerToken: {
        title: "",
        statistic: "0",
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
      averageMonthlyLoanAmount: {
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
      averageInitialCollateralizationRatio: {
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
    TableLoanDetailsFull,
    OverviewCard
  },
  created() {},
  async mounted() {
    if (this.$store.state.theme == "dark") {
      this.$vs.loading({
        color: "#fff",
        container: "#dashboard-loans",
        type: "sound"
      });
    } else {
      this.$vs.loading({
        container: "#dashboard-loans",
        type: "sound"
      });
    }
    await this.getLoanPageDetails();
    this.transition = false;
    this.$vs.loading.close('#dashboard-loans > .con-vs-loading');
    await this.generateLoanValueChart();
    await this.generateLoanCountChart();
    await this.generateAvailableAmountsPerTokenGraph();
    await this.generateAverageLoanAmountMonthly();
    await this.generateAverageInitialCollateralizationRatio();
  },
  watch: {
    "$store.state.primaryCurrency": async function() {
      if (this.$store.state.theme == "dark") {
        this.$vs.loading({
          color: "#fff",
          container: "#dashboard-loans",
          type: "sound"
        });
      } else {
        this.$vs.loading({
          container: "#dashboard-loans",
          type: "sound"
        });
      }
      await this.getLoanPageDetails();
      await this.generateLoanValueChart();
      await this.generateLoanCountChart();
      await this.generateAvailableAmountsPerTokenGraph();
      await this.generateAverageLoanAmountMonthly();
      await this.generateAverageInitialCollateralizationRatio();
      this.$forceUpdate();
      this.$vs.loading.close('#dashboard-loans > .con-vs-loading');
    }
  },
  methods: {
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
        if (!Number.isInteger(val)) {
          return (sign * absVal).toFixed(1);
        } else {
          return (sign * absVal);
        }
      }
    },
    getTokenImageUrl(tokenName) {
      return this.$store.getters.getTokenImgUrl(tokenName);
    },
    getFrame(size) {
      let isDark = this.$store.state.theme == 'dark';
      return getFrame(size, isDark);
    },
    async generateLoanValueChart() {
      var self = this;
      var data = this.$store.state.globalLoanOverviewDetails.loan_generated;
      var loanValueArray = [];
      var dateArray = [];
      for (var key in data) {
        loanValueArray.push(data[key]["ALL"]["value"]);
        dateArray.push(key);
      }
      this.loanValueSeries = [
        {
          name: "Loan Value",
          data: loanValueArray
        }
      ];
      this.loanValueStatistic = this.$store.state.globalLoanOverviewDetails.total_loans_given;
      this.loanValueOptions = {
        grid: {
          show: false,
          padding: {
            left: 0,
            right: 0
          }
        },
        chart: {
          animations: {
            enabled: true
          },
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
          categories: dateArray,
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
          fixed: {
            enabled: true,
            position: 'topRight',
            offsetX: 0,
            offsetY: 0,
          },
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
    async generateLoanCountChart() {
      var data = this.$store.state.globalLoanOverviewDetails.loan_generated;
      var loanCountArray = [];
      var dateArray = [];
      for (var key in data) {
        loanCountArray.push(data[key]["ALL"]["count"]);
        dateArray.push(key);
      }
      this.loanCountSeries = [
        {
          name: "Loan Count",
          data: loanCountArray
        }
      ];
      this.loanCountStatistic = this.$store.state.globalLoanOverviewDetails.total_loans_count;
      this.loanCountOptions = {
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
          offsetY: -10,
          animations: {
            enabled: true
          },
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
          categories: dateArray,
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
              return (
                value?parseInt(value):0
              );
            }
          }
        }
      };
    },
    async generateAvailableAmountsPerTokenGraph() {
      var self = this;
      var data = this.$store.state.globalLoanOverviewDetails.token_available;
      var tokenArray = [];
      var value = [];

      for (var key in data) {
        tokenArray.push(key);
        value.push(data[key]);
      }
      this.availableAmountsPerToken.title = "Amount available";
      this.availableAmountsPerToken.series = [
        {
          name: "Available amount",
          data: value
        }
      ];
      this.availableAmountsPerToken.chartOptions = {
        chart: {
          animations: {
              enabled: false
          },
          offsetY: -3,
          offsetX: -20,
          stacked: false,
          toolbar: {
            show: false
          }
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
          categories: tokenArray,
          axisTicks: {
            show: false
          },
          labels: {
            show: true,
            formatter: function(val) {
              return val;
            }
          },
          tooltip: {
            enabled: false
          },
          crosshairs: {
            show: false
          }
        },
        yaxis: {
          tickAmount: 2,
          labels: {
            show: true,
            formatter: function(value) {
              return self.formattedLabel(value);
            }
          }
        },
        tooltip: {
          shared: true,
          intersect: false,
          fixed: {
            enabled: true,
            position: 'topRight',
            offsetX: 0,
            offsetY: 0,
          },
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
          opacity: 1
        },

        legend: {
          position: "top",
          horizontalAlign: "left",
          offsetX: 40
        }
      };
    },
    async generateAverageLoanAmountMonthly() {
      var self = this;
      var monthlyAvgArray = [];
      var monthsArray = [];
      var data = this.$store.state.globalLoanOverviewDetails
        .average_loan_monthly;

      for (var key in data) {
        monthsArray.push(key);
        monthlyAvgArray.push(data[key]);
      }
      this.averageMonthlyLoanAmount.title = "Average Loan Amount";
      this.averageMonthlyLoanAmount.series = [
        {
          name: "Avg loan amount",
          data: monthlyAvgArray
        }
      ];
      this.averageMonthlyLoanAmount.chartOptions = {
        chart: {
          animations: {
              enabled: false
          },
          offsetX: -20,
          stacked: false,
          toolbar: {
            show: false
          }
        },
        colors: ["rgba(53, 118, 253)", "rgba(53, 118, 253, 0.75)"],
        plotOptions: {
          bar: {
            horizontal: false
          }
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
        dataLabels: {
          enabled: false
        },
        stroke: {
          show: false,
          width: 1,
          colors: ["#fff"]
        },
        xaxis: {
          categories: monthsArray,
          labels: {
            show: true,
            formatter: function(val) {
              return val.slice(0, 3);
            }
          },
          axisBorder: {
            show: false
          },
          axisTicks: {
            show: false
          },
          tooltip: {
            enabled: false
          },
          crosshairs: {
            show: false
          }
        },
        yaxis: {
          show: true,
          tickAmount: 3,
          labels: {
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
          opacity: 1
        },

        legend: {
          position: "top",
          horizontalAlign: "left",
          offsetX: 40
        }
      };
    },
    async generateAverageInitialCollateralizationRatio() {
      var data = [];
      var ratios = [];
      var months = [];

      data = this.$store.state.globalLoanOverviewDetails
        .average_initial_collateralization_ratio;
      for (var key in data) {
        months.push(key.slice(0, 3));
        ratios.push(data[key]);
      }
      ratios = ratios.map(currVal => {
        if (!currVal) {
          return 0;
        } else {
          return currVal;
        }
      });
      this.averageInitialCollateralizationRatio.title =
        "Average Initial Collateralization";
      this.averageInitialCollateralizationRatio.series = [
        {
          name: "Average Initial Collateralization Ratio",
          data: ratios
        }
      ];
      this.averageInitialCollateralizationRatio.chartOptions = {
        chart: {
          animations: {
            enabled: false
          },
          offsetX: -20,
          stacked: false,
          toolbar: {
            show: false
          }
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
          show: true,
          categories: months,
          labels: {
            show: true,
            formatter: function(val) {
              return val;
            }
          },
          axisBorder: {
            show: false
          },
          axisTicks: {
            show: false
          },
          tooltip: {
            enabled: false
          },
          crosshairs: {
            show: false
          }
        },
        yaxis: {
          show: true,
          labels: {
            formatter: function(val) {
              return val.toFixed(1);
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
              return value.toFixed(2);
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
    async getLoanPageDetails() {
      await this.$store.dispatch(
        "fetchLoanOverview",
        this.$store.state.primaryCurrency.short_name
      );
    }
  }
};
</script>

<style lang="scss">
  .hide {
    display: none;
  }
  .show {
    display: inline;
  }
  .space-top {
    position: relative;
    top: 0px;
  }
  .top-20 {
    position: relative;
    bottom: 20px;
  }
</style>
<style scoped lang="scss">
  #dashboard-loans {
    position: relative;
    top: 10px !important;
  }
</style>
