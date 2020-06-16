<template>
  <div id="dashboard-graph">
    <vx-card>
      <vs-row vs-align="center" vs-type="flex" vs-justify="flex-start" vs-w="12">
        <vs-col
          vs-lg="5"
          vs-md="12"
          vs-sm="12"
          style="display: flex-start; justify-content: flex-start;"
          :class="{'pl-0': updatedWidth < 768}"
        >
          <vs-breadcrumb :class="{'mb-3 mt-3': screenWidth > 768, 'ml-10': (!parentName && updatedWidth >= 768)}">
            <li v-if="parentName">
              <span class="home-route" @click="openNewRoute()">{{parentName}} </span>
              <span><vs-icon icon="chevron_right"></vs-icon>&nbsp;</span>
            </li>
            <li aria-current="page" class="active">
              <span class="current-route"> {{title}}</span>
            </li>
          </vs-breadcrumb>
        </vs-col>
        <vs-col style="padding: 0;" vs-lg="7" vs-md="12" vs-sm="12">
          <vs-row vs-align="center" vs-type="flex" vs-justify="flex-end" vs-w="12">
            <vs-col
              style="display: flex; justify-content: flex-end; padding: 0;"
              vs-lg="4"
              vs-md="4"
              vs-sm="12"
            >
              <date-range-picker
                class="date-range-picker-box mt-3"
                :class="{'theme-dark': $store.state.theme == 'dark'}"
                ref="picker"
                v-model="dateRange"
                :minDate="minDate"
                :maxDate="maxDate"
                :opens="opens"
              >
                <div slot="input" slot-scope="picker" style="min-width: 130px; align-text: center;">
                  {{ picker.startDate | date }} - {{ picker.endDate | date }}
                  <vs-icon class="currency-dropdown-caret" icon="expand_more"></vs-icon>
                </div>
              </date-range-picker>
            </vs-col>
            <vs-col
              style="display: flex; padding: 0px;"
              :style="updatedWidth < 768? 'justify-content: flex-start !important;': 'justify-content: flex-end;'"
              v-if="ifTokenMultiSelector()"
              class="mt-5"
              vs-type="flex"
              vs-justify="flex-end"
              vs-align="center"
              vs-lg="3"
              vs-md="3"
              vs-sm="5"
            >
              <vs-checkbox v-model="showTotal"><div>Show Total</div></vs-checkbox>
            </vs-col>
            <vs-col style="display: flex; justify-content: flex-end; padding: 0px;" vs-lg="5" vs-md="5" vs-sm="7">
              <vs-select
                :placeholder="placeholder"
                :width="(updatedWidth < 768)?'165px': '250px'"
                :multiple="ifTokenMultiSelector()"
                class="mt-3"
                autocomplete
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
      <vs-row vs-align="center" vs-type="flex" vs-justify="flex-start" vs-w="12">
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
      title: "",
      placeholder: "",
      screenWidth: 1100,
      graphName: "",
      isCustomFormatter: false,
      token: "ALL",
      seriesNames: [],
      seriesMultiDimensionalArray: [],
      seriesPercentageMultiDimensionalArray: [],
      series: [{
        name: "",
        data: []
      }],
      labels: [],
      type: "area",
      options: {},
      currency: "",
      tokens: [],
      showTotal: true,
      futureMonths: 0,
      pastMonths: 3,
      startDate: "2019-01-01",
      endDate: "2019-12-01",
      minDate: "02-01-2019",
      maxDate: Date(Date.now()).toString(),
      dateRange: {},
      opens: "left",
      tokensSelected: ["ALL"],
      APR: "",
      graphDataKey: "value"
    };
  },
  watch: {
    tokensSelected: async function(value) {
      if (value.length > 0) {
        this.showTotal = false;
      } else if (value.length == 0) {
        this.showTotal = true;
      }
      await this.getGraphDetails(this.$route.name);
    },
    dateRange: async function() {
      await this.getGraphDetails(this.$route.name);
    },
    showTotal: function(val) {
      if (val == true) {
        this.tokensSelected = [];
      } else {
        if (this.tokensSelected.length == 0) {
          this.tokensSelected = ["ETH"];
        }
      }
    },
    "$store.state.primaryCurrency": async function() {
      await this.getGraphDetails(this.$route.name);
      this.currency = this.$store.state.primaryCurrency.symbol;
      this.$forceUpdate();
    }
  },
  components: {
    VueApexCharts,
    DateRangePicker
  },
  async created() {
    this.setMaxDate();
    this.setBeginDate();
    this.setGraphCredentials();
    await this.getGraphDetails(this.$route.name);
    await this.getTokens();
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (from.path == HOME_URL) {
        vm.parentName = "Home";
      } else if (from.path == RESERVE_URL) {
        vm.parentName = "Reserve Overview"
      } else if (from.path == LOAN_URL) {
        vm.parentName = "Loan Overview";
      } else if (from.path == TRADE_URL) {
        vm.parentName = "Trade Overview";
      } else {
        vm.parentName = false;
      }
    });
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
    openNewRoute() {
      this.$router.go(-1);
    },
    toTitleCase(text) {
      var title = "";
      switch (text) {
        case "loan":
          title = "Loans Taken";
          break;
        case "reserve":
          title = "Reserves Created";
          break;
        case "trade":
          title = "Trades Created";
          break;
        case "interest":
          title = "Interest Generated";
          break;
        case "reserves_count":
          title = "Reserve Orders";
          break;
        case "reserves_active":
          title = "Active Reserves";
          break;
        case "reserve_utilization":
          title = "Reserve Utilization";
          break;
        case "premium":
          title = "Premium Earned";
          break;
        case "loan_count":
          title = "Loan Orders";
          break;
        case "trade_transactions":
          title = "Trade Orders";
          break;
      }
      return title;
    },
    formattedLabel(val) {
      var sign = val < 0 ? -1 : 1;
      var absVal = Math.abs(val);
      if (absVal >= 1000000000) {
        return (sign * parseInt(absVal / 1000000000)) + "B";
      } else if (absVal >= 1000000) {
        return (sign * parseInt(absVal / 1000000 ))+ "M";
      } else if (absVal >= 1000) {
        return (sign * parseInt(absVal / 1000)) + "K";
      } else {
        if (this.graphDataKey == "value") {
          if (!this.isCustomFormatter) {
            if (Number.isInteger(absVal)) {
              return sign * absVal;
            } else return (sign * parseInt(absVal));
          } else {
            if (absVal < 10)
              return (sign * absVal).toFixed(2);
            else {
              return (sign * parseInt(absVal))
            }
          }
        } else {
          return sign * parseInt(absVal);
        }
      }
    },
    formattedLabelFloat(val) {
      var sign = val < 0 ? -1 : 1;
      var absVal = Math.abs(val);
      if (absVal >= 1000000000) {
        return (sign * (absVal / 1000000000).toFixed(2)) + "B";
      } else if (absVal >= 1000000) {
        return (sign * (absVal / 1000000).toFixed(2))+ "M";
      } else if (absVal >= 1000) {
        return (sign * (absVal / 1000).toFixed(2)) + "K";
      } else {
        if (this.graphDataKey == "value") {
          if (!this.isCustomFormatter) {
            if (Number.isInteger(absVal)) {
              return sign * absVal;
            } else return (sign * (absVal).toFixed(2));
          } else {
            return (sign * (absVal).toFixed(2));
          }
        } else {
          return sign * parseInt(absVal);
        }
      }
    },
    getHyphenSeparatedDate(date) {
      return getHyphenSeparatedDate(date);
    },
    async getTokens() {
      await this.$store.dispatch("fetchTokenList");
      this.tokens = [];
      var tokensNames = this.$store.state.tokens;
      for (var i = 0; i < tokensNames.length; i++) {
        this.tokens[i] = {
          text: tokensNames[i].short_name,
          value: tokensNames[i].short_name
        };
      }
    },
    setGraphCredentials() {
      this.screenWidth = window.screen.width;
      this.graphName = this.$route.name;
      if (this.graphName == 'trade' || this.graphName == 'trade_transactions') {
        this.placeholder = "Select Position Currency";
      } else if (this.graphName == 'loan' || this.graphName == 'loan_count') {
        this.placeholder = "Select Loan Currency";
      } else {
        this.placeholder = "Tokens";
      }
      this.title = this.toTitleCase(this.graphName);
      if (this.graphName == "premium") {
        this.isCustomFormatter = true;
      }
      if (
        !(this.graphName == "reserves_count") &&
        !(this.graphName == "trade_transactions") &&
        !(this.graphName == "loan_count")
      ) {
        this.currency = this.$store.state.primaryCurrency.symbol;
        this.graphDataKey = "value";
      } else {
        this.currency = "";
        this.graphDataKey = "count";
      }
      this.tokensSelected = this.ifTokenMultiSelector() ? [] : ["ETH"];
    },
    getTagName(name) {
      if (name == "trade_transactions" || name == "trade") {
        return "trade";
      } else if (name == "reserve" || name == "reserves_count") {
        return "reserve:lock";
      } else if (name == "reserves_active") {
        return "reserve:active";
      } else if (name == "premium") {
        return "premium";
      } else if (name == "loan_count") {
        return "loan";
      } else if (name == "profits") {
        return "trade:profit";
      } else {
        return name;
      }
    },
    getDateString(dateTime) {
      var d = new Date(dateTime);
      return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
    },
    async getGraphDetails(graphName) {
      var self = this;
      var tokensToFetch = this.tokensSelected;
      if (Array.isArray(tokensToFetch) && tokensToFetch.length == 0) {
        tokensToFetch = ["ALL"];
      } else if (!Array.isArray(tokensToFetch)) {
        tokensToFetch = [tokensToFetch];
      }
      this.startDate = this.getHyphenSeparatedDate(this.dateRange.startDate);
      this.endDate = this.getHyphenSeparatedDate(this.dateRange.endDate);
      var data = await GraphService.getData(
        this.getTagName(graphName),
        this.$store.state.primaryCurrency.short_name,
        this.startDate,
        this.endDate,
        tokensToFetch
      );

      this.seriesMultiDimensionalArray = [];

      var labels = [];
      this.APR = (data.data.weighted_avg_apr)?data.data.weighted_avg_apr:0;
      data =
        this.graphName == "premium" && data.data.data
          ? data.data.data
          : data.data;

      Object.keys(data).forEach((key, index) => {
        labels[index] = key;
        var j = 0;
        for (var tkn in data[key]) {
          self.seriesNames[j] = tkn;
          if (self.seriesMultiDimensionalArray[j])
            self.seriesMultiDimensionalArray[j][index] =
              (data[key][tkn][this.graphDataKey]);
          else {
            self.seriesMultiDimensionalArray[j] = [];
            self.seriesMultiDimensionalArray[j][index] =
              (data[key][tkn][this.graphDataKey]);
          }
          if (self.seriesPercentageMultiDimensionalArray[j]) {
            self.$set(self.seriesPercentageMultiDimensionalArray[j], index, data[key][tkn]["count"]);
            self.averageAPROverDuration += parseFloat(self.seriesPercentageMultiDimensionalArray[j][index]);
          } else {
            self.seriesPercentageMultiDimensionalArray[j] = [];
            self.$set(self.seriesPercentageMultiDimensionalArray[j], index, data[key][tkn]["count"]);
            self.averageAPROverDuration += parseFloat(self.seriesPercentageMultiDimensionalArray[j][index]);
          }
          j++;
        }
        labels[index] = key;
      });
      this.labels = labels;
    },
    setMaxDate() {
      var temp = new Date(Date.now());
      this.maxDate = new Date(
        temp.setMonth(temp.getMonth() + this.futureMonths)
      ).toString();
    },
    setBeginDate() {
      //Sets the default dateRange to 3 months past to present
      this.dateRange.endDate = this.getHyphenSeparatedDate(Date.now());
      var temp = new Date(Date.now());
      temp = new Date(temp.setMonth(temp.getMonth() - this.pastMonths));
      this.dateRange.startDate = this.getHyphenSeparatedDate(temp);
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
      return true;
    }
  },
  computed: {
    chartOptionsUpdated() {
      var self = this;
      var updatedOptions;
      if (this.isCustomFormatter) {
        updatedOptions = {
          chart: {
            stacked: false,
            toolbar: {
              show: false
            },
            width: '100%',
            zoom: {
              enabled: false
            }
          },
          theme: {
            mode: "light",
            palette: "palette1",
            monochrome: {
              enabled: false,
              color: "#255aee",
              shadeTo: "light",
              shadeIntensity: 0.65
            }
          },
          legend: {
            show: true,
            position: "bottom",
            labels: {
              colors: ["#0000ff", "#347474"]
            },
            onItemClick: {
              toggleDataSeries: false
            }
          },
          plotOptions: {
            bar: {
              columnWidth: "20%"
            }
          },
          grid: {
            show: true,
            padding: {
              left: 0,
              right: 0
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
          markers: {
            size: 0,
            hover: {
              size: 5
            }
          },
          stroke: {
            curve: "smooth",
            width: 1.5,
            lineCap: "round"
          },
          colors: ["#008FFB", "#00E396", "#FEB019", "#FF4560", "#775DD0", "#FF9800", "#F9CE1D", "#4CAF50", "#03A9F4", "#3F51B5", "#33B2DF", "#546E7A", "#D4526E"],
          fill: {
            colors: ["#008FFB", "#00E396", "#FEB019", "#FF4560", "#775DD0", "#FF9800", "#F9CE1D", "#4CAF50", "#03A9F4", "#3F51B5", "#33B2DF", "#546E7A", "#D4526E"],
            opacity: [0.85, 0.25, 1],
            gradient: {
              inverseColors: false,
              shade: "light",
              type: "vertical",
              opacityFrom: 0.85,
              opacityTo: 0.55,
              stops: [0, 100, 100, 100]
            }
          },
          dataLabels: {
            enabled: false
          },
          xaxis: {
            labels: {
              offsetX: -10,
              style: {
                cssClass: "apexcharts-xaxis-label",
                fontSize: "12px"
              }
            },
            type: "datetime",
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
          yaxis: [
            {
              seriesName: self.toTitleCase(self.graphName),
              show: true,
              tickAmount: 3,
              labels: {
                show: true,
                align: "left",
                minWidth: 0,
                maxWidth: 160,
                style: {
                  fontSize: "12px",
                  fontFamily: "'Rubik', sans-serif",
                  cssClass: "apexcharts-yaxis-label",
                  color: "#626262"
                },
                offsetX: -10,
                offsetY: 0,
                rotate: 0,
                formatter: function(val) {
                  return self.formattedLabel(val);
                }
              },
              axisBorder: {
                show: false,
                color: "#1089ff"
              },
              axisTicks: {
                show: false
              },
              title: {
                text: "",
                rotate: 90,
                offsetX: 0,
                offsetY: 0,
                style: {
                  color: "#626262",
                  fontSize: "12px",
                  fontFamily: "Rubik",
                  cssClass: "apexcharts-yaxis-title"
                }
              }
            }
          ],
          labels: self.labels,
          tooltip: {
            shared: true,
            followCursor: false,
            intersect: false,
            x: {
              show: true,
              format: "dd/MM/yy",
              formatter: function(value) {
                var date = new Date(value);
                var flexbox = "<div style='display: flex;'>"
                var endFlexBox = "</div>";
                var div = "<div style='width: 75px; text-align: center;'>";
                var endDiv = "</div>";
                return (flexbox + div + date.toLocaleDateString() + endDiv + div + "Gains" + endDiv + div + "APR" + endDiv + endFlexBox)
              }
            },
            y: {
              show: true,
              formatter: function(value, {seriesIndex, dataPointIndex}) {
                if (Number.isFinite(value)) {
                  if (!Number.isInteger(value)) {
                    value = value.toFixed(2);
                  }
                  return (
                    "<div style='display: flex; justify-content: flex-start; width:max-content;'>" +
                      "<div class='light-border gains-label'>" +
                        self.currency +
                        value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
                      "</div>" +
                      "<div class='light-border apr-label'>" +
                        (self.seriesPercentageMultiDimensionalArray[seriesIndex][dataPointIndex]).toFixed(2)+"%"+
                      "</div>" +
                    "</div>"
                  );
                } else return self.currency + 0;
              }
            }
          }
        };
      } else {
        updatedOptions = {
          chart: {
            offsetY: 0,
            stacked: false,
            toolbar: {
              show: false
            },
            zoom: {
              enabled: false
            },
            height: '500',
            width: '100%',
          },
          legend: {
            show: true,
            position: "bottom",
            onItemClick: {
              toggleDataSeries: false
            }
          },
          plotOptions: {
            bar: {
              columnWidth: "20%"
            }
          },
          grid: {
            show: true,
            padding: {
              left: 0,
              right: 0
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
          markers: {
            size: 0,
            hover: {
              size: 5
            }
          },
          stroke: {
            curve: "smooth",
            width: 1.5
          },
          colors: ["#008FFB", "#00E396", "#FEB019", "#FF4560", "#775DD0", "#FF9800", "#F9CE1D", "#4CAF50", "#03A9F4", "#3F51B5", "#33B2DF", "#546E7A", "#D4526E"],
          fill: {
            colors: ["#008FFB", "#00E396", "#FEB019", "#FF4560", "#775DD0", "#FF9800", "#F9CE1D", "#4CAF50", "#03A9F4", "#3F51B5", "#33B2DF", "#546E7A", "#D4526E"],
            gradient: {
              inverseColors: false,
              shade: "light",
              type: "vertical",
              opacityFrom: 0.85,
              opacityTo: 0.55
            }
          },
          dataLabels: {
            enabled: false
          },
          xaxis: {
            labels: {
              style: {
                cssClass: "apexcharts-xaxis-label",
                fontSize: "12px"
              },
              offsetY: 0,
              offsetX: -10
            },
            type: "datetime",
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
          yaxis: [
            {
              seriesName: self.toTitleCase(self.graphName),
              show: true,
              tickAmount: 5,
              min: 0,
              labels: {
                show: true,
                align: "left",
                minWidth: 0,
                maxWidth: 160,
                style: {
                  fontSize: "12px",
                  fontFamily: "Rubik, sans-serif",
                  cssClass: "apexcharts-yaxis-label",
                  color: "#626262"
                },
                offsetX: -10,
                offsetY: 0,
                rotate: 0,
                min: 0,
                formatter: function(val) {
                  return self.formattedLabel(val);
                }
              },
              axisBorder: {
                show: false,
                color: "#1089ff"
              },
              axisTicks: {
                show: true
              },
              title: {
                text: "",
                rotate: 90,
                offsetX: 0,
                style: {
                  color: "#626262",
                  fontSize: "12px",
                  fontFamily: "Rubik",
                  cssClass: "apexcharts-yaxis-title"
                }
              }
            }
          ],
          labels: self.labels,

          tooltip: {
            shared: true,
            followCursor: false,
            intersect: false,
            x: {
              show: true,
              format: "dd/MM/yy"
            },
            y: {
              show: true,
              formatter: function(value) {
                if (Number.isFinite(value)) {
                  if (!Number.isInteger(value)) {
                    value = value.toFixed(2);
                  }
                  return (
                    self.currency +
                    value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  );
                } else return self.currency + 0;
              }
            }
          }
        };
      }
      return updatedOptions;
    },
    chartSeriesUpdated() {
      var self = this;
      self.series = [];
      this.seriesMultiDimensionalArray.forEach((item, index) => {
        item = item.map(entry => {
          if (entry == "") {
            return 0;
          } else {
            return entry;
          }
        });
        self.series.push({
          name: self.seriesNames[index] + "",
          data: item
        });
      });
      return self.series;
    },
    updatedWidth() {
      let width = screen.width;
      if (width < 768) {
        return parseInt(width * 0.9);
      } else {
        return parseInt(width * 0.75);
      }
    },
    totalVal() {
      var val = 0;
      val += this.chartSeriesUpdated.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.data.reduce((acc, curr) => {
          return acc + curr;
        });
      }, 0);

      return this.primaryCurrency.symbol + this.formattedLabelFloat(val);
    },
    primaryCurrency() {
      return this.$store.state.primaryCurrency;
    }
  },
  mounted() {
    this.adjustSpacingOfSearchBar();
    document.querySelectorAll('.input-select')[0].setAttribute("readonly", "true");
  }
};
</script>
<style scoped lang="scss">
  .statistic-style {
    font-weight: bold;
    font-size: 16px;
  }
  .pl-30 {
    padding-left: 30px;
  }
  .spaceTopSmall {
    margin-top: 0px;
  }
  @media only screen and (max-width: 768px) {
    .pl-30 {
      padding-left: 5px;
    }
    .spaceTopSmall {
      margin-top: 10px;
    }
  }
</style>
<style lang="scss">
.light-border {
  border: 1px solid rgba(0, 0, 0, 0);
  padding: 1%;;
  width: max-content;
}
.gains-label {
  margin-right: 2%;
  text-align: center;
  width: 75px;
}
.apr-label {
  margin-left: 2%;
  text-align: center;
  width: 75px;
}
.date-range-picker-box {
  width: 160px;
}
.cancelBtn {
  cursor: pointer;
}
.applyBtn {
  cursor: pointer;
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
    li:hover {
      background: #3576FD !important;
    }
  }
}
@media only screen and (max-width: 768px){
  .date-range-picker-box {
    width: 133px;
  }
}
.currency-dropdown-caret {
  position: relative;
  top: 3px;
}

.input-select {
  height: 33px;
  border-radius: 0;
}

.arrow_box {
  border: solid rgba(0, 0, 0, 0.15);
  padding: 5px;
  font-family: inherit;
  font-weight: 500px;
}

.apr-text {
  font-size: 16px;
  width: 200%;
  height: 100%;
  padding-top: 10px;
}
.apexcharts-tooltip.light {
  width: fit-content !important;
  height: fit-content !important;
}
.apexcharts-tooltip-z-group {
  .apexcharts-tooltip-text-value {
    position: relative;
    left: 25px !important;
  }
}
.apexcharts-tooltip-series-group {
  display: flex;
  justify-content: flex-start;
}
.apexcharts-tooltip-text-label {
  display: inline-block;
  min-width: 45px;
}
.home-route {
  cursor: pointer;
  font-size: 20px;
  font-family: "Rubik", sans-serif;
  color: #1F74FF;
}
.current-route {
  font-size: 20px;
  font-family: "Rubik", sans-serif;
}
.theme-dark > .form-control {
  background-color: #262c49 !important;
  color: #c2c6dc !important;
  border: 0;
}
.theme-dark
  :not(.in-range, .apexcharts-legend-marker) {
    background: rgba(16, 22, 58, 1) !important;
    color: #fff !important;
  
  th {
    background: rgba(16, 22, 58, 1) !important;
    color: #fff !important;
  }
}
#dashboard-graph {
  position: relative;
  top: 20px;
}
.vs-select--options ul {
  max-height: fit-content !important;
}

@media screen and (max-width: 768px){
  .daterangepicker.show-calendar .drp-buttons {
    display: flex;
  }
  .daterangepicker .drp-selected {
    text-align: left;
    font-size: 10px;
    display: inline;
  }
}
</style>
<style scoped lang="scss">
  #graph-full-view {
    width: 100%;
  }
</style>
<style>
@media screen and (max-width: 1350px) and (min-width: 900px){
  .daterangepicker .calendar-table td, .daterangepicker .calendar-table th {
    min-width: 24px;
    width: 100%;
    max-width: 26px;
  }
  .daterangepicker.show-ranges{
    min-width: 516px !important;
    max-width: 550px;
  }
}  
</style>