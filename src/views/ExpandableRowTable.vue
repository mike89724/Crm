<template>
    <div class="table-wrap">
        <table>
            <thead>
                <th class="th-header">Dexes</th>
                <th class="th-header">SPLIT</th>
                <th class="th-header">{{source_currency}}/{{destination_currency}}</th>
            </thead>
            <tbody>
                <tr :key="index" v-bind:value="index" :item="item" v-for="(item,index) in distributions">
                    <td class="td-data">
                        <div class="disp-fl">
                            <img :class ="getClassByDex(item.name)" :src="item.image_url">
                            {{item.name}}
                        </div>
                    </td>
                    <td class="td-data">{{item.split | handleFloat(4)}}%</td>
                    <td v-if="item.rate" class="td-data">{{item.rate | handleFloat(4)}}</td>
                    <td class="td-data" v-else> -- </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    data() {
        return ({
            distributions: [],
        })
    },
    props: ['distribution','source_currency','destination_currency', 'source_amount','destination_amount'],
    methods: {
        getClassByDex(name) {
            if(name == 'oasis') {
                return 'image-icon-small'
            } else if (name == 'uniswap') {
                return 'image-icon-big'
            } else {
                return 'image-icon'
            }
        }
    },
    mounted() {
        console.log("prop", this.distribution)
        this.distributions = this.distribution
        console.log("prop 3", this.distributions)

    }
    
}
</script>

<style lang="scss" scoped>
.disp-fl {
    display: flex;
    margin: auto;
    text-transform: uppercase;
    width: 55%;
}
.image-icon {
    margin-right: 5%;
    height: 20px;
    width: 20px;
}
.image-icon-small {
    margin-right: 5%;
    height: 17px;
    width: 17px;
}
.image-icon-big {
    margin-right: 5%;
    margin-left: -2%;
    height: 22px;
    width: 22px;
}
.table-wrap {
    width: 80%;
    margin: auto;
}
table {
    width: 100% !important;
    border: 1px solid;
    border-left: 1px solid !important;
}
thead {
    border: 1px solid;
}
tbody {
    border: 1px solid;
}
.th-header {
    border: 1px solid;
    text-align: center;
    font-family: Rubik;
    font-size: 15px;
    opacity: 0.6;
}
.td-data {
    height: 40px;
    border: 1px solid;
    text-align: center;
    font-family: Rubik;
    font-size: 1rem;
}
</style>