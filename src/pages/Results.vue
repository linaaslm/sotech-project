<template>
  <div>
      <h3>Ordre de priorité des révisions :</h3>
      <br>
      <div class="row">
          <div class="col-md-4" v-for="(event, index) in store.selectedEvents">
              <div class="card">
                  <div class="card-body">
                      <div class="row">
                          <div class="col-2">
                              <div class="icon-big text-center icon-warning">
                                  {{ index+1 }}
                              </div>
                          </div>
                          <div class="col-10">
                              <div class="numbers">
                                  <h6 style="margin-bottom: 10px;">{{ event.title }}</h6>
                                  <p>{{ getHoursEstimated(event) }}</p>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  </div>
</template>
<script>

import store from "../config/store";

export default {
  components: {

  },

  data() {
    return {
      store,

    }
  },

  mounted () {
    if (!store.selectedEvents.length) {
      this.$router.push('/dashboard')
    }
  },

  methods: {
    getHoursEstimated (event) {
      let message = event.workHours === 1 ? ' heure de révisions estimée' : ' heures de révisions estimées'
      return event.workHours + message
    }
  }
};
</script>
