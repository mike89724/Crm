<!-- =========================================================================================
    File Name: VxSidebar.vue
    Description: Sidebar Component
    Component Name: VxSidebar
    ----------------------------------------------------------------------------------------
    Item Name: Vuesax Admin - VueJS Dashboard Admin Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
    <div class="parentx">
        <vs-sidebar ref="mainSidebar" :parent="parent" :hiddenBackground="clickNotClose" :reduce="reduce" default-index="-1" class="sidebarx main-menu-sidebar items-no-padding" v-model="isSidebarActive" :click-not-close="clickNotClose" :reduce-not-rebound="reduceNotRebound">
            <div @mouseenter="sidebarMouseEntered" @mouseleave="sidebarMouseLeave">
                <div class="header-sidebar flex items-end justify-between" slot="header">
                    <div class="logo flex items-center">

      <!-- PROFILE EDIT DIALOG BOX -->
                      <vs-prompt
                        vs-title="Edit Profile"
                        :vs-active.sync="editProfileActive"
                        accept-text="Save"
                        @accept="acceptProfile"
                      >
                        <div class="prompt-dialog">
                          <div class="flex justify-center align-center">
                            <img
                              v-if="activeUserImg.startsWith('http')"
                              key="onlineImg"
                              :src="activeUserImg"
                              alt="user-img"
                              width="80"
                              height="80"
                              class="rounded-full shadow-md cursor-pointer inline profile-pic" />
                            <img
                              v-else
                              key="localImg"
                              :src="require(`@/assets/images/portrait/small/${activeUserImg}`)"
                              alt="user-img"
                              width="80"
                              height="80"
                              class="rounded-full shadow-md cursor-pointer inline profile-pic" /><span class="leading-12">&nbsp;{{userName}}</span>
                          </div>
                          <div class="flex justify-between">
                            <div class="w-5/12">
                              <div class="p-2">First Name</div>
                              <input class="form-control shadow border-gray-100 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" v-model="firstName"/>
                            </div>
                            <div class="w-5/12">
                              <div class="p-2">Last Name</div>
                              <input class="form-control shadow border-gray-100 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" v-model="lastName"/>
                            </div>
                          </div>
                          <div>
                            <div class="p-2">E-mail</div>
                            <input class="form-control shadow border-gray-100 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" v-model="email" v-validate="'required|email'"/>
                          </div>
                          <div>
                            <div class="p-2">Contact Number</div>
                            <input class="form-control shadow border-gray-100 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" v-validate="'required|digits:10'" v-model="contactNumber"/>
                          </div>
                        </div>
                      </vs-prompt>
                      <vs-dropdown  vs-custom-content vs-trigger-click class="cursor-pointer">
                        <div class="con-img ml-10 flex">
                          <img
                            v-if="activeUserImg.startsWith('http')"
                            key="onlineImg"
                            :src="activeUserImg"
                            alt="user-img"
                            width="40"
                            height="40"
                            class="rounded-full shadow-md cursor-pointer block" />
                          <img
                            v-else
                            key="localImg"
                            :src="require(`@/assets/images/portrait/small/${activeUserImg}`)"
                            alt="user-img"
                            width="40"
                            height="40"
                            class="rounded-full shadow-md cursor-pointer block" />
                            <div class="ml-4 mt-4">{{userName}}</div>
                        </div>
                        <vs-dropdown-menu style="z-index: 9999999;" class="dropdown-menu-right ml-5">
                          <ul style="min-width: 9rem">
                            <li class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white" @click="editProfileActive = !editProfileActive"><feather-icon icon="UserIcon" svgClasses="w-4 h-4"></feather-icon> <span class="ml-2">Profile</span></li>
                            <li class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white" @click="$router.push('/apps/todo')"><feather-icon icon="CheckSquareIcon" svgClasses="w-4 h-4"></feather-icon> <span class="ml-2">History</span></li>
                            <vs-divider class="m-1"></vs-divider>
                            <li class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white" @click="logout"><feather-icon icon="LogOutIcon" svgClasses="w-4 h-4"></feather-icon> <span class="ml-2">Logout</span></li>
                          </ul>
                        </vs-dropdown-menu>
                      </vs-dropdown>
                    </div>
                    <div>
                        <template v-if="showCloseButton">
                            <feather-icon icon="XIcon" class="m-0 cursor-pointer" @click="$store.commit('TOGGLE_IS_SIDEBAR_ACTIVE', false)"></feather-icon>
                        </template>
                        <!-- <template v-else-if="!showCloseButton && !sidebarItemsMin">
                            <feather-icon icon="DiscIcon" class="mr-0 cursor-pointer" svg-classes="stroke-current" v-show="!reduce" @click="toggleReduce(true)" id="btnSidebarToggler"></feather-icon>
                            <feather-icon icon="CircleIcon" class="mr-0 cursor-pointer" svg-classes="stroke-current" v-show="reduce" @click="toggleReduce(false)" id="btnSidebarToggler"></feather-icon>
                        </template> -->
                    </div>
                </div>

                <div class="shadow-bottom" v-show="showShadowBottom"></div>

                <VuePerfectScrollbar ref="mainSidebarPs" class="scroll-area--main-sidebar scroll-flex-center pt-2" :settings="settings" @ps-scroll-y="psSectionScroll">
                  <div class="top-items">
                    <template v-for="(sidebarItem, index) in updatedSidebarItems">
                    <!-- GROUP ITEM HEADER -->
                      <span :key="`header-${index}`" v-if="sidebarItem.header && !sidebarItemsMin" class="navigation-header truncate">{{ $t(sidebarItem.i18n) || sidebarItem.header }}</span>
                      <template v-else-if="!sidebarItem.header">

                          <!-- IF IT'S SINGLE ITEM -->
                          <vx-sidebar-item ref="sidebarLink" :featherIcon="sidebarItem.featherIcon" :key="`sidebarItem-${index}`" v-if="!sidebarItem.submenu" :index="index" :to="sidebarItem.slug != 'external' ? sidebarItem.url : ''" :href="sidebarItem.slug == 'external' ? sidebarItem.url : ''" :icon="sidebarItem.icon" :target="sidebarItem.target" :isDisabled="sidebarItem.isDisabled">
                              <span v-show="!sidebarItemsMin" class="truncate capitalize">{{ $t(sidebarItem.i18n) || sidebarItem.name }}</span>
                              <vs-chip class="ml-auto" :color="sidebarItem.tagColor" v-if="sidebarItem.tag && (isMouseEnter || !reduce)">{{ sidebarItem.tag }}</vs-chip>
                          </vx-sidebar-item>

                          <!-- IF HAVE SUBMENU / DROPDOWN -->
                          <template v-else>
                              <vx-sidebar-group ref="sidebarGrp" :key="`group-${index}`" :openHover="openGroupHover" :group="sidebarItem" :groupIndex="index" :open="isGroupActive(sidebarItem)"></vx-sidebar-group>
                          </template>
                      </template>
                    </template>
                  </div>
                  <div class="footer-box-style">
                    <!-- <template> -->
                      <vs-row vs-type="flex" vs-justify="flex-start" style="padding: 10px 0 10px 7px;">
                        <vs-col style="display: flex; justify-content: center; margin-left: 1%; padding-left: 15px;" vs-w="2">
                          <vx-tooltip style="padding-top: 2px;" :text="(theme)?'Dark': 'Light'">
                            <vs-switch class="in-range" v-model="theme"/>
                          </vx-tooltip>
                        </vs-col>
                        <vs-col style="display: flex; justify-content: center; margin-left: 14px; padding-left: 40px;" vs-w="3">
                          <label style="font-size: 15px; cursor: pointer;" @click="toggleDarkMode" for="">Dark Mode</label>
                        </vs-col>
                      </vs-row>
                    <!-- </template> -->
                  </div>
                </VuePerfectScrollbar>
            </div>
        </vs-sidebar>
    </div>
</template>

<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import VxSidebarGroup from './VxSidebarGroup.vue';
import VxSidebarItem  from './VxSidebarItem.vue';

export default {
    name: 'vx-sidebar',
    props: {
        footerItems: {
            type: Array,
            required: true
        },
        sidebarItems: {
            type: Array,
            required: true,
        },
        title: {
            type: String,
        },
        logo: {
            type: String
        },
        parent: {
            type: String
        },
        openGroupHover: {
            type: Boolean,
            default: false
        },
        reduceNotRebound: {
            type: Boolean,
            default: true,
        }
    },
    data: () => ({
        editProfileActive: false,
        firstName: "",
        activePrompt: false,
        promtShown: false,
        lastName: "",
        email: "",
        contactNumber: "",
        clickNotClose: false, // disable close sidebar on outside click
        reduce: false, // determines if sidebar is reduce - component property
        showCloseButton: false, // show close button in smaller devices
        isMouseEnter: false,
        settings: { // perfectscrollbar settings
            maxScrollbarLength: 60,
            wheelSpeed: 1,
            swipeEasing: true
        },
        windowWidth: window.innerWidth, //width of windows
        showShadowBottom: false,
    }),
    computed: {
        userName() {
          return JSON.parse(localStorage.getItem('userInfo')).displayName;
        },
        userName() {
          return JSON.parse(localStorage.getItem('userInfo')).displayName
        },
        activeUserImg() {
            return JSON.parse(localStorage.getItem('userInfo')).photoURL || this.$store.state.AppActiveUser.img;
        },
        theme: {
          get: function() {
            if (this.$store.state.theme == "dark") {
              return true;
            } else {
              return false;
            }
          },
          set(val) {
            if (val == true)
              this.$store.dispatch('updateTheme', "dark");
            else
              this.$store.dispatch('updateTheme', "light");
          }
        },
        pusher: {
          get() {
            return this.$store.state.pusher;
          },
          set(val) {
            this.$store.dispatch("togglePusher", val);
          }
        },
        isSidebarActive: {
            get() {
                return this.$store.state.isSidebarActive
            },
            set(val) {
              this.$store.commit('TOGGLE_IS_SIDEBAR_ACTIVE', val)
            }
        },
        reduceSidebar() {
            return Boolean(this.reduce && this.reduceButton)
        },
        reduceButton: {
            get() {
                return this.$store.state.reduceButton;
            },
            set(val) {
                this.$store.commit('TOGGLE_REDUCE_BUTTON', val)
            }
        },
        sidebarItemsMin() {
            return this.$store.state.sidebarItemsMin;
        },
        isGroupActive() {
            return (sidebarItem) => {
                const path = this.$route.fullPath;
                let open = false;
                let func = function(sidebarItem) {
                    if (sidebarItem.submenu) {
                        sidebarItem.submenu.forEach((item) => {
                            if (path == item.url) { open = true }
                            else if (item.submenu) { func(item) }
                        })
                    }
                }
                func(sidebarItem)
                return open
            }
        },
        updatedSidebarItems() {
          return this.sidebarItems;
        },
        updatedFooterItems() {
          return this.footerItems;
        }
    },
    watch: {
        reduce(val) {

            if (val == true) {
                this.$store.dispatch('updateSidebarWidth', 'reduced');

            } else {
                this.$store.dispatch('updateSidebarWidth', 'default');
            }

            setTimeout(function(){
                window.dispatchEvent(new Event('resize'));
            }, 100);
        },
        reduceButton() {
            this.setSidebarWidth();
        },
        '$route'() {
            if(this.isSidebarActive && this.showCloseButton) this.$store.commit('TOGGLE_IS_SIDEBAR_ACTIVE', false);
        }
    },
    methods: {
      logout() {
        // if user is logged in via auth0
        if (this.$auth.profile) this.$auth.logOut();

        // if user is looged in via firebase
        const firebaseCurrentUser = firebase.auth().currentUser

        if (firebaseCurrentUser) {
            firebase.auth().signOut().then(() => {
                this.$router.push('/pages/login')
                localStorage.removeItem('userInfo');
            })
        }
        // Change role on logout. Same value as initialRole of acj.js
        this.$acl.change('admin')
        localStorage.removeItem('userRole');
        },
      toggleLiveData() {
        this.$store.dispatch("togglePusher", !this.$store.state.pusher);
      },
      toggleDarkMode() {
        if (this.$store.state.theme == "dark") {
          this.$store.dispatch("updateTheme", "light");
        } else {
          this.$store.dispatch("updateTheme", "dark");
        }
      },
      openHomeRoute() {
        this.$router.push({ path: "/"});
      },
      sidebarMouseEntered() {
          if (this.reduce) this.$store.commit('UPDATE_SIDEBAR_ITEMS_MIN', false)
          this.isMouseEnter = true;
      },
      sidebarMouseLeave() {
          if (this.reduce) {
              this.$store.commit('UPDATE_SIDEBAR_ITEMS_MIN', true);
          }
          this.isMouseEnter = false;
      },
      toggleReduce(val) {
          this.reduceButton = val;
          this.setSidebarWidth();
      },
      handleWindowResize(event) {
          this.windowWidth = event.currentTarget.innerWidth;
          this.setSidebarWidth();
      },
      setSidebarWidth() {
          if (this.windowWidth < 1200) {
              if(this.windowWidth < 992) this.$store.commit('UPDATE_WINDOW_BREAKPOINT', 'md')
              else this.$store.commit('UPDATE_WINDOW_BREAKPOINT', 'lg')

              this.$store.commit('TOGGLE_IS_SIDEBAR_ACTIVE', false)
              if (this.reduceButton) this.reduce = false;
              // this.reduceButton = false;
              this.showCloseButton = true;
              this.clickNotClose = false;
              this.$store.dispatch('updateSidebarWidth', 'no-sidebar')
              this.$store.commit('UPDATE_SIDEBAR_ITEMS_MIN', false)
          }
          else {
              this.$store.commit('UPDATE_WINDOW_BREAKPOINT', 'xl')
              if (this.reduceButton) this.reduce = true;
              else this.reduce = false;

              this.$store.commit('TOGGLE_IS_SIDEBAR_ACTIVE', true)
              if (this.reduceButton && !this.isMouseEnter) this.$store.commit('UPDATE_SIDEBAR_ITEMS_MIN', true)
              else this.$store.commit('UPDATE_SIDEBAR_ITEMS_MIN', false)

              this.clickNotClose = true;
              this.showCloseButton = false;
              if (this.reduceSidebar)
                  this.$store.dispatch('updateSidebarWidth', 'reduced')
              else
                  this.$store.dispatch('updateSidebarWidth', 'default')
          }
      },
      psSectionScroll() {
          if(this.$refs.mainSidebarPs.$el.scrollTop > 0) this.showShadowBottom = true;
          else this.showShadowBottom = false;
      }
    },
    components: {
        VxSidebarGroup,
        VxSidebarItem,
        VuePerfectScrollbar,
    },
    mounted() {
        // this.activePrompt = true;
        // this.promtShown = true;
        this.$nextTick(() => {
            window.addEventListener('resize', this.handleWindowResize);
        });
        this.setSidebarWidth();
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.handleWindowResize);
    },
}
</script>

<style lang="scss">
@import "@/assets/scss/vuesax/components/vxSidebar.scss";
.logo-custom {
  width: 30%;
  position: relative;
  top: 10px;
  margin: auto;
}
.scroll-flex-center {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
@media only screen and (max-height: 600px) {
  .logo-custom {
    width: 45%;
    position: relative;
    top: 10px;
    margin: auto;
  }
  .vs-sidebar-item {
    height: 32px !important;
  }
}
@media only screen and (max-height: 600px) {
  .footer-box-style {
    margin: 8px 16px 8px;
    display: flex;
    flex-direction: column;
  }
}
.footer-box-style {
  margin: 32px 16px 0;
  display: flex;
  height: auto;
  padding-bottom: 50px;
  flex-direction: column;
}
.top-items {
  margin: 0 16px;
}
#btnSidebarToggler {
  position: relative;
  bottom: 25px;
}
.left {
  position: relative;
  right: 10px;
}
.vs-switch {
  min-width: 30px !important;
  width: 30px !important;
}
.vs-switch-active {
  .vs-circle-switch.vs-switch--circle {
    left: 8px;
  }
}
</style>