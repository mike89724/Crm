<template>
  <div :style="`width: ${width};`">
    <transaction-card v-if="name == 'single-value-card'" :title="title" :amount="value"></transaction-card>
    <overview-card v-if="name == 'area-chart-with-value' || name == 'bar-chart-without-value'" :title="title" :value="value" :name="name"></overview-card>
    <record-slider-table-without-button style="width: 100%;" v-if="name == 'record-slider-table'" :title="title" :value="value" :showPagination="false" :showFilters="false"></record-slider-table-without-button>
  </div>
</template>

<script>
  import TransactionCard from "@/components/statistics-cards/TransactionCard.vue";
  import OverviewCard from "@/components/statistics-cards/OverviewCard.vue";
  import RecordSliderTableWithoutButton from "@/views/ui-elements/table/RecordSliderTableWithoutButton.vue";

  export default {
    props: {
      name: {
        type: String,
        default: "single-value-card"
      },
      title: {
        type: String,
        default: "Title"
      },
      value:{},
      width: {
        type: String
      }
    },
    components: {
      TransactionCard,
      OverviewCard,
      RecordSliderTableWithoutButton
    }
  }
</script>