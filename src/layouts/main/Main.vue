<!-- =========================================================================================
    File Name: Main.vue
    Description: Main layout
    ----------------------------------------------------------------------------------------
    Item Name: Vuesax Admin - VueJS Dashboard Admin Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
    <div class="layout--main" :class="[navbarClasses, footerClasses, {'app-page': isAppPage}]">
      <div v-if="showBanner" :class="bgColorClass" id="bannerInfo">
        <span style="color: rgb(255, 255, 255); font-weight: 400;">
          <span style="font-weight: 500;">
            <a target="_blank" :href="getBannerLink" @click="registerGA">
              <span v-if="$route.name != 'dashboardAnalytics'" aria-role="img" aria-label="rocket emoji">🚀</span>
              <span v-else>🎉</span>
              {{getBannerText}}
            </a>
          </span>
        </span>
      </div>
        <!-- <vx-tour :steps="steps" v-if="!disableThemeTour" /> -->
        <!-- <the-customizer
            @updateNavbar="updateNavbar"
            @updateNavbarColor="updateNavbarColor"
            :navbarType="navbarType"
            :navbarColor="navbarColor"
            :footerType="footerType"
            @updateFooter="updateFooter"
            :routerTransition="routerTransition"
            @updateRouterTransition="updateRouterTransition"
            v-if="!disableCustomizer"
            :hideScrollToTop="hideScrollToTop"
            @toggleHideScrollToTop="toggleHideScrollToTop"
            /> -->
        <!-- <vx-sidebar :sidebarItems="sidebarItems" :logo="require('@/assets/images/logo/logo.png')" title="NuoScan" parent=".layout--main" /> -->
        <!-- <vx-sidebar :sidebarItems="sidebarItems" :logo="'https://nuo-public.s3.ap-south-1.amazonaws.com/nuo_web/images/nuo-logo.png'" title="Scan" parent=".layout--main" /> -->
        <vx-sidebar :sidebarItems="sidebarItems" :footerItems="footerItems" :logo="require('@/assets/images/logo/logo-color-demibold.png')" title="" parent=".layout--main" />

        <div id="content-area" :class="[contentAreaClass, {'show-overlay': bodyOverlay}]">

            <div id="content-overlay"></div>

            <div class="content-wrapper">

                <!-- <the-navbar :navbarColor="navbarColor" :currencies="currencies" :class="[{'text-white': isNavbarDark && !isThemeDark}, {'text-base': !isNavbarDark && isThemeDark}]">
                </the-navbar> -->

                
                <div class="router-view mt-22">
                    <div class="router-content" :class="{'mt-0': navbarType == 'hidden'}">
                        <transition :name="routerTransition">
                        <div class="router-header flex flex-wrap items-center mb-6" v-if="$route.meta.breadcrumb || $route.meta.pageTitle">
                            <div class="content-area__heading" :class="{'pr-4 border-0 md:border-r border-t-0 border-b-0 border-l-0 border-solid border-grey-light' : $route.meta.breadcrumb}">
                                <h2 class="mb-1">{{ routeTitle }}</h2>
                            </div>
                            <vx-breadcrumb class="ml-4 md:block hidden" v-if="$route.meta.breadcrumb" />
                            <vs-dropdown class="ml-auto md:block hidden cursor-pointer" vs-trigger-click>
                                <vs-button radius icon="icon-settings" icon-pack="feather"></vs-button>

                                <vs-dropdown-menu class="w-32">
                                    <vs-dropdown-item><router-link to="/pages/profile" class="flex items-center"><feather-icon icon="UserIcon" class="inline-block mr-2" svgClasses="w-4 h-4" /><span>Profile</span></router-link></vs-dropdown-item>
                                    <vs-dropdown-item><router-link to="/apps/todo" class="flex items-center"><feather-icon icon="CheckSquareIcon" class="inline-block mr-2" svgClasses="w-4 h-4" /><span>Tasks</span></router-link></vs-dropdown-item>
                                    <vs-dropdown-item><router-link to="/apps/email" class="flex items-center"><feather-icon icon="MailIcon" class="inline-block mr-2" svgClasses="w-4 h-4" /><span>Inbox</span></router-link></vs-dropdown-item>
                                </vs-dropdown-menu>
                            </vs-dropdown>
                        </div>
                        </transition>
                        <div class="content-area__content">
                            <back-to-top bottom="5%" visibleoffset="500" v-if="!hideScrollToTop">
                                <vs-button icon-pack="feather" icon="icon-arrow-up" class="shadow-lg" />
                            </back-to-top>
                            <transition :name="routerTransition" mode="out-in">
                                <router-view @changeRouteTitle="changeRouteTitle"></router-view>
                            </transition>
                        </div>
                    </div>
                </div>

            </div>

            <the-footer></the-footer>
        </div>
    </div>
</template>

<script>
import VxSidebar from '@/layouts/components/vx-sidebar/VxSidebar.vue';
import TheCustomizer from "../components/customizer/TheCustomizer.vue";
import TheNavbar from '../components/TheNavbar.vue';
import TheFooter from '../components/TheFooter.vue';
import themeConfig from '@/../themeConfig.js';
import sidebarItems from "@/layouts/components/vx-sidebar/sidebarItems.js";
import footerItems from "@/layouts/components/vx-sidebar/footerItems.js";
import BackToTop from 'vue-backtotop'
import CurrencyService from '@/services/CurrencyService';

const VxTour = () => import('@/components/VxTour.vue')

export default {
    data() {
        return {
            navbarType: themeConfig.navbarType || 'floating',
            navbarColor: themeConfig.navbarColor || '#fff',
            footerType: themeConfig.footerType || 'static',
            routerTransition: themeConfig.routerTransition || 'none',
            isNavbarDark: false,
            routeTitle: this.$route.meta.pageTitle,
            sidebarItems: sidebarItems,
            footerItems: footerItems,
            disableCustomizer: themeConfig.disableCustomizer,
            windowWidth: window.innerWidth, //width of windows
            hideScrollToTop: themeConfig.hideScrollToTop,
            disableThemeTour: themeConfig.disableThemeTour,
            currencies:[],
            // opens: "left",
            // firstDay: moment.localeData().firstDayOfWeek(),
            // format: moment.localeData().longDateFormat('L'),
            steps: [
                {
                    target: '#btnSidebarToggler',
                    content: 'Toggle Collapse Sidebar.'
                },
                {
                    target: '.vx-navbar__starred-pages',
                    content: 'Create your own bookmarks. You can also re-arrange them using drag & drop.'
                },
                {
                    target: '.i18n-locale',
                    content: 'You can change language from here.'
                },
                {
                    target: '.navbar-fuzzy-search',
                    content: 'Try fuzzy search to visit pages in flash.'
                },
                {
                    target: '.customizer-btn',
                    content: 'Customize template based your preference',
                    params: {
                        placement: 'left'
                    }
                },
            ]
        }
    },
    watch: {
        '$route'() {
            this.routeTitle = this.$route.meta.pageTitle;
            var wrapperDivs = document.querySelectorAll('.vx-navbar-wrapper');
            var length = wrapperDivs.length;
            var styleProp = "";
            if
            (
              !(
                this.$route.name == "dashboardTrades" ||
                this.$route.name == "dashboardLoans" ||
                this.$route.name == "dashboardReserves"
              )
            ) {
              styleProp += "top: -10px !important";
            } else {
              styleProp += "top: 10px !important";
            }

            for (var i = 0; i < length; i++) {
              wrapperDivs[i].setAttribute("style", styleProp);
            }
        },
        isThemeDark(val) {
            if(this.navbarColor == "#fff" && val) {
                this.updateNavbarColor("#10163a")
            }else {
                this.updateNavbarColor("#fff")
            }
        },
    },
    computed: {
        showBanner() {
          if (
            this.$route.name == "dashboardTrades" ||
            this.$route.name == "dashboardReserves" ||
            this.$route.name == "dashboardLoans"
          ) {
            return true;
          } else {
            return false;
          }
        },
        getBannerLink() {
          if (this.$route.name == "dashboardTrades") {
            return "https://app.nuo.network/trade";
          } else if (this.$route.name == "dashboardReserves") {
            return "https://app.nuo.network/lend";
          } else if (this.$route.name == "dashboardLoans") {
            return "https://app.nuo.network/borrow";
          } else if (this.$route.name == "dashboardAnalytics") {
            return "https://app.nuo.network";
          } else {
            return "https://www.producthunt.com/posts/nuoscan?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-nuoscan";
          }
        },
        getBannerText() {
          if (this.$route.name == "dashboardTrades") {
            return "Place your first margin trade ->";
          } else if (this.$route.name == "dashboardReserves") {
            return "Create your first reserve and start earning ->";
          } else if (this.$route.name == "dashboardLoans") {
            return "Borrow funds at the lowest interest rate ->";
          } else if (this.$route.name == "dashboardAnalytics") {
            return "";
          }else {
            return "We are live on Product Hunt ->";
          }
        },
        bgColorClass() {
          if (this.$route.name == "dashboardAnalytics") {
            return "market-maker-bonus"
          } else if (this.$route.name != "dashboardTrades" && this.$route.name != "dashboardReserves" && this.$route.name != "dashboardLoans") {
            return "productHunt";
          } else {
            return "placeTradeCTA";
          }
        },
        isAppPage() {
            if(this.$route.path.includes('/apps/')) return true
            else return false
        },
        isThemeDark() { return this.$store.state.theme == 'dark' },
        sidebarWidth() {
            return this.$store.state.sidebarWidth;
        },
        bodyOverlay() {
            return this.$store.state.bodyOverlay;
        },
        contentAreaClass() {
            if(this.sidebarWidth == "default") return "content-area-default"
            else if(this.sidebarWidth == "reduced") return "content-area-reduced"
            else if(this.sidebarWidth) return "content-area-full"
        },
        navbarClasses() {
            return {
                'navbar-hidden': this.navbarType == 'hidden',
                'navbar-sticky': this.navbarType == 'sticky',
                'navbar-static': this.navbarType == 'static',
                'navbar-floating': this.navbarType == 'floating',
            }
        },
        footerClasses() {
            return {
                'footer-hidden': this.footerType == 'hidden',
                'footer-sticky': this.footerType == 'sticky',
                'footer-static': this.footerType == 'static',
            }
        },
    },
    methods: {
        registerGA() {
          var category = "banner";
          var action = "clicked";
          var label = "";
          if (this.$route.name == "dashboardTrades") {
            label += "trades"
          } else if (this.$route.name == "dashboardLoans") {
            label += "loans";
          } else if (this.$route.name == "dashboardReserves") {
            label += "reserves";
          }
          this.$ga.event({
            eventCategory: category,
            eventAction: action,
            eventLabel: label
          });
        },
        async getFiatCurrencies() {
            var response = (await CurrencyService.getCurrencies()).data;
            // console.log(response, "Currencies");
            this.currencies = response.data.supported_currencies.fiat_currencies;
        },
        changeRouteTitle(title) {
            this.routeTitle = title;
        },
        updateNavbar(val) {
            this.navbarType = val;
        },
        updateNavbarColor(val) {
            this.navbarColor = val;
            if(val == "#fff") this.isNavbarDark = false
            else this.isNavbarDark = true
        },
        updateFooter(val) {
            this.footerType = val;
        },
        updateRouterTransition(val) {
            this.routerTransition = val;
        },
        handleWindowResize(event) {
            this.windowWidth = event.currentTarget.innerWidth;
            this.setSidebarWidth();
        },
        setSidebarWidth() {
            if (this.windowWidth < 1200) {
                this.$store.commit('TOGGLE_IS_SIDEBAR_ACTIVE', false)
                this.$store.dispatch('updateSidebarWidth', 'no-sidebar')
                this.disableThemeTour = true;
            }
            else if(this.windowWidth < 1200) {
                this.$store.dispatch('updateSidebarWidth', 'reduced')
            }
            else {
                this.$store.commit('TOGGLE_IS_SIDEBAR_ACTIVE', true)
            }
        },
        toggleHideScrollToTop(val) {
            this.hideScrollToTop = val;
        }
    },
    components: {
        VxSidebar,
        TheNavbar,
        TheFooter,
        TheCustomizer,
        BackToTop,
        VxTour
    },
    created() {
        this.setSidebarWidth();
        if(this.navbarColor == "#fff" && this.isThemeDark) {
            this.updateNavbarColor("#10163a")
        } else {
            this.updateNavbarColor(this.navbarColor)
        }
        this.getFiatCurrencies();
    },
    mounted() {
      this.routeTitle = this.$route.meta.pageTitle;
      var wrapperDivs = document.querySelectorAll('.vx-navbar-wrapper');
      var length = wrapperDivs.length;
      var styleProp = "";
      if
      (
        !(
          this.$route.name == "dashboardTrades" ||
          this.$route.name == "dashboardLoans" ||
          this.$route.name == "dashboardReserves"
        )
      ) {
        styleProp += "top: -10px !important";
      } else {
        styleProp += "top: 10px !important";
      }

      for (var i = 0; i < length; i++) {
        wrapperDivs[i].setAttribute("style", styleProp);
      }
    }
}
</script>
<style scoped lang="scss">
#bannerInfo {
    position: sticky;
    top: 0;
    z-index: 500000;
    padding: 2px 0px;
    font-size: 15px;
    text-align: center;
    a {
      color: #fff;
    }
  }
  .theme-dark {
    #bannerInfo {
      position: sticky;
      top: 0;
      z-index: 500000;
      padding: 2px 0px;
      font-size: 15px;
      text-align: center;
      // background-color: rgba(218, 85, 47, 1);
      a {
        color: #ffffff;
      }
    }
  }
  .productHunt {
    background-color: rgba(218, 85, 47, 1);
  }
  .placeTradeCTA {
    background-color: rgb(53, 118, 253);
  }
  .market-maker-bonus {
    background-color: rgb(88, 170, 72);
  }
  .market-maker-bonus{
    a::after {
      content: "Earn 1% additional bonus interest on your reserve of $5000 and above.";
      color: #ffffff;
    }
  }
  @media only screen and (max-width: 768px) {
    .market-maker-bonus{
      a::after {
        content: "Earn 1% additional bonus interest.";
        color: #ffffff;
      }
    }
  }
</style>
