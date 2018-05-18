<template>
  <div>
    <full-calendar :config="config"
                   :selectable="false"
                   :editable="false"
                   :events="store.events"
                   @event-selected="onClick"/>
  </div>
</template>
<script>
import { FullCalendar } from "vue-full-calendar";
import "fullcalendar/dist/locale/fr";
import store from "../config/store";

export default {
  components: {
    FullCalendar
  },

  data() {
    return {
      store,
      config: {
        locale: 'fr',
      }
    };
  },

  methods: {
    onClick (event) {
      store.modal.active = true
      store.modal.component = 'event-detail'
      store.modal.value = event.id
    }
  }
};
</script>
<style>
    @import '~fullcalendar/dist/fullcalendar.css';
</style>
