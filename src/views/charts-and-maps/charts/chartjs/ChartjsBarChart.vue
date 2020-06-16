<!-- =========================================================================================
    File Name: ChartBarChart.vue
    Description: Create bar chart
    ----------------------------------------------------------------------------------------
    Item Name: Vuesax Admin - VueJS Dashboard Admin Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
    <vx-card title="Top 5 Reserves" class="mb-base" code-toggler>

        <div class="mt-5">
            <chartjs-component-bar-chart ref="chartjsComponentBarChart" :height=310></chartjs-component-bar-chart>
        </div>

        <template slot="codeContainer">
        </template>
    </vx-card>
</template>

<script>
import ChartjsComponentBarChart from "./charts-components/ChartjsComponentBarChart.vue"
export default {
    props: [ "type"],
    components: {
        ChartjsComponentBarChart
    },
    mounted() {
      this.plotReserveGraph();
    },
    methods: {
      async plotReserveGraph() {
        if(this.type === "reserve") {
          await this.$store.dispatch('fetchReserve');
          this.$refs.chartjsComponentBarChart.setGraphData(this.$store.state.globalReserveDetails.top_five_reserves);
        }
      }
    }
}
</script>