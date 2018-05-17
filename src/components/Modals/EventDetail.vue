<template>
    <div>
        <span style="display:block; text-align: right;"
              @click="store.modal.active = false">✖</span>
        <card class="card" title="Détail de l'évenement" style="box-shadow: none;">
            <div>
                <form>
                    <div class="row">
                        <div class="col-md-5">
                            <p>Évenement</p>
                            <select v-model="event.type" class="form-control border" disabled>
                                <option :value="null" disabled>Choisir un évenement ...</option>
                                <option>Examen</option>
                                <option>Courses</option>
                                <option>Autre</option>

                            </select>
                        </div>
                        <div :class="[event.type === 'Examen' ? 'col-md-5' : 'col-md-7']">
                            <p>Intitulé</p>
                            <input type="text"
                                   class="form-control border"
                                   placeholder="Intitulé..."
                                   v-model="event.title" disabled>
                        </div>
                        <div class="col-md-2" v-if="event.type === 'Examen'">
                            <p>Coefficient</p>
                            <input type="number" step="any"
                                   class="form-control border"
                                   placeholder="Ex: 3"
                                   v-model="event.coefficient" disabled>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-6 form-control">
                            <p>Début</p>
                            <input type="text"
                                   class="form-control border"
                                   placeholder="Intitulé..."
                                   :value="startDate" disabled>
                        </div>
                        <div class="col-md-6">
                            <p>Fin</p>
                            <input type="text"
                                   class="form-control border"
                                   placeholder="Intitulé..."
                                   :value="endDate" disabled>
                        </div>
                    </div>

                    <div class="text-right" style="padding-top: 10px;">
                        <button class="btn btn-red"
                                @click.prevent.stop="deleteEvent">Supprimer</button>
                    </div>
                    <div class="clearfix"></div>
                </form>
            </div>
        </card>
    </div>
</template>

<script>
  import store from '../../config/store';
  import moment from 'moment';

  export default {

    data () {
      return {
        store,
        eventId: store.modal.value
      }
    },

    computed: {
      startDate () {
        return moment(this.event.start).format('DD/MM/YYYY à HH:mm')
      },

      endDate () {
        return moment(this.event.end).format('DD/MM/YYYY à HH:mm')
      },

      event () {
        return store.events.filter(event => event.id === this.eventId)[0]
      }
    },


    methods: {
      deleteEvent () {
        let index = -1

        for (let i = 0; i < store.events.length; i++) {
          if (store.events[i].id === this.event.id) {
            index = i
          }
        }

        if (index !== -1) {
          store.events.splice(index, 1)
        }


        localStorage.setItem(store.localKey, JSON.stringify(store))
        store.modal.active = false
      }
    }
  }
</script>

<style scoped>

    .btn-red {
        background-color: #ff6347;
        border-color: #ff6347;
    }

</style>