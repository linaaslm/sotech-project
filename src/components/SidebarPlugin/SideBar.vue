<template>
  <div class="sidebar"
       data-background-color="black"
       data-active-color="success">
    <div class="sidebar-wrapper" id="style-3">
      <div class="logo">
        <a href="#" class="simple-text" @click.prevent.stop="$router.push('/dashboard')">
            <div>
              {{ fullName }}
            </div>
        </a>
      </div>
      <slot>

      </slot>
      <ul class="nav">
        <slot name="links">

        </slot>
      </ul>
    </div>
  </div>
</template>
<script>
import store from '../../config/store';
export default {

  data() {
    return {
      store,
      linkHeight: 65,
      activeLinkIndex: 0,
      windowWidth: 0,
      isWindows: false,
      hasAutoHeight: false,
      links: []
    };
  },

  computed: {
    fullName () {
      return store.user.first_name + ' ' + store.user.last_name
    },

    arrowMovePx () {
      return this.linkHeight * this.activeLinkIndex;
    }
  },

  methods: {
    findActiveLink() {
      this.links.forEach((link, index) => {
        if (link.isActive()) {
          this.activeLinkIndex = index;
        }
      });
    },
    addLink(link) {
      const index = this.$slots.links.indexOf(link.$vnode);
      this.links.splice(index, 0, link);
    },
    removeLink(link) {
      const index = this.links.indexOf(link);
      if (index > -1) {
        this.links.splice(index, 1);
      }
    }
  },
  mounted() {
    this.$watch("$route", this.findActiveLink, {
      immediate: true
    });
  }
};
</script>
<style>
</style>
