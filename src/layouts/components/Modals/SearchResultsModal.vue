<template>
  <div>
    <v-dialog
      class="search-dropdown"
      style="display: flex;"
      @keydown.esc="searchResultsModal = false"
    >
      <vs-table id="loanTrade" class :data="searchResultsData">
        <template slot="header">
          <h5 class="search-dropdown-heading">Loan/Trade Orders</h5>
        </template>
        <template slot="thead">
          <vs-th>ORDER ID</vs-th>
          <vs-th>CREATED</vs-th>
          <vs-th>COLLATERAL</vs-th>
          <vs-th>PRINCIPAL</vs-th>
          <vs-th>PREMIUM</vs-th>
          <vs-th>EXPIRATION</vs-th>
          <vs-th>STATUS</vs-th>
        </template>
        <template slot-scope="{data}">
          <vs-tr :key="indextr" v-for="(tr, indextr) in data">
            <vs-td :data="data[indextr].id" class="tableData">
              <span>{{data[indextr].id}}</span>
            </vs-td>
            <vs-td :data="data[indextr].added_on" class="tableData">
              <span>{{formatDateString(data[indextr].added_on)}}</span>
            </vs-td>
            <vs-td :data="data[indextr].collateral_amount" class="tableData">
              <span>{{data[indextr].collateral_amount}}</span>
            </vs-td>
            <vs-td :data="data[indextr].loan_amount" class="tableData">
              <span>{{data[indextr].loan_amount}}</span>
              <!-- <span>{{data[indextr].trade_amount}}</span> -->
            </vs-td>
            <vs-td :data="data[indextr].premium" class="tableData">
              <span>{{data[indextr].premium}}</span>
            </vs-td>
            <vs-td :data="data[indextr].expiration_datetime" class="tableData">
              <span>{{formatDateString(data[indextr].expiration_datetime)}}</span>
            </vs-td>
            <span class="flex items-center px-2 py-1 rounded">
                <div class="h-3 w-3 rounded-full mr-2" :class="'bg-' + data[indextr].status_color"></div>
                {{data[indextr].status}}
              </span>
          </vs-tr>
        </template>
      </vs-table>
      <vs-table id="reserve" class :data="searchResultsData">
        <template slot="header">
          <h5 class="search-dropdown-heading">Reserve Orders</h5>
        </template>
        <template slot="thead">
          <vs-th>ORDER ID</vs-th>
          <vs-th>AMOUNT</vs-th>
          <vs-th>GAINS</vs-th>
          <vs-th>ESTIMATED GAINS</vs-th>
          <vs-th>DURATION</vs-th>
          <vs-th>STATUS</vs-th>
        </template>
        <template slot-scope="{data}">
          <vs-tr :key="indextr" v-for="(tr, indextr) in data">
            <vs-td :data="data[indextr].id" class="tableData">
              <span>{{data[indextr].id}}</span>
            </vs-td>
            <vs-td :data="data[indextr].trade_amount" class="tableData">
              <span>{{data[indextr].trade_amount}}</span>
            </vs-td>
            <vs-td :data="data[indextr].added_on" class="tableData">
              <span>12.1</span>
            </vs-td>
            <vs-td :data="data[indextr].collateral_amount" class="tableData">
              <span>10.05</span>
            </vs-td>
            <vs-td :data="data[indextr].loan_amount" class="tableData">
              <span>2</span>
              <!-- <span>{{data[indextr].trade_amount}}</span> -->
            </vs-td>
            <vs-td :data="data[indextr].status" class="tableData">
              <span class="flex items-center px-2 py-1 rounded">
                <div class="h-3 w-3 rounded-full mr-2" :class="'bg-' + data[indextr].status_color"></div>
                {{data[indextr].status}}
              </span>
            </vs-td>
          </vs-tr>
        </template>
      </vs-table>
    </v-dialog>
  </div>
</template>
<script>
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { formatDate } from "@/static/util.js";
export default class SearchResultsModal extends Vue {
  modalName = "searchResults";
  get searchResultsModal() {
    var value = this.$store.getters.getModalShowState(this.modalName);
    return value.show;
  }

  set searchResultsModal(value) {
    if (!value) this.$store.dispatch("hideModal", this.modalName);
  }

  get searchResultsData() {
    var value = this.$store.getters.getModalShowState(this.modalName).data;
    return value;
  }

  formatDateString(timeStamp) {
    return formatDate(timeStamp);
  }
}
</script>
<style lang="stylus">
#loanTrade > header > span {
  width: 100%;
}

#loanTrade {
  width: 100%;
}

#reserve {
  width: 100%;
}

#reserve > header > span {
  width: 100%;
}

.search-dropdown-heading {
  text-align: left;
  background: white;
}

.search-dropdown {
  width: 73%;
  /* width: inherit; */
  position: fixed;
  top: 80px;
  border: solid rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.search-dropdown > div {
  width: 100%;
}

@media (max-width: 700px) {
  .search-dropdown-heading {
    font-size: 14px;
    text-align: center;
    background: white;
  }

  .search-dropdown {
    width: 91%;
    position: fixed;
    top: 80px;
    border: solid rgba(0, 0, 0, 0.1);
    cursor: pointer;
  }
}
</style>