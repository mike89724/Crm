<template>
  <div ref="expandableGraph">
    <vue-apex-charts v-if="!transition" type="area" height="250" :series="updatedSeries" :options="updatedOptions"></vue-apex-charts>
    <vs-row v-if="orderType == 'trade'" style="color: rgba(128, 128, 128, 0.9); position: relative; bottom: 20px;" vs-justify="space-between" vs-align="center">
      <vs-col style="display: flex; justify-content: flex-start" vs-w="2" vs-sm="3" :style="(updatedWidth) < 768? 'padding-left: 0; padding-right: 0;':'padding-left: 30px;'">
        <span :class="{'hide': transition, 'pl-5': (updatedWidth < 768)}">
          {{new Date(graphStartDate).getDate()}} {{getMonthFromIndex(new Date(graphStartDate).getMonth())}}
        </span>
        <span v-html="getFrame('text-label-long')" :class="{'hide': !transition}">

        </span>
      </vs-col>
      <vs-col vs-w="2" :class="{'hide': updatedWidth < 768}">
        .............
      </vs-col>
      <vs-col style="display: flex; justify-content: center" vs-lg="4" vs-sm="6">
        {{orderData.position_currency.short_name}} vs {{orderData.market_currency.short_name}}
      </vs-col>
      <vs-col vs-w="2" :class="{'hide': updatedWidth < 768}">
        .............
      </vs-col>
      <vs-col style="display: flex; justify-content: flex-end" vs-w="2" vs-sm="3" :style="(updatedWidth) < 768? 'padding-left: 0; padding-right: 0;':''">
        <span v-html="getFrame('text-label-long')" :class="{'hide': !transition}">

        </span>
        <span :class="{'hide': transition}">
          {{new Date(graphEndDate).getDate()}} {{getMonthFromIndex(new Date(graphEndDate).getMonth())}}
        </span>
      </vs-col>
    </vs-row>
    <vs-row v-if="orderType == 'loan'" style="color: rgba(128, 128, 128, 0.9); position: relative; bottom: 20px;" vs-justify="space-between" vs-align="center">
      <vs-col style="display: flex; justify-content: center" vs-w="12">
        <span v-html="getFrame('text-label-long')" :class="{'hide': !transition}">
        </span>
        <span :class="{'hide': transition}">
          {{orderData.collateral_currency.short_name}} vs {{orderData.loan_currency.short_name}}
        </span>
      </vs-col>
    </vs-row>
  </div>
</template>
<script>
import VueApexCharts from "vue-apexcharts";
// import { mapState } from 'vuex';
import TradeDetailService from "@/services/TradeDetailService";
import LoanDetailService from "@/services/LoanDetailService";
import ReserveDetailService from "@/services/ReserveDetailService";
import {getInitialExitPriceForTrades, getMonthFromIndex, getFrame} from "@/utils/util.js";

export default {
  data() {
    return {
      transition: true,
      series: [
        {
          name: "Series 1",
          data: [[1,1], [2, 2], [3, 3], [4, 4]]
        }
      ],
      options: {
        legend: {
          show: false,
          offsetX: 330,
          offsetY: 220
        },
        stroke: {
          curve: "smooth",
          width: 2
        },
        chart: {
          animations: {
            enabled: false
          },
          toolbar: {
            show: false,
            tools: {
              zoom: false,
              zoomin: false,
              zoomout: false
            }
          }
        },
        dataLabels: {
          enabled: false
        },
        yaxis: {
          labels: {
            show: false
          },
          axisTicks: {
            show: false
          },
          axisBorder: {
            show: false
          }
        },
        xaxis: {
          type: "datetime",

          labels: {
            show: false
          },
          axisBorder: {
            show: false
          },
          axisTicks: {
            show: false
          },
          tooltip: {
            enabled: false
          }
        },
        labels: ["2019-03-26", "2019-03-28"],
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
        noData: {
          text: "Loading"
        }
      },
      startDate: "",
      endDate: "",
      graphStartDate: "",
      graphEndDate: ""
    };
  },
  props: {
    orderData: {
      type: Object
    },
    orderType: {
      type: String,
      default: "trade"
    },
    primaryCurrency: {
      type: Object
    },
    isDark: {
      type: Boolean,
      default: false
    }
  },
  components: {
    VueApexCharts
  },
  computed: {
    updatedSeries() {
      return this.series;
    },
    updatedOptions() {
      return this.options;
    },
    updatedWidth() {
      return parseInt(screen.width);
    },
    theme() {
      if(this.$store && this.$store.state && this.$store.state.theme) {
        return this.$state.store.theme
      }
    },
    updatedPrimaryCurrency() {
      if (this.$store) {
        return this.$store.state.primaryCurrency;
      } else {
        return this.primaryCurrency;
      }
    },
  },
  watch: {
    "$store.state.primaryCurrency": async function() {
      if (this.orderType == "reserve") {
        await this.getReserveOrderGraph();
      }
    },
  },
  async mounted() {
    var expandableRef = this.$refs.expandableGraph;
    this.$vs.loading(
      {
        container: expandableRef,
        scale: 0.45
      }
    );
    this.transition = true;
    if (this.orderType == "loan") {
      await this.getLoanOrderGraph();
    } else if (this.orderType == "reserve") {
      await this.getReserveOrderGraph();
    } else {
      await this.getTradeOrderGraph();
    }
    this.$vs.loading.close(expandableRef)
    this.transition = false;
  },
  methods: {
    openLoading(){
       if (this.theme == "dark") {
        this.$vs.loading({
          color: "#fff",
          type: "sound"
        });
      } else {
        this.$vs.loading({
          type: "sound"
        });
      }
    },
    getFrame(size) {
      return getFrame(size, this.isDark);
    },
    getMonthFromIndex(index) {
      return getMonthFromIndex(index);
    },
    async getLoanOrderGraph() {
      this.openLoading();
      var data = await LoanDetailService.getLoanOrderGraph(
        this.orderData.loan_currency.short_name,
        this.orderData.collateral_currency.short_name
      );
      this.$vs.loading.close()
      var compositeArray = [];
      var prices = data.data.data.prices;
      prices =
        prices[this.orderData.loan_currency.short_name][
          this.orderData.collateral_currency.short_name
        ];
      var self = this;
      self.series = [];
      Object.keys(prices).forEach((dailyPrice, index) => {
        var date = new Date();
        date = new Date(date.setDate(date.getDate() - prices.length + index));
        compositeArray.push([date.getTime(), prices[dailyPrice]]);
      });
      this.series = [
        {
          name:
            this.orderData.collateral_currency.short_name +
            "/" +
            this.orderData.loan_currency.short_name,
          data: compositeArray
        }
      ];
      this.options = {
        ...this.options,
        tooltip: {
          shared: false,
          intersect: false,
          x: {
            show: true,
            format: "dd/MM/yy HH:mm:ss"
          },
          y: {
            show: true,
            formatter: function(value) {
              if (Number.isFinite(value)) {
                return self.$options.filters.handleFloat(value, 4);
              } else {
                return 0;
              }
            }
          }
        }
      };
    },
    async getTradeOrderGraph() {
      var self = this;
      this.startDate = new Date(this.orderData.added_on);
      this.startDate = new Date(
        this.startDate.setDate(this.startDate.getDate() - 1)
      );
      if (this.orderData.ending_on != null) {
        this.endDate = new Date(this.orderData.ending_on);
        this.endDate = new Date(this.endDate.setDate(this.endDate.getDate() + 1));
      } else if (this.orderData.tenure != null) {
        this.endDate = new Date(this.orderData.added_on);
        var dateNum = parseInt(this.endDate.getDate());
        this.endDate = new Date(this.endDate.setDate(dateNum + this.orderData.tenure));

      }
      this.openLoading();
      var data = await TradeDetailService.getTradeOrderGraph(
        this.orderData.market_currency.short_name
          ? this.orderData.market_currency.short_name
          : "USDC",
        this.orderData.position_currency.short_name
          ? this.orderData.position_currency.short_name
          : "ETH",
        this.orderData.collateral_currency.short_name
          ? this.orderData.collateral_currency.short_name
          : "SNX",
        this.startDate.toJSON(),
        this.endDate.toJSON()
      );
      this.$vs.loading.close()
      var compositeArray = [];
      data = data.data.data;
      if (data && data.datetimes && data.datetimes.length > 0) {
        this.graphStartDate = data.datetimes[0]
        this.graphEndDate = data.datetimes[data.datetimes.length - 1];
      }
      let minValue = Number.POSITIVE_INFINITY;
      let maxValue = Number.NEGATIVE_INFINITY;
      var labels = [];
      data.entry_prices.forEach((item, index) => {
        var date = new Date(data.datetimes[index]);
        var price = item ? item : 0;
        labels.push(date);
        minValue = Math.min(minValue, parseFloat(price));
        maxValue = Math.max(maxValue, parseFloat(price));
        compositeArray.push({x : date.getTime(), y : price});
      });
      var exitPriceCompositeArray = this.getExitPrices(
        data.datetimes,
        data.collateral_prices,
        data.market_prices,
        data.position_prices
      );

      exitPriceCompositeArray.forEach(
        (item) => {
          minValue = Math.min(minValue, parseFloat(item.y));
          maxValue = Math.max(maxValue, parseFloat(item.y));
        }
      );
      this.options.labels = labels;
      if (this.orderData.position_type == "SHORT") {
        this.options.yaxis.min = (3*minValue - maxValue)/2;
        this.options.yaxis.max = 1.2*maxValue;
        this.options.grid.row.colors = (!this.isDark)?["#FF0000"]:['#fea5ad'];
        this.options.grid.row.opacity = (!this.isDark)?0.3:1;
        this.options = {
          ...this.options,
          fill: {
            type: "gradient",
            colors: ["#d6e5fa", "#FFFFFF"],
            gradient: {
              shadeIntensity: 0,
              opacityFrom: 1,
              opacityTo: 1
            }
          },
          colors: ["#3576fd", "#FF4560"],
          tooltip: {
            shared: false,
            intersect: false,
            x: {
              show: true,
              format: "dd/MM/yy HH:mm:ss"
            },
            y: {
              show: true,
              formatter: function(
                value
              ) {
                return self.$options.filters.handleFloat(value, 4);
              }
            }
          }
        };
        this.options = { ... this.options};
      }
      else {
        this.options.yaxis.min = (3*minValue - maxValue)/2;
        this.options.yaxis.max = maxValue;
        this.options = {
          ...this.options,
          fill: {
            type: "gradient",
            colors: ["#d6e5fa", "#FF0000"],
            gradient: {
              shadeIntensity: 0,
              opacityFrom: 0.7,
              opacityTo: 0.3
            }
          },
          colors: ["#3576fd", "#FF0000"],
          tooltip: {
            shared: false,
            intersect: false,
            x: {
              show: true,
              format: "dd/MM/yy HH:mm:ss"
            },
            y: {
              show: true,
              formatter: function(
                value
              ) {
                return self.$options.filters.handleFloat(value, 4);
              }
            }
          }
        };
      }
      this.series = [
        {
          name: "Entry Price",
          data: compositeArray
        }
      ];
      this.series.push({
        name: "Exit Price",
        data: exitPriceCompositeArray
      });
    },
    async getReserveOrderGraph() {
      this.openLoading()
      var data = await ReserveDetailService.getReserveOrderGraph(
        this.orderData.currency.short_name,
        this.updatedPrimaryCurrency.short_name
      );
      if (!data.data.data.prices) {
        return;
      }
      this.$vs.loading.close()
      var prices =
        data.data.data.prices[this.orderData.currency.short_name][this.updatedPrimaryCurrency.short_name];
      var self = this;
      self.series = [];
      var compositeArray = [];
      Object.keys(prices).forEach((dailyPrice, index) => {
        var date = new Date();
        date = new Date(date.setDate(date.getDate() - prices.length + index));
        compositeArray.push([date.getTime(), prices[dailyPrice]]);
      });
      this.series = [
        {
          name:
            this.orderData.currency.short_name,
          data: compositeArray
        }
      ];
      this.options = {
        ...this.options,
        tooltip: {
          shared: true,
          intersect: false,
          x: {
            show: true,
            format: "dd/MM/yy"
          },
          y: {
            show: true,
            formatter: function(value) {
              if (Number.isFinite(value)) {
                return self.primaryCurrency.symbol + self.$options.filters.handleFloat(value, 4);
              } else {
                return 0;
              }
            }
          }
        }
      };
    },
    getExitPrices(datetimes, collateralPrices, marketPrices, positionPrices) {
      var collateralAmount = this.orderData.collateral_amount;
      var loanAmount = this.orderData.loan_amount;
      var tradeAmount = this.orderData.trade_amount;
      var positionType = this.orderData.position_type
        ? this.orderData.position_type
        : "SHORT";
      var buffer = this.orderData.buffer;
      var initialLeverage = this.orderData.initial_leverage;
      var premium = this.orderData.premium;
      var stopLoss = this.orderData.stop_loss;
      var loanCollateralPrices = [];
      var tradeCollateralPrices = [];
      if (positionType == "LONG") {
        loanCollateralPrices = marketPrices;
        tradeCollateralPrices = positionPrices;
      } else {
        loanCollateralPrices = positionPrices;
        tradeCollateralPrices = marketPrices;
      }
      var exitPriceArray = [];
      collateralPrices.forEach((item, index) => {
        collateralPrices[index] = collateralPrices[index]
          ? collateralPrices[index]
          : 0;
        loanCollateralPrices[index] = loanCollateralPrices[index]
          ? loanCollateralPrices[index]
          : 0;
        tradeCollateralPrices[index] = tradeCollateralPrices[index]
          ? tradeCollateralPrices[index]
          : 0;
        var exitPrice = getInitialExitPriceForTrades(
          collateralAmount,
          loanAmount,
          tradeAmount,
          positionType,
          collateralPrices[index],
          loanCollateralPrices[index],
          tradeCollateralPrices[index],
          buffer,
          initialLeverage,
          stopLoss,
          premium
        );
        var date = new Date(datetimes[index]);
        exitPriceArray.push({x : date.getTime(), y: exitPrice ? exitPrice : 0});
      });
      return exitPriceArray;
    }
  }
};
</script>
<style scoped lang="scss">
</style>