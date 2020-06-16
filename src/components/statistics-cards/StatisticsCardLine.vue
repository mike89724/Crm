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
            <vs-col class="mt-5" vs-w="11">
              <h5 class="pl-2" style="text-align: left;">{{ statisticTitle }}</h5>
            </vs-col>
            <vs-col vs-w="1" class="expand-icon-wrapper">
              <vs-row vs-type="flex" vs-justify="center" vs-align="flex-start">
                <vs-col vs-w="4">
                  <feather-icon @click="openNewRoute" style="cursor: pointer; height: 15px; width: 15px;" :icon="icon" class="" :class="[`text-muted`, {'': !iconRight}]" :style="{margin: `10px 10px 0 0`}"></feather-icon>
                </vs-col>
              </vs-row>
            </vs-col>
          </vs-row>
          <vs-row vs-type="flex" vs-justify="flex-start">
            <vs-col vs-w="12">
              <h2 v-if="showCurrencySymbol == false" class="mb-1 p-2 font-bold">{{ numberWithCommas(statistic) }}</h2>
              <h2 v-else class="mb-1 p-2 font-bold">{{currencySymbol}}{{ numberWithCommas(statistic) }}</h2>
            </vs-col>
          </vs-row>
          <div class="line-area-chart" :id="chartData.id">
            <span class="p-5" v-if="transition" v-html="getFrame(transitionSize)">
            </span>
            <span :class="{'hide': transition, 'show': !transition}">
              <vue-apex-charts ref="apexChart" height="135" :type="type" width='100%' :options="chartData.chartOptions" :series="chartData.series"></vue-apex-charts>
            </span>
          </div>
        </div>
    </vx-card>
</template>

<script>
import VueApexCharts from 'vue-apexcharts'
import {getFrame} from "@/utils/util.js";
export default {
    data () {
        return {
            currencySymbol: this.$store.state.primaryCurrency.symbol
        }
    },
    props: {
        transitionSize: {
          type: String,
          required: true
        },
        transition: {
          type: Boolean,
          required: true
        },
        icon: {
            type: String,
            required: true
        },
        statistic: {
            required: true,
        },
        statisticTitle: {
            type: String,
        },
        chartData: {
            required: true
        },
        color: {
            type: String,
            default: 'primary',
        },
        chartType: {
            type: String,
            default: 'line-chart',
        },
        type: {
            type: String,
            default: 'line'
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
            this.$refs.apexChart.updateOptions({ theme: { monochrome: { color: this.getHex() } } });
        }
    },
    computed: {
        themePrimaryColor() {
            return this.$store.state.themePrimaryColor;
        }
    },
    methods: {
        getFrame(size) {
          let isDark = this.$store.state.theme == 'dark';
          return getFrame(size, isDark);
        },
        openNewRoute() {
          this.$router.push({path: "/graph/" + this.name});
        },
        getHex() {
            let rgb  = window.getComputedStyle(document.documentElement).getPropertyValue(`--vs-${this.color}`);
            rgb = rgb.split(",");
            return "#" + ((1 << 24) + (Number(rgb[0]) << 16) + (Number(rgb[1]) << 8) + Number(rgb[2])).toString(16).slice(1);
        },
        changeTheme() {
            if(this.type == 'area') {
                this.chartData.chartOptions['theme'] = {
                    monochrome: {
                        enabled: true,
                        color: this.getHex(this.color),
                        shadeTo: 'light',
                        shadeIntensity: 0.65
                    }
                }
            }
        },
        numberWithCommas(x) {
          if (x) {
            x = parseInt(x);
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          }
        }
    },
    components: {
        VueApexCharts
    },
    created() {
        this.changeTheme();
    }
}
</script>
<style scoped>
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
    display: inline;
  }
  .expand-icon-wrapper {
    padding-right: 15px;
    padding-left: 0px;
  }
</style>