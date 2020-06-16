<!-- =========================================================================================
  File Name: DashboardAnalytics.vue
  Description: Dashboard Analytics
  ----------------------------------------------------------------------------------------
  Item Name: Vuesax Admin - VueJS Dashboard Admin Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <div id="dashboard-analytics">
    <vs-row vs-type="flex" vs-justify="space-evenly" vs-align="center">
      <vs-col class="mb-5" vs-sm="12" vs-lg="3" vs-md="6">
        <overview-card
          icon="ArrowUpRightIcon"
          :iconRight="true"
          :statistic="Math.round(globalOverviewData.total_loans_given)"
          statisticTitle="Loans taken"
          :chartOptionsData="updatedLoansGeneratedOptions"
          :chartSeriesData="updatedLoansGeneratedSeries"
          type="area"
          name="loan"
          transitionSize="small"
          :showCurrencySymbol="true"
          :transition="transition"
        ></overview-card>
      </vs-col>
      <vs-col class="mb-5" vs-sm="12" vs-lg="3" vs-md="6">
        <overview-card
          icon="ArrowUpRightIcon"
          :iconRight="true"
          :statistic="Math.round(globalOverviewData.total_reserves_locked)"
          statisticTitle="Reserves created"
          :chartOptionsData="updatedReservesGeneratedOptions"
          :chartSeriesData="updatedReservesGeneratedSeries"
          type="area"
          name="reserve"
          transitionSize="small"
          :showCurrencySymbol="true"
          :transition="transition"
        ></overview-card>
      </vs-col>
      <vs-col class="mb-5" vs-sm="12" vs-lg="3" vs-md="6">
        <overview-card
          icon="ArrowUpRightIcon"
          :iconRight="true"
          :statistic="Math.round(globalOverviewData.total_trades_amount)"
          statisticTitle="Trades created"
          :chartOptionsData="updatedTradesLockedOptions"
          :chartSeriesData="updatedTradesLockedSeries"
          type="area"
          name="trade"
          transitionSize="small"
          :showCurrencySymbol="true"
          :transition="transition"
        ></overview-card>
      </vs-col>
      <vs-col class="mb-5" vs-sm="12" vs-lg="3" vs-md="6">
        <overview-card
          icon="ArrowUpRightIcon"
          :iconRight="true"
          :statistic="Math.round(globalOverviewData.total_interest_generated)"
          statisticTitle="Interest generated"
          :chartOptionsData="updatedPremiumGeneratedOptions"
          :chartSeriesData="updatedPremiumGeneratedSeries"
          type="area"
          name="interest"
          transitionSize="small"
          :showCurrencySymbol="true"
          :transition="transition"
        ></overview-card>
      </vs-col>
    </vs-row>
    <vs-row>
      <vs-col class="mb-5" vs-lg="6" vs-md="6" vs-sm="12">
        <overview-card
          icon="undefined"
          :statistic="Math.round(globalOverviewData.total_user_signup_count)"
          statisticTitle="User Signups"
          :chartOptionsData="updatedUserSignupsOptions"
          :chartSeriesData="updatedUserSignupsSeries"
          type="area"
          name="user_signups"
          transitionSize="home-page-row-1"
          :showCurrencySymbol="false"
          :transition="transition"
        ></overview-card>
      </vs-col>
      <vs-col class="mb-5" vs-lg="6" vs-md="6" vs-sm="12">
        <overview-card
          icon="undefined"
          :statistic="Math.round(globalOverviewData.total_meta_txs_count)"
          statisticTitle="Meta Transactions"
          :chartOptionsData="updatedMetaTransactionsOptions"
          :chartSeriesData="updatedMetaTransactionsSeries"
          type="bar"
          name="meta_transactions"
          transitionSize="home-page-row-1"
          :showCurrencySymbol="false"
          :transition="transition"
        ></overview-card>
      </vs-col>
    </vs-row>
    <vs-row>
      <!-- CARD 9: DISPATCHED ORDERS -->
      <vs-col vs-w="12">
        <recent-transactions :showFilters="false" :showPagination="false" :showIcon="true"></recent-transactions>
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
import RecentTransactions from "./ui-elements/table/RecentTransactions.vue";

export default {
  data() {
    return {
      transition: true,
      analyticsData: analyticsData,
      apexChatData: apexChatData,
      detailsTrade: true,
      detailsLoan: false,
      detailsReserve: false,
      globalOverviewData: {
        total_loans_given: 0,
        total_meta_txs: 0,
        total_user_signup: 0,
        total_reserves_locked: 0,
        total_trades_amount: 0,
        total_interest_generated: 0
      },
      premiumGeneratedOptions: {
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
        theme: {
          monochrome: {
            color: "#3576fd",
            enabled: true,
            shadeIntensity: 0.65,
            shadeTo: "light"
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
          show: false,
          padding: {
            left: 0,
            right: 0
          }
        }
      },
      premiumGeneratedSeries : [
        {
          name: "",
          data: []
        }
      ],
      loansGeneratedOptions: {
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
      loansGeneratedSeries: [
        {
          name: "",
          data: []
        }
      ],
      reservesGeneratedOptions: {
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
      reservesGeneratedSeries: [
        {
          name: "",
          data: []
        }
      ],
      tradesLockedOptions: {
        chart: {
          animations: {
            enabled: false
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
        yaxis: {
          labels: {
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
      tradesLockedSeries: [
        {
          name: "",
          data: []
        }
      ],
      userSignupsOptions: {
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
      userSignupsSeries: [
        {
          name: "",
          data: []
        }
      ],
      metaTransactionsOptions: {
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
      metaTransactionsSeries: [
        {
          name: "",
          data: []
        }
      ],

      tabModel: "place-order-tab-1",
      tabTitles: ["Trade", "Loan", "Reserve"],
      themeColorsNew: ["#7367F0", "#28C76F", "#EA5455", "#FF9F43", "#1E1E1E"],
      themeColors: [
        "#7367F0",
        "#28C76F",
        "#EA5455",
        "#FF9F43",
        "#003f5c",
        "#a05195",
        "#d45087",
        "#f95d6a",
        "#ff7c43",
        "#ffa600",
        "#665191"
      ]
    };
  },
  components: {
    VueApexCharts,
    OverviewCard,
    ChangeTimeDurationDropdown,
    RecentTransactions
  },
  async mounted() {
    if (this.$store.state.theme == "dark") {
      this.$vs.loading({
        color: "#fff",
        container: "#dashboard-analytics",
        type: "sound"
      });
    } else {
      this.$vs.loading({
        container: "#dashboard-analytics",
        type: "sound"
      });
    }
    this.changeToMil(apexChatData.lineAreaChartSpline.series);
    await this.getGlobalOverviewData();
    this.transition = false;
    this.$forceUpdate();
    this.$vs.loading.close("#dashboard-analytics > .con-vs-loading");
  },
  watch: {
    "$store.state.primaryCurrency": async function() {
      if (this.$store.state.theme == "dark") {
        this.$vs.loading({
          color: "#fff",
          container: "#dashboard-analytics",
          type: "sound"
        });
      } else {
        this.$vs.loading({
          container: "#dashboard-analytics",
          type: "sound"
        });
      }
      await this.getGlobalOverviewData();
      this.$forceUpdate();
      this.$vs.loading.close("#dashboard-analytics > .con-vs-loading");
    }
  },
  methods: {
    formattedLabel(val) {
      var sign = val < 0 ? -1 : 1;
      var absVal = Math.abs(val);
      if (absVal >= 1000000000) {
        return (sign * parseInt(absVal)) / 1000000000 + "B";
      } else if (absVal >= 1000000) {
        return (sign * parseInt(absVal)) / 1000000 + "M";
      } else if (absVal >= 1000) {
        return (sign * parseInt(absVal)) / 1000 + "K";
      } else {
        if (this.graphDataKey == "value") {
          if (absVal < 10) {
            if (Number.isInteger(absVal)) {
              return sign * absVal;
            } else return (sign * absVal).toFixed(2);
          } else return sign * absVal;
        } else {
          return sign * absVal;
        }
      }
    },
    adjustSpacingOfSearchBar() {
      var wrapperDivs = document.querySelectorAll('.vx-navbar-wrapper');
      var length = wrapperDivs.length;
      var styleProp = "top: -10px !important";
      for (var i = 0; i < length; i++) {
        wrapperDivs[i].setAttribute("style", styleProp);
      }
    },
    updateTabs(detailsTrade, detailsLoan, detailsReserve) {
      this.detailsTrade = detailsTrade;
      this.detailsLoan = detailsLoan;
      this.detailsReserve = detailsReserve;
    },
    generateMetaTransactionsChart() {
      if (!this.globalOverviewData) {
        this.globalOverviewData = this.$store.state.globalOverviewDetails;
      }
      var self = this;
      var metaTransactionsCountArray = [];
      var dateArray = [];
      var i = 0;
      for (var x in this.globalOverviewData.total_meta_txs) {
        metaTransactionsCountArray[i] = parseInt(
          this.globalOverviewData.total_meta_txs[x]
        );
        dateArray[i] = x;
        i++;
      }
      this.$set(this.metaTransactionsSeries, 0, {
        name: "Meta Transactions",
        data: metaTransactionsCountArray
      });
      this.metaTransactionsOptions = {
        chart: {
          offsetY: 25,
          height: '250',
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
          categories: dateArray,
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
                return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
              }
              else
                return 0;
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
    generateUserSignupChart() {
      if (!this.globalOverviewData) {
        this.globalOverviewData = this.$store.state.globalOverviewDetails;
      }
      var userCountArray = [];
      var dateArray = [];
      var i = 0;
      for (var x in this.globalOverviewData.total_user_signup) {
        userCountArray[i] = parseInt(
          this.globalOverviewData.total_user_signup[x]
        );
        dateArray[i] = x;
        i++;
      }
      // var self = this;
      this.$set(this.userSignupsSeries, 0, {
        name: "User signups",
        data: userCountArray
      });
      this.userSignupsOptions = {
        chart: {
          animations: {
            enabled: false
          },
          offsetY: 0,
          offsetX: 0,
          toolbar: {
            show: false,
            tools: {
              download: false
            }
          },
          height: '250',
          zoom: {
            enabled: false
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: "straight",
          width: 1.5,
          color: ["#3e64ff"]
        },
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 0.9,
            opacityFrom: 0.7,
            opacityTo: 0.5,
            stops: [0, 80, 100]
          }
        },
        grid: {
          show: true,
          row: {
            colors: ["transparent", "transparent"], // takes an array which will be repeated on columns
            opacity: 0.5
          },
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
        xaxis: {
          categories: dateArray,
          labels: {
            show: false
          },
          axisTicks: {
            show: false
          },
          axisBorder: {
            show: false
          },
          tooltip: {
            enabled: false
          }
        },
        yaxis: {
          tickAmount: 2,
          min: 0,
          floating: false,
          labels: {
            show: true,
            offsetX: -15
          }
        },
        tooltip: {
          x: { show: true },
          y: {
            show: true,
            formatter: function(value) {
              if (Number.isFinite(value)) {
                return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
              }
            }
          }
        }
      };
    },
    async getGlobalOverviewData() {
      await this.$store.dispatch(
        "fetchOverview",
        this.$store.state.primaryCurrency.short_name
      );
      await this.$store.dispatch("fetchTokenList");
      this.globalOverviewData = this.$store.state.globalOverviewDetails;
      this.loansAndReservesChartSeries = this.globalOverviewData.reserve_utilization;
      await this.getApexChartData();
    },
    async getApexChartData() {
      this.generateUserSignupChart();
      this.generateMetaTransactionsChart();
      var overviewData = this.$store.state.globalOverviewDetails;

      // Premium Generated
      var premiumGenerated = [];
      var premiumDateSplits = [];
      var k = 0;
      for (let key in overviewData.interest_generated) {
        if (overviewData.interest_generated[key]["ALL"]) {
          premiumGenerated[k] = Number.parseFloat(
            overviewData.interest_generated[key]["ALL"]["value"]
          ).toFixed(2);
        } else {
          premiumGenerated[k] = 0;
        }
        premiumDateSplits[k++] = key;
      }

      this.generatePremiumChart(premiumGenerated, premiumDateSplits);

      //Loans Generated

      var loanDateSplit = [];
      var loanGenerated = [];
      var l = 0;
      for (let key in overviewData.loan_generated) {
        if (overviewData.loan_generated[key]["ALL"]) {
          loanGenerated[l] = Number.parseFloat(
            overviewData.loan_generated[key]["ALL"]["value"]
          ).toFixed(2);
        } else {
          loanGenerated[l] = 0;
        }
        loanDateSplit[l++] = key;
      }

      this.generateLoanChart(loanGenerated, loanDateSplit);

      //Reserves Locked

      var reserveDateSplit = [];
      var reserveLocked = [];
      var m = 0;
      for (let key in overviewData.reserve_locked) {
        if (overviewData.reserve_locked[key]["ALL"]) {
          reserveLocked[m] = Number.parseFloat(
            overviewData.reserve_locked[key]["ALL"]["value"]
          ).toFixed(2);
        } else {
          reserveLocked[m] = 0;
        }
        reserveDateSplit[m++] = key;
      }

      this.generateReserveChart(reserveLocked, reserveDateSplit);

      //Trades Created

      var tradeDateSplit = [];
      var tradeValue = [];
      var n = 0;
      for (let key in overviewData.trade_generated) {
        if (overviewData.trade_generated[key]["ALL"]) {
          tradeValue[n] = Number.parseFloat(
            overviewData.trade_generated[key]["ALL"]["value"]
          ).toFixed(2);
        } else {
          tradeValue[n] = 0;
        }
        tradeDateSplit[n++] = key;
      }

      this.generateTradeLockedChart(tradeValue, tradeDateSplit);
    },
    generateTradeLockedChart(tradeValue, tradeDateSplit) {
      var self = this;
      this.$set(this.tradesLockedSeries, 0, {
        name: "Trades Locked",
        data: tradeValue
      });
      this.tradesLockedOptions = {
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
          offsetY: 0
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
          categories: tradeDateSplit,
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
            formatter: function(value) {
              if (Number.isFinite(value)) {
                return (
                  self.$store.state.primaryCurrency.symbol +
                  value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                );
              }
            }
          }
        }
      };
    },
    generateReserveChart(reserveLocked, reserveDateSplit) {
      var self = this;
      this.$set(this.reservesGeneratedSeries, 0, {
        name: "Reserve",
        data: reserveLocked
      });
      this.reservesGeneratedOptions = {
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
          offsetY: 0
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
            opacityTo: 0.7,
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
          categories: reserveDateSplit,
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
            formatter: function(value) {
              if (Number.isFinite(value)) {
                return (
                  self.$store.state.primaryCurrency.symbol +
                  value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                );
              }
            }
          }
        }
      }
    },
    generateLoanChart(loanGenerated, loanDateSplit) {
      var self = this;
      this.$set(this.loansGeneratedSeries, 0,
        {
          name: "Loan",
          data: loanGenerated
        }
      );
      this.loansGeneratedOptions = {
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
          offsetY: 0,
          zoom: {
            enabled: false
          }
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
          categories: loanDateSplit,
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
            formatter: function(value) {
              if (Number.isFinite(value)) {
                return (
                  self.$store.state.primaryCurrency.symbol +
                  value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                );
              }
            }
          }
        }
      };
    },
    generatePremiumChart(premiumGenerated, premiumDateSplits) {
      var self = this;
      this.$set(this.premiumGeneratedSeries, 0, {
        name: "Interest",
        data: premiumGenerated
      });
      this.premiumGeneratedOptions = {
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
          offsetY: 0
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
            opacityFrom: 0.7,
            opacityTo: 0.5,
            stops: [0, 80, 100]
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
          categories: premiumDateSplits,
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
            formatter: function(value) {
              if (Number.isFinite(value)) {
                return (
                  self.$store.state.primaryCurrency.symbol +
                  value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                );
              }
            }
          }
        }
      };
    },
    onTabChanged(tabId) {
      if (tabId === "place-order-tab-1") {
        this.detailsTrade = true;
        this.detailsLoan = false;
        this.detailsReserve = false;
      } else if (tabId === "place-order-tab-2") {
        this.detailsTrade = false;
        this.detailsLoan = true;
        this.detailsReserve = false;
      } else {
        this.detailsTrade = false;
        this.detailsLoan = false;
        this.detailsReserve = true;
      }
    },
    changeToMil(loanReserveValues) {
      this.loanValues = loanReserveValues[0].data;
      this.reserveValues = loanReserveValues[1].data;

      this.loanValues = this.testMillion(this.loanValues);
      this.reserveValues = this.testMillion(this.reserveValues);

      apexChatData.lineAreaChartSpline.series[0].data = this.loanValues;
      apexChatData.lineAreaChartSpline.series[1].data = this.reserveValues;
    },
    testMillion(labelValue) {
      var res = [];
      for (var i = 0; i < labelValue.length; i++) {
        var curr = labelValue[i];
        // Nine Zeroes for Billions
        res[i] =
          Math.abs(Number(curr)) >= 1.0e9
            ? Math.abs(Number(curr)) / 1.0e9 + "B"
            : // Six Zeroes for Millions
            Math.abs(Number(curr)) >= 1.0e6
            ? Math.abs(Number(curr)) / 1.0e6 + "M"
            : // Three Zeroes for Thousands
            Math.abs(Number(curr)) >= 1.0e3
            ? Math.abs(Number(curr)) / 1.0e3 + "K"
            : Math.abs(Number(curr));
      }
      return res;
    }
  },
  computed: {
    updatedLoansGeneratedOptions() {
      return this.loansGeneratedOptions;
    },
    updatedLoansGeneratedSeries() {
      return this.loansGeneratedSeries;
    },
    updatedReservesGeneratedOptions() {
      return this.reservesGeneratedOptions;
    },
    updatedReservesGeneratedSeries() {
      return this.reservesGeneratedSeries;
    },
    updatedTradesLockedOptions() {
      return this.tradesLockedOptions;
    },
    updatedTradesLockedSeries() {
      return this.tradesLockedSeries;
    },
    updatedPremiumGeneratedOptions() {
      return this.premiumGeneratedOptions;
    },
    updatedPremiumGeneratedSeries() {
      return this.premiumGeneratedSeries;
    },
    updatedUserSignupsOptions() {
      return this.userSignupsOptions;
    },
    updatedUserSignupsSeries() {
      return this.userSignupsSeries;
    },
    updatedMetaTransactionsOptions() {
      return this.metaTransactionsOptions;
    },
    updatedMetaTransactionsSeries() {
      return this.metaTransactionsSeries;
    }
  }
};
</script>

<style scoped lang="scss">
#dashboard-analytics {
  position: relative;
  top: 10px !important;
}
</style>
