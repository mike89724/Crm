<template>
    <div>
        <vs-prompt
            vs-title="Enter Google Auth Code"
            @vs-accept="submit()"
            @vs-cancel="close()"
            @vs-close="close()"
            :vs-active.sync="activePrompt">
            <div class="">
            
            <vs-input placeholder="Enter"  v-model="otp" class="mt-4 mb-2 w-full" />
            <div style="text-align: center;">
                <a style="text-decoration: underline" href="/pages/login">LOGIN?</a>
            </div> 
            <div style="text-align: center;">
                <a style="text-decoration: underline" href="/setup-2fa">Setup 2FA?</a>  
            </div> 
            <vs-alert :vs-active="!validName" color="danger" vs-icon="new_releases" >
                Fields can not be empty please enter the data
            </vs-alert>
            </div>
        </vs-prompt>
      </div>
</template>

<script>
    import axios from 'axios';
    import AuthenticationService from "../services/AuthenticationService";
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
                let response;
                let payLoad = {
                    email: this.$store.state.email,
                    password: this.$store.state.password,
                    ga_token: this.otp
                }
                try {
                    response = await AuthenticationService.loginFinal(payLoad)
                } catch(err) {
                    response = err
                }

                console.log('priniting final response')
                console.log(response)
                if(response.status == 200) {
                    this.showData = true;
                    this.$store.commit('profileData', response);
                    this.$store.commit('token', response.data.data.token);
                    this.$store.commit('refreshToken', response.data.data.refresh_token);
                    this.$store.commit('user', response.data.data.email);
                    this.$store.commit('routeData', {})
                    this.$vs.notify({
                        color:'success',
                        title:'Passed',
                        text:'Login Successfull!'
                    })
                    this.$router.push({path: '/' + response.data.data.products[0].slug + '/' + response.data.data.products[0].sections[0].slug + '/' + response.data.data.products[0].sections[0].pages[0].slug})
                    // this.$router.push({path: '/home'});
                } else if(response.status == 401) {
                    this.$vs.notify({
                        color:'danger',
                        title:'Error',
                        text:'Error while logging in!'
                    })
                    this.$router.push({path: '/pages/login'})
                } else {
                    this.$vs.notify({
                        color:'danger',
                        title:'Error',
                        text:'Error while logging in!'
                    })
                    this.$router.push({path: '/pages/login'})
                }
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