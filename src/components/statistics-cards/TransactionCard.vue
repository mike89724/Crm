<template>
    <div id="transaction-card">
        <vx-card>
            <div class="text-2xl text-left p-3">{{title}}</div>
            <div class="flex justify-between">
                <div class="text-5xl bold text-left p-3">{{amount}}</div>
                <div>
                    <img class="h-20 w-20" :src="imageUrl">
                </div>
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