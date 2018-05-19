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
      <h3>Emploi du temps proposé :</h3>
      <br>
      <full-calendar :config="config"
                     :selectable="false"
                     :editable="false"
                     :events="suggestedSchedule"/>
  </div>
</template>
<script>

import store from "../config/store"
import moment from "moment"
import { FullCalendar } from "vue-full-calendar";
import "fullcalendar/dist/locale/fr";

export default {
  components: {
    FullCalendar
  },

  data() {
    return {
      store,
      config: {
        locale: 'fr',
      },
      suggestedSchedule: []
    }
  },

  mounted() {
    this.suggestedSchedule = JSON.parse(JSON.stringify(store.events))
    if (!store.selectedEvents.length) {
      this.$router.push('/dashboard')
    }

    let m = moment()
    let nextHour = m.minute() || m.second() || m.millisecond() ? m.add(1, 'hour').startOf('hour') : m.startOf('hour')
    //TODO switcher la date au lendemain 10h si l'heure de début de matière dépasse 22h30.
    for (let j = 0; j < store.selectedEvents.length; j++) {
      let event = store.selectedEvents[j]

        for (let i = 0; i < 96; i++) { //Recherche d'horaire dispo sur 96 tranches de 30 minutes soit 2 jours
          if ((nextHour.get('hour') >= 0 && nextHour.get('hour') < 9) || nextHour.get('hour') === 23) {
            let hoursToSubstract = nextHour.get('hour') === 23 ? -1 : nextHour.get('hour')
            nextHour.add(10 - hoursToSubstract, 'hours') //On ajoute des heures si il est entre 23h et 8h59
          }
          if(!this.isScheduleTaken(event, nextHour)){
            let newEvent = {
              title: 'Révisions ' + event.title,
              start: nextHour.format('YYYY-MM-DDTHH:mm'),
              end: nextHour.add(event.workHours, 'hours').format('YYYY-MM-DDTHH:mm'),
              textColor: 'white',
              color: '#FF0000'
            }
            nextHour.add(30, 'minutes')
            this.suggestedSchedule.push(newEvent)
            break
          } else {
            nextHour.add(30, 'minutes')
          }

        }
    }
  },

  methods: {
    getHoursEstimated(event) {
      let message = event.workHours === 1 ? ' heure de révisions estimée' : ' heures de révisions estimées'
      return event.workHours + message
    },

    isScheduleTaken(event, startDate) {
      let schedule = JSON.parse(JSON.stringify(this.suggestedSchedule))
      for (let i = 0; i < schedule.length; i++) {
        let value = schedule[i]

        if ((moment(startDate).isAfter(value.start) && moment(startDate).clone().add(event.workHours, 'hours').isBefore(value.end))
          || (moment(startDate).isBefore(value.start) && moment(startDate).clone().add(event.workHours, 'hours').isAfter(value.end))
          || (moment(startDate).isAfter(value.start) && moment(startDate).isBefore(value.end))
          || (moment(startDate).clone().add(event.workHours, 'hours').isAfter(value.start) && moment(startDate).clone().add(event.workHours, 'hours').isBefore(value.end))
        )
        {
          return true
        }
      }
      return false
    }
  }
}
</script>
