<!-- =========================================================================================
    File Name: ChartHorizontalBarChart.vue
    Description: Create horizontal bar chart
    ----------------------------------------------------------------------------------------
    Item Name: Vuesax Admin - VueJS Dashboard Admin Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
    <vx-card :title="type" class="mb-base">

        <div class="mt-5">
            <chartjs-component-horizontal-bar-chart :height=250 :data="data" :options="options"></chartjs-component-horizontal-bar-chart>
        </div>
    </vx-card>
</template>

<script>
import ChartjsComponentHorizontalBarChart from "./charts-components/ChartjsComponentHorizontalBarChart.vue"
export default {
    props: ["type"],
    data() {
      if(this.type === "Active Reserves And Utilization") {
        return {
            data: {
                labels: ["ETH", "DAI", "MKR", "USDC", "WBTC"],
                datasets: [{
                    label: "Active Reserves",
                    backgroundColor: ["#7367F0", "#28C76F", "#EA5455", "#FF9F43", "#1E1E1E"],
                    data: [2478, 5267, 734, 784, 433]
                }]
            },
            options: {
                legend: { display: false },
                title: {
                    display: true
                },
                scales: {
                  xAxes: [
                    {
                      display: true,
                      gridLines: {
                        display: false
                      },
                      // ticks: {
                      //   autoSkip: true,
                      //   maxTicksLimit: 7
                      // }
                    }
                  ],
                  yAxes: [
                    {
                      display: true,
                      gridLines: {
                        display: false
                      }
                    }
                  ]
                }
            }
        }
      } else if (this.type === "Next 30D Returns") {
        return {
            data: {
                labels: ["ETH", "DAI", "MKR", "USDC", "WBTC"],
                datasets: [{
                    label: "Next 30d Returns",
                    backgroundColor: ["#7367F0", "#28C76F", "#EA5455", "#FF9F43", "#1E1E1E"],
                    data: [2478, 5267, 734, 784, 433]
                }]
            },
            options: {
                legend: { display: false },
                title: {
                    display: true
                },
                scales: {
                  xAxes: [
                    {
                      display: true,
                      gridLines: {
                        display: false
                      },
                      // ticks: {
                      //   autoSkip: true,
                      //   maxTicksLimit: 7
                      // }
                    }
                  ],
                  yAxes: [
                    {
                      display: true,
                      gridLines: {
                        display: false
                      }
                    }
                  ]
                }
            }
        }
      } else {
        return {
            data: {
                labels: ["ETH", "DAI", "MKR", "USDC", "WBTC"],
                datasets: [{
                    label: "Total Premium Earned",
                    backgroundColor: ["#7367F0", "#28C76F", "#EA5455", "#FF9F43", "#1E1E1E"],
                    data: [2478, 5267, 734, 784, 433]
                }]
            },
            options: {
                legend: { display: false },
                title: {
                    display: true
                },
                scales: {
                  xAxes: [
                    {
                      display: true,
                      gridLines: {
                        display: false
                      },
                      // ticks: {
                      //   autoSkip: true,
                      //   maxTicksLimit: 7
                      // }
                    }
                  ],
                  yAxes: [
                    {
                      display: true,
                      gridLines: {
                        display: false
                      }
                    }
                  ]
                }
            }
        }
      }
    },
    components: {
        ChartjsComponentHorizontalBarChart
    }
}
</script>