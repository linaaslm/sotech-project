<template>
  <div class="wrapper">
    <side-bar>
      <template slot="links">
        <sidebar-link v-for="(item, index) in menu"
          :key="index" :to="item.path" :name="item.name" :icon="item.icon" />
      </template>
    </side-bar>
    <div class="main-panel">
      <top-navbar></top-navbar>

      <dashboard-content @click.native="toggleSidebar">

      </dashboard-content>

      <content-footer></content-footer>
    </div>
  </div>
</template>
<style lang="scss">
</style>
<script>
import TopNavbar from "./TopNavbar.vue";
import ContentFooter from "./ContentFooter.vue";
import DashboardContent from "./Content.vue";
import MobileMenu from "./MobileMenu";
import dataMenu from "../../config/menu";
export default {

  components: {
    TopNavbar,
    ContentFooter,
    DashboardContent,
    MobileMenu
  },

  data () {
    return {
      menu: dataMenu,
    }
  },

  methods: {
    toggleSidebar() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.displaySidebar(false);
      }
    }
  }
};
</script>
