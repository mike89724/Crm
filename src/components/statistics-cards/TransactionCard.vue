<template>
    <div id="transaction-card">
        <vx-card>
            <div class="flex justify-between">
              <div class="text-2xl text-left p-3 w-1/2">{{title}}</div>
              <div class="flex items-center">
                <feather-icon icon="HashIcon"></feather-icon>
              </div>
            </div>
            <div class="flex justify-between">
              <div class="text-5xl bold text-left p-3">{{amount}}</div>
            </div>
        </vx-card>
    </div>
</template>

<script>
export default {
    data(){

    },
    props: {
        title: String,
        amount: Number,
        imageUrl: String,
    }
}
</script>