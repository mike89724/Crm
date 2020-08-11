<template>
    <div>
        <vs-prompt :vs-active.sync="activePrompt" @vs-accept="submit()"
            @vs-cancel="close()"
            @vs-close="close()">
            <div style="display: flex;justify-content:center;">
                <center><img :src=
                    "'https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=200x200&chld=M|0&cht=qr&chl=otpauth://totp/Nuo%3Fsecret%3D' + 'JB4UK6TQPBDUC6CUOA2FMSZSN5GFSY2D'" 
                    style="height: 150px; margin: 10px auto;">
                </center>
            </div>
            <h6> Scan the above code for setting up your 2fa and click on login.</h6>
            <div style="text-align: center;">
                <a style="text-decoration: underline" href="/pages/login">LOGIN?</a>               
            </div>  
        </vs-prompt>
    </div>
</template>

<script>
export default {
    data(){
        return {
            activePrompt: false
        }
    },
    mounted() {
        this.activePrompt = true;
    },
    methods: {
        submit() {
            this.$router.push({ path: '/pages/login'})
        },
        close() {
            this.$vs.notify({
                color:'danger',
                title:'Closed',
                text:'You closed 2fa modal!'
            })
            this.$router.push({ path: '/pages/login'})
        }
    }
}
</script>