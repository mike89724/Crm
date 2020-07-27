<template>
    <div>
        <vs-prompt
            vs-title="Enter Google Auth Code"
            @vs-accept="submit()"
            @vs-close="close()"
            :vs-active.sync="activePrompt">
            <div class="">
            <div style="display: flex;justify-content:center;">
                <center><img :src=
                    "'https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=200x200&chld=M|0&cht=qr&chl=otpauth://totp/Nuo%3Fsecret%3D' + 'JB4UK6TQPBDUC6CUOA2FMSZSN5GFSY2D'" 
                    style="height: 150px; margin: 10px auto;">
                </center>
            </div>
            <vs-input placeholder="Enter"  v-model="otp" class="mt-4 mb-2 w-full" />
            <vs-alert :vs-active="!validName" color="danger" vs-icon="new_releases" >
                Fields can not be empty please enter the data
            </vs-alert>
            </div>
        </vs-prompt>
      </div>
</template>

<script>
    import axios from 'axios';
    export default {
        data() {
            return {
                otp: '',
                activePrompt: false,
            }
        },
        mounted() {
            this.activePrompt = true;
        },    
        methods: {
            async submit() {
                let response = await axios.post('https://api-crm.nuofox.com/login/final', {
                email: this.$store.state.email,
                password: this.$store.state.password,
                ga_token: this.otp  
            })
            console.log('priniting final response')
            console.log(response)
            if(response.status == 200) {
                this.showData = true;
                this.$store.commit('profileData', response);

                console.log('printing response')
                console.log(response);
                console.log("printing path")
                console.log(response.data.data.products[0].slug)
                console.log(response.data.data.products[0].sections[0].slug)
                console.log(response.data.data.products[0].sections[0].pages[0].slug)
                this.$router.push({path: '/' + response.data.data.products[0].slug + '/' + response.data.data.products[0].sections[0].slug + '/' + response.data.data.products[0].sections[0].pages[0].slug + '/' + response.data.data.products[0].sections[0].pages[0].tag + '/' + response.data.data.products[0].sections[0].tag + '/' + response.data.data.products[0].tag})
                // this.$router.push({path: '/home'});
            } else if(response.status != 200) {
                this.$router.push({path: '/pages/login'})
            }
            // this.otp = response;
            },
            close() {
                this.$vs.notify({
                    color:'danger',
                    title:'Closed',
                    text:'You close a dialog!'
                })
                this.$router.push({ path: '/pages/login'})
            }
        }
    }
</script>