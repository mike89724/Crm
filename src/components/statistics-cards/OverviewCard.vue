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
      <div class="text-2xl pl-6 pt-6">
        {{title}}
      </div>
      <div v-if="value.title_value" class="text-5xl bold pl-6 pt-6">
        {{value.title_value}}
      </div>
      <div :class="{'mt-24': value.title_value == null}">
        <vue-apex-charts
          type="bar"
          width="100%"
          height="300"
          :options="updatedOptions"
          :series="updatedSeries"
        ></vue-apex-charts>
      </div>
    </div>
  </vx-card>
</template>

<script>
import VueApexCharts from "vue-apexcharts";
import { getFrame } from "@/utils/util.js";

export default {
  data() {
    return {
      series: [],
      options: {
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
  },
  props: {
    value: Object,
    title: String,
    name: String,
    width: String
  },
  computed: {
    updatedSeries() {
      return this.series;
    },
    updatedOptions() {
      return this.options;
    }
  },
  components: {
    VueApexCharts
  },
  created() {
    if (this.name == "overlapping-area-chart-without-value") {
      for (var i = 0; i < this.value["y"].length; i++) {
        this.series.push({
          name: this.value["y"][i]["label"],
          data: this.value["y"][i]["value"]
        });
      }
    } else if (this.name == "bar-chart-without-value") {
      this.series.push({
        name: this.value["y-label"],
        data: this.value["y"]
      });
    }
    this.options = {
      categories: this.value["x"],
      chart: {
        animations: {
          enabled: false
        },
        toolbar: {
          show: false
        }
      },
      yaxis: {
        labels: {
          show: true
        },
        axisBorder: {
          show: true
        }
      },
      xaxis: {
        labels: {
          show: true
        },
        axisBorder: {
          show: true
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
  mounted() {
    console.log(this.$refs["overview"]);
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