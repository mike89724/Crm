<!-- =========================================================================================
    File Name: StatisticsCard.vue
    Description: Statistics card component
    ----------------------------------------------------------------------------------------
    Item Name: Vuesax Admin - VueJS Dashboard Admin Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <vx-card class="overflow-hidden">
    <div slot="no-body">
      <vs-row vs-type="flex" vs-justify="space-between">
        <vs-col class="mt-5" vs-align="center" vs-w="10">
          <div v-html="getCustomFrame('text-label-long')" :class="{'hide': !transition}"></div>
          <div v-html="getCustomFrame('text-label')" :class="{'hide': !transition}"></div>
          <h5 @click="openNewRoute()" :class="{'hide': transition, 'push-down': (name == 'user_signups' || name == 'meta_transactions'), 'cursor-pointer': !(name == 'user_signups' || name == 'meta_transactions')}" class="pl-2" style="text-align: left;">{{statisticTitle}}</h5>
          <h3
            @click="openNewRoute()"
            v-if="showCurrencySymbol == false"
            :class="{'hide': transition, 'push-down': (name == 'user_signups' || name == 'meta_transactions'), 'cursor-pointer': !(name == 'user_signups' || name == 'meta_transactions')}"
            class="mb-1 p-2 font-bold"
          >{{ numberWithCommas(statistic) }}</h3>
          <h3 @click="openNewRoute()" :class="{'hide': transition, 'push-down': (name == 'user_signups' || name == 'meta_transactions'), 'cursor-pointer': !(name == 'user_signups' || name == 'meta_transactions')}" v-else class="mb-1 p-2 font-bold">{{currencySymbol}}{{ numberWithCommas(statistic) }}</h3>
        </vs-col>
        <vs-col style="display: flex; justify-content: flex-end; align-items: flex-start;" vs-w="1" class="expand-icon-wrapper">
          <feather-icon
            style="height: 15px; width: 15px;"
            @click="openNewRoute()"
            :icon="icon"
            class="mt-5"
            :class="[`text-muted`, {'': !iconRight, 'cursor-pointer': !(name == 'user_signups' || name == 'meta_transactions')}]"
            :style="{margin: `10px 0 10px 0`}"
          ></feather-icon>
        </vs-col>
      </vs-row>
      <vs-row vs-justify="space-between" vs-align="center">
        <vs-col vs-w="12">
          <span :class="{'hide': !transition}" v-html="getFrame()"></span>
          <span :class="{'hide': transition}">
            <vue-apex-charts
              v-if="showGraph"
              :height="updatedHeight"
              :type="updatedType"
              width="100%"
              :options="updatedOptions"
              :series="updatedSeries"
            ></vue-apex-charts>
          </span>
        </vs-col>
        <vs-col vs-12>
          <div style="min-height: 10px"></div>
        </vs-col>
      </vs-row>
    </div>
  </vx-card>
</template>

<script>
import VueApexCharts from "vue-apexcharts";
import { getFrame } from "@/utils/util.js";

export default {
  data() {
    return {
      smallCards: ["loan", "trade", "reserve", "interest"],
      showGraph: true
    };
  },
  props: {
    icon: {
      type: String,
      required: true
    },
    transition: {
      type: Boolean,
    },
    transitionSize: {
      type: String,
      default: "small"
    },
    statistic: {
    },
    statisticTitle: {
      type: String
    },
    chartOptionsData: {
      required: true
    },
    chartSeriesData: {
      required: true
    },
    color: {
      type: String,
      default: "primary"
    },
    chartType: {
      type: String,
      default: "line-chart"
    },
    type: {
      type: String,
      default: "line"
    },
    iconRight: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: "#"
    },
    showCurrencySymbol: {
      type: Boolean
    }
  },
  watch: {
    themePrimaryColor() {
      this.$refs.apexChart.updateOptions({
        theme: { monochrome: { color: this.getHex() } }
      });
    },
    updatedSeries() {
      this.showGraph = false;
      this.$nextTick(
        () => {
          this.showGraph = true;
        }
      );
    },
    updatedOptions() {
      this.showGraph = false;
      this.$nextTick(
        () => {
          this.showGraph = true;
        }
      );
    }
  },
  computed: {
    updatedHeight() {
      if (this.name == "user_signups" || this.name == "meta_transactions") {
        return "250";
      } else {
        return "135";
      }
    },
    currencySymbol() {
      return this.$store.state.primaryCurrency.symbol;
    },
    themePrimaryColor() {
      return this.$store.state.themePrimaryColor;
    },
    updatedWidth() {
      if (this.transitionSize == 'wide-short')
        return "170%";
      else
        return "100%";
    },
    updatedType() {
      if (this.name == "reserve_utilization") {
        return "bar";
      }
      return (this.type)?this.type:"area";
    },
    updatedSeries() {
      return this.chartSeriesData;
    },
    updatedOptions() {
      return this.chartOptionsData;
    }
  },
  methods: {
    getFrame() {
      let isDark = (this.$store.state.theme == 'dark');
      if (this.transitionSize) {
        return getFrame(this.transitionSize, isDark);
      }
      if (
        this.name == "loan" ||
        this.name == "trade" ||
        this.name == "reserve" ||
        this.name == "interest"
      ) {
        return getFrame("small", isDark);
      } else {
        return getFrame("wide-short", isDark);
      }
    },
    getCustomFrame(size) {
      let isDark = (this.$store.state.theme == 'dark');
      return getFrame(size, isDark);
    },
    openNewRoute() {
      if (this.name != 'user_signups' && this.name != 'meta_transactions'&& this.name != 'swap' && this.name != 'swaptx') {
        this.$router.push({ path: "/graph/" + this.name });
        this.$ga.event({
          eventCategory: 'Overview',
          eventAction: 'Clicked',
          eventLabel: this.name
        });
      }
    },
    getHex() {
      let rgb = window
        .getComputedStyle(document.documentElement)
        .getPropertyValue(`--vs-${this.color}`);
      rgb = rgb.split(",");
      return (
        "#" +
        (
          (1 << 24) +
          (Number(rgb[0]) << 16) +
          (Number(rgb[1]) << 8) +
          Number(rgb[2])
        )
          .toString(16)
          .slice(1)
      );
    },
    changeTheme() {
      if (this.type == "area") {
        this.chartOptionsData["theme"] = {
          monochrome: {
            enabled: true,
            color: this.getHex(this.color),
            shadeTo: "light",
            shadeIntensity: 0.65
          }
        };
      }
    },
    numberWithCommas(x) {
      if (this.name == "user_signups") {
        if (!x) {
          return 0;
        } else {
          return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
      }
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
      return formattedText;
    }
  },
  components: {
    VueApexCharts
  },
  created() {
    this.changeTheme();
  }
};
</script>
<style scoped>
.cursor-pointer {
  cursor: pointer;
}
.icon-wrapper {
  cursor: pointer !important;
  /* position: relative;
    left: 3px;
    bottom: 5px; */
  width: 15px;
  height: 15px;
}
svg.feather.feather-maximize-2 {
  width: 15px !important;
  height: 15px !important;
}
.hide {
  display: none;
}
.show {
  display: flex !important;
  justify-content: space-between !important;
}
.expand-icon-wrapper {
  padding-right: 15px;
  padding-left: 0px;
}
.push-down {
  position: relative;
  top: 5px;
}
</style>