<!-- =========================================================================================
    File Name: Login.vue
    Description: Login Page
    ----------------------------------------------------------------------------------------
    Item Name: Vuesax Admin - VueJS Dashboard Admin Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
    <div class="h-screen flex w-full bg-img" id="page-login">
        <div class="vx-col sm:w-1/2 md:w-1/2 lg:w-3/4 xl:w-3/5 mx-auto self-center">
            <vx-card>
                <div slot="no-body" class="full-page-bg-color">
                    <div class="vx-row">
                        <div class="vx-col hidden sm:hidden md:hidden lg:block lg:w-1/2 mx-auto self-center">
                            <img src="@/assets/images/pages/login.png" alt="login" class="mx-auto">
                        </div>
                        <div class="vx-col sm:w-full md:w-full lg:w-1/2 mx-auto self-center  d-theme-dark-bg">
                            <div class="p-8">
                                <div class="vx-card__title mb-8">
                                    <h4 class="mb-4">Login</h4>
                                    <p>Welcome back, please login to your account.</p>
                                </div>
                                <vs-input
                                    v-validate="'required|email|min:3'"
                                    data-vv-validate-on="blur"
                                    name="email"
                                    icon="icon icon-user"
                                    icon-pack="feather"
                                    label-placeholder="Email"
                                    v-model="email"
                                    class="w-full no-icon-border"/>
                                <span class="text-danger text-sm">{{ errors.first('email') }}</span>

                                <vs-input
                                    data-vv-validate-on="blur"
                                    v-validate="'required|min:6|max:10'"
                                    type="password"
                                    name="password"
                                    icon="icon icon-lock"
                                    icon-pack="feather"
                                    label-placeholder="Password"
                                    v-model="password"
                                    class="w-full mt-6 no-icon-border" />
                                <span class="text-danger text-sm">{{ errors.first('password') }}</span>

                                <div class="flex flex-wrap justify-between my-5">
                                    <vs-checkbox v-model="checkbox_remember_me" class="mb-3">Remember Me</vs-checkbox>
                                    <router-link to="/pages/forgot-password">Forgot Password?</router-link>
                                </div>
                                <div>
                                    <vue-recaptcha style="margin-left: 9%;" ref="recaptcha" size="large" :sitekey="sitekey" @verify="submit" @expired="onCaptchaExpired" />
                                </div>
                                <!-- <div class="flex justify-center my-5">
                                    <vs-button v-google-signin-button="clientId" class="google-signin-button"> Continue with Google</vs-button>
                                </div> -->
                                <div class="flex justify-center my-5">
                                    <vs-button class="float-right" :disabled="!validateForm" @click="login">Login</vs-button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </vx-card>
        </div>
    </div>
</template>

<script>
import VueRecaptcha from 'vue-recaptcha' ;
import router from '@/router'
import axios from 'axios';
export default {
    data() {
        return {
            email: 'ratnesh@getnuo.com',
            clientId: 'cliend-id',
            password: 'Nuofox@123',
            checkbox_remember_me: false,
            sitekey: '6LfMvKkZAAAAAPewkKAVKPWhrRIUNe0p8rkmnuCB',
            recaptchaToken: '',
        }
    },
    components: { VueRecaptcha },
    computed: {
        validateForm() {
            return !this.errors.any() && this.email != '' && this.password != '';
        },
    },
    methods: {
        onCaptchaExpired () { this.$refs.recaptcha.reset() },
        // validate () { this.$refs.recaptcha.execute() },
        submit: function(token) {
            console.log(token);
            this.recaptchaToken = token;
        },
        async login() {
            var response = await axios.post('https://api-crm.nuofox.com/login/init', {
                    email: this.email,
                    password: this.password,
                    recaptcha_response: this.recaptchaToken   
            })

            console.log(response);
            this.$store.commit('isUserLoggedIn', true)
            if(this.email != '' && this.password != ''){
                this.$store.commit('email', this.email)
                this.$store.commit('password', this.password)
            }
            this.$store.commit('profileData', {data: {data: {
            products: [
                
            ]
            }}})
            this.$store.commit('routeData', {})
            if(response.status == 200) {
                this.$router.push({path: '/google-auth-verify/otp'});
            }
            // const payload = {
            //     checkbox_remember_me: this.checkbox_remember_me,
            //     userDetails: {
            //         email: 'demo@demo.com',
            //         password: 'password',
            //         recaptcha_response: this.recaptchaToken
            //     },
            //     notify: this.$vs.notify
            // }
            // this.$store.dispatch('auth/loginAttempt', payload);
        },

        OnGoogleAuthSuccess (idToken) {
            console.log(idToken)
      // Receive the idToken and make your magic with the backend
        },
        OnGoogleAuthFail (error) {
            console.log(error)
        },

        loginAuth0() {
            if (this.$store.state.isUserLoggedIn()) {
                this.notifyAlreadyLogedIn();
                return false
            }
            this.$auth.login({ target: this.$route.query.to });
        },

        // Google login
        loginWithGoogle() {
            this.$store.dispatch('auth/loginWithGoogle', {notify: this.$vs.notify})
        },

        // Facebook login
        loginWithFacebook() {
            this.$store.dispatch('auth/loginWithFacebook', {notify: this.$vs.notify})
        },

        // Twitter login
        loginWithTwitter() {
            this.$store.dispatch('auth/loginWithTwitter', {notify: this.$vs.notify})
        },

        // Github login
        loginWithGithub() {
            this.$store.dispatch('auth/loginWithGithub', {notify: this.$vs.notify})
        },

        notifyAlreadyLogedIn() {
            this.$vs.notify({
                title: 'Login Attempt',
                text: 'You are already logged in!',
                iconPack: 'feather',
                icon: 'icon-alert-circle',
                color: 'warning'
            });
        },
        registerUser() {
            if(this.$store.state.auth.isUserLoggedIn()) {
                this.notifyAlreadyLogedIn();
                return false;
            }
            this.$router.push('/pages/register');
        }
    }
}
</script>

<style lang="scss">
#page-login {
    .social-login {
        .bg-facebook {
          background-color: #1551b1;
        }
        .bg-twitter {
          background-color: #00aaff;
        }
        .bg-google {
          background-color: #1551b1;
        }
        .bg-github {
          background-color: #333;
        }
    }
}
</style>
