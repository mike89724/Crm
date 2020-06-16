<!-- =========================================================================================
	File Name: ChartjsComponentBarChart.vue
	Description: Chartjs component - Bar Chart
	----------------------------------------------------------------------------------------
	Item Name: Vuesax Admin - VueJS Dashboard Admin Template
	Author: Pixinvent
	Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<script>
import { Bar } from 'vue-chartjs'

export default {
    extends: Bar,
    data() {
        return {
            graphData: [40, 39, 30, 40, 39],
            labels: [],
            reserveData: []
        }
    },
    mounted() {
        //this.renderChart(this.data, this.options)
    },
    methods: {
        async setGraphData(graphData) {
            this.graphData = graphData;
            await this.generateLabels();
            this.renderGraph();
        },
        async generateLabels() {

            for (var i = 0; i < this.graphData.length; i++) {
                this.labels[i] = this.graphData[i].currency_short_name;
                this.reserveData[i] = this.graphData[i].reserve_value;
            }
        },
        renderGraph() {
            this.renderChart(
                {
                    labels: this.labels,
                    datasets: [{
                        label: "Reserve Value",
                        // backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850"],
                        backgroundColor: ["#7367F0", "#28C76F", "#EA5455", "#FF9F43", "#1E1E1E"],
                        borderWidth: "3.5",
                        data: this.reserveData
                    }]
                },
                {
                    responsive: true,
                    legend: { display: false },
                    tooltips: { enabled: true },
                    scales: {
                        xAxes: [{
                            display: false,
                            gridLines: {
                                display: false
                            }
                        }],
                        yAxes: [{
                            display: false,
                            gridLines: {
                                display: false
                            }
                        }]
                    }
                }
            )
        }
    }
}
</script>