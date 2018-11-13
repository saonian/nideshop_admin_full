<template>
  <div class="wrapper fixed">
    <imp-header></imp-header>
    <side-menu></side-menu>
    <div class="content-wrapper" :class="{ slideCollapse: sidebar.collapsed,mobileSide:device.isMobile}">
      <el-scrollbar tag="div" wrapClass="content-scrollbar">
        <section class="content">
          <transition mode="out-in" enter-active-class="fadeIn" leave-active-class="fadeOut" appear>
            <router-view></router-view>
          </transition>
          <imp-footer></imp-footer>
        </section>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import {sideMenu, header, footer} from './index'
import {mapGetters, mapActions, mapMutations} from 'vuex'

export default {
  name: 'app',
  components: {
    sideMenu,
    impFooter: footer,
    impHeader: header
  },
  computed: {
    ...mapGetters({
      sidebar: 'sidebar',
      device: 'device',
      currentMenus: 'currentMenus'
    })
  },
  data: function () {
    return {
      active: true,
      headerFixed: true,
      breadcrumb: []
    }
  },
  methods: {
    ...mapMutations({
      toggleDevice: 'TOGGLE_DEVICE',
      toggleSidebar: 'TOGGLE_SIDEBAR',
      toggleSidebarShow: 'TOGGLE_SIDEBAR_SHOW'
    }),
    ...mapActions({
      changeCurrentMenu: 'changeCurrentMenu' // 映射 this.changeCurrentMenu() 为 this.$store.dispatch('changeCurrentMenu')
    })
  },
  watch: {
    '$route': function (to, from) {
    }
  },
  beforeMount () {
    const { body } = document
    const WIDTH = 784
    const handler = () => {
      if (!document.hidden) {
        let rect = body.getBoundingClientRect()
        let isMobile = rect.width < WIDTH
        this.toggleDevice(isMobile)
        if (isMobile) {
          this.toggleSidebarShow(false)
          this.toggleSidebar(false)
        } else {
          this.toggleSidebarShow(true)
        }
      }
    }
    document.addEventListener('visibilitychange', handler)
    window.addEventListener('DOMContentLoaded', handler)
    window.addEventListener('resize', handler)
  },
  mounted () {

  }
}

</script>

<style>

  .animated {
    animation-duration: .2s;
  }

  blockquote, body, dd, dl, dt, fieldset, figure, h1, h2, h3, h4, h5, h6, hr, html, iframe, legend, li, ol, p, pre, textarea, ul {
    margin: 0;
    padding: 0;
  }

  *,:after, :before {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  .content-wrapper {
    -webkit-transition: -webkit-transform 0.3s ease-in-out, margin 0.3s ease-in-out;
    -moz-transition: -moz-transform 0.3s ease-in-out, margin 0.3s ease-in-out;
    -o-transition: -o-transform 0.3s ease-in-out, margin 0.3s ease-in-out;
    transition: transform 0.3s ease-in-out, margin 0.3s ease-in-out;
    margin-left: 230px;
    padding-top: 50px;
  }

  .content-scrollbar{
    height: calc(100vh - 50px);
  }

  .content-wrapper .el-scrollbar__bar.is-vertical{
    display: none;
  }

  .content-wrapper .content {
    padding: 0.9rem;
  }

  .content-wrapper.slideCollapse{
    margin-left: 55px;
  }

  .content-wrapper.mobileSide{
    margin-left: 0px;
  }

</style>
