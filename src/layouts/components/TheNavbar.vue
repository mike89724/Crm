<!-- =========================================================================================
	File Name: TheNavbar.vue
	Description: Navbar component
	Component Name: TheNavbar
	----------------------------------------------------------------------------------------
	Item Name: Vuesax Admin - VueJS Dashboard Admin Template
	Author: Pixinvent
	Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
<div class="relative">
	<div class="vx-navbar-wrapper">
		<vs-navbar class="vx-navbar navbar-custom" :color="navbarColor" :class="classObj">

			<feather-icon class="sm:inline-flex xl:hidden cursor-pointer mr-1" icon="MenuIcon" @click.stop="showSidebar"></feather-icon>
      <vs-input
          @keyup.enter="search(searchString)"
          size="large"
          class="search-input in-range"
          placeholder="Search Order ID, Tx Hash"
          v-model="searchString"
        ></vs-input>
      <vs-button
        id="search-dropdown-button"
        class="in-range"
        color="primary"
        type="filled"
        icon="search"
        @click="search(searchString)"
      ></vs-button>
			<!-- I18N -->
      <vs-dropdown vs-custom-content vs-trigger-click class="cursor-pointer currency-picker-wrapper">
        <span :class="{'blue-color': ($store.state.theme == 'light'), 'white-color': ($store.state.theme == 'dark')}" class="cursor-pointer flex i18n-locale">
          <span class="sm:block ml-2"
          style="font-weight: 500; margin-right: 0px; font-size: 15px;">
          {{ primaryCurrency.short_name }}
          </span>
          <span>
            <vs-icon class="currency-dropdown-caret" icon="expand_more"></vs-icon>
          </span>
        </span>
        <vs-dropdown-menu style="max-height:400px;overflow-y:auto;width:18rem !important;display:block;-webkit-box-align:center;align-items:center;position: fixed; top: 80px !important;">
          <vs-dropdown-item :class="{'blue-color': ($store.state.theme == 'light'), 'white-color': ($store.state.theme == 'dark')}" v-for="(currency, index) in currencies" :key="index" @click="onCurrencySelected(currency)" class="dropdown-items">{{ currency.name }}
              <span style="float:right;">{{currency.short_name}}</span>
          </vs-dropdown-item>
        </vs-dropdown-menu>
      </vs-dropdown>
		</vs-navbar>
	</div>
</div>
</template>

<script type="text/javascript">

import { mapState } from "vuex";
import DateRangePicker from 'vue2-daterange-picker'
// import SearchResults from "@/layouts/components/Modals/SearchResultsModal"
// you need to import the CSS manually (in case you want to override it)
import 'vue2-daterange-picker/dist/vue2-daterange-picker.css'

export default {
    name: "the-navbar",
    props: {
        navbarColor: {
            type: String,
            default: "#fff",
        },
        currencies: {
            default: "USD"
        }
    },
    components: {
        DateRangePicker
        // "my-search-results-modal": SearchResults
    },
    data() {
        return {
          searchString: ""
        }
    },
    created() { 
    },
    computed: {
        ...mapState({
            primaryCurrency: "primaryCurrency",
        }),
        // HELPER
        sidebarWidth() {
            return this.$store.state.sidebarWidth;
        },

        // NAVBAR STYLE
        classObj() {
            if (this.sidebarWidth == "default") return "navbar-default"
            else if (this.sidebarWidth == "reduced") return "navbar-reduced"
            else if (this.sidebarWidth) return "navbar-full"
        },

        // I18N
        getCurrentLocaleData() {
            const locale = this.$i18n.locale;
            if (locale == "en") return { flag: "us", lang: 'English' }
            else if (locale == "pt") return { flag: "br", lang: 'Portuguese' }
            else if (locale == "fr") return { flag: "fr", lang: 'French' }
            else if (locale == "de") return { flag: "de", lang: 'German' }
        }
    },
    mounted() {
      if (this.$store.state.theme == "dark") {
        document.querySelectorAll(".vs-inputx").forEach(
          (element) => {
            element.setAttribute("style", "border: 1px solid rgba(255, 255, 255, 0.1) !important;");
          }
        );
      }
    },
    watch: {
      '$route.name': function(val) {
        if (val != "query") {
          this.searchString = "";
        } else {
          this.searchString = this.$route.params.query;
        }
      }
    },
    methods: {
        async onCurrencySelected(currency) {
          await this.$store.dispatch("setPrimaryCurrency", currency);
        },
        updateLocale(locale) {
            this.$i18n.locale = locale;
        },
        showSidebar() {
            this.$store.commit('TOGGLE_IS_SIDEBAR_ACTIVE', true);
        },
        elapsedTime(startTime) {
            let x = new Date(startTime);
            let now = new Date();
            var timeDiff = now - x;
            timeDiff /= 1000;

            var seconds = Math.round(timeDiff);
            timeDiff = Math.floor(timeDiff / 60);

            var minutes = Math.round(timeDiff % 60);
            timeDiff = Math.floor(timeDiff / 60);

            var hours = Math.round(timeDiff % 24);
            timeDiff = Math.floor(timeDiff / 24);

            var days = Math.round(timeDiff % 365);
            timeDiff = Math.floor(timeDiff / 365);

            var years = timeDiff;

            if (years > 0) {
                return years + (years > 1 ? ' Years ' : ' Year ') + 'ago';
            } else if (days > 0) {
                return days + (days > 1 ? ' Days ' : ' Day ') + 'ago';
            } else if (hours > 0) {
                return hours + (hours > 1 ? ' Hrs ' : ' Hour ') + 'ago';
            } else if (minutes > 0) {
                return minutes + (minutes > 1 ? ' Mins ' : ' Min ') + 'ago';
            } else if (seconds > 0) {
                return seconds + (seconds > 1 ? `${seconds} sec ago` : 'just now');
            }

            return 'Just Now'
        },
        async search(text) {
          //transaction hash
          if (!text) {
            this.$vs.dialog({
              color: 'blue',
              title: `Empty search query`,
              text: 'Please enter a valid order ID or transaction hash',
              acceptText: 'OK'
            });
          } else {
            let path = "/search/"+text;
            this.$router.push({path: path});
          }
        }
    },
    directives: {
        'click-outside': {
            bind: function(el, binding) {
                const bubble = binding.modifiers.bubble
                const handler = (e) => {
                    if (bubble || (!el.contains(e.target) && el !== e.target)) {
                        binding.value(e)
                    }
                }
                el.__vueClickOutside__ = handler
                document.addEventListener('click', handler)
            },

            unbind: function(el) {
                document.removeEventListener('click', el.__vueClickOutside__)
                el.__vueClickOutside__ = null

            }
        }
    }
}
</script>
<style lang="scss">
.currency-dropdown-caret {
  position: relative;
  top: 3px;
}
#search-dropdown-button {
  align-self: flex-start;
  border-top-left-radius: 0 !important;
  border-bottom-left-radius: 0 !important;
  height: 50px !important;
  min-width: 50px !important;
}
.vs-con-items {
  margin-top: 10px;
}
.space-between-items {
  justify-content: space-between;
}
.vs-con-items {
  justify-content: space-between;
}


.search-input {
  height: 38px;
  flex: 2;
}

.search-input .vs-con-input .vs-input--input {
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}
.theme-dark {
  .search-input {
    .vs-con-input.vs-input--input {
      border-top-right-radius: 0 !important;
      border-bottom-right-radius: 0 !important;
      border: 1px solid rgb(255,255,255) !important;
    }
  }
}
.vs-con-input {
  position: relative;
  bottom: 6px;
}
.currency-picker-wrapper {
  border-radius: 0.5rem;
  height: 38px;
  margin-left: 10px;
  letter-spacing: 1px;
  font-size: 14px;
}
.navbar-custom {
  background: rgba(0, 0, 0, 0.025) !important;
  // padding-left: 0 !important;
}
.dropdown-items {
  padding: 6px 10px;
  font-weight: 500;
  margin-right: 0px;
  font-size: 15px;
}
.blue-color {
  color: #183185 !important;
}
.white-color {
  color: #FFFFFF !important;
}
.theme-dark {
  .in-range {
    .vs-icon {
      background: transparent !important;
      color: #fff !important;
    }
  }
}
.vs-circle-switch.vs-switch--circle {
  width: 12px !important;
  height: 12px !important;
}
.vs-switch {
  height: 16px !important;
  width: 16px !important;
}
</style>
<style scoped lang="scss">
  .vx-navbar-wrapper {
    top: 10px;
  }
</style>