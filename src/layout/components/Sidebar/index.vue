<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        background-color="#fff"
        text-color="#606266"
        :unique-opened="false"
        active-text-color="#fff"
        :collapse-transition="false"
        mode="vertical" class="bold">
        <sidebar-item v-for="route in permission_routes" :key="route.path" :item="route" :base-path="route.path" />
        <!--<sidebar-item v-for="route in $router.options.routes" :key="route.path" :item="route" :base-path="route.path" />-->
      </el-menu>

    </el-scrollbar>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Logo from './Logo'
  import SidebarItem from './SidebarItem'
  import variables from '@/styles/variables.scss'

  export default {
    components: { SidebarItem, Logo },
    computed: {
      ...mapGetters([
        'permission_routes',
        'sidebar'
      ]),
      activeMenu() {

        const route = this.$route
        const { meta, path } = route
        // if set path, the sidebar will highlight the path you set
        if (meta.activeMenu) {
          return meta.activeMenu
        }
        return path
      },
      showLogo() {
        return this.$store.state.settings.sidebarLogo
      },
      variables() {
        return variables
      },
      isCollapse() {
        return !this.sidebar.opened
      }
    }
  }
</script>
