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
          type="area"
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
      options: {}
    };
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
  methods: {
  },
  components: {
    VueApexCharts
  },
  created() {
    if (this.name == "overlapping-area-chart-without-value") {
      for (var i = 0; i < this.value["graph_value"]["y"].length; i++) {
        this.series.push({
          name: this.value["graph_value"]["y"][i]["label"],
          data: this.value["graph_value"]["y"][i]["value"]
        });
      }
    } else if (this.name == "area-chart-with-value") {
      this.series.push({
        name: this.value.graph_value["y-label"],
        data: this.value["graph_value"]["y"]
      });
    }
    this.options = {
      categories: this.value["graph_value"]["x"]
    };
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