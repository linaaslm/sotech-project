<template>
    <div>
        <span style="display:block; text-align: right;"
              @click="store.modal.active = false">✖</span>
        <card class="card" title="Ajouter un évenement" style="box-shadow: none;">
            <div>
                <form>
                    <div class="row">
                        <div class="col-md-5">
                            <p>Évenement</p>
                            <select v-model="event.type" class="form-control border">
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
                                   v-model="event.title">
                        </div>
                        <div class="col-md-2" v-if="event.type === 'Examen'">
                            <p>Coefficient</p>
                            <input type="number" step="any"
                                   class="form-control border"
                                   placeholder="Ex: 3"
                                   v-model="event.coefficient">
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-6 form-control">
                            <p>Début</p>
                            <datetime input-class="form-control border"
                                      v-model="event.start"
                                      type="datetime"
                                      class="theme" />
                        </div>
                        <div class="col-md-6">
                            <p>Fin</p>
                            <datetime input-class="form-control border"
                                      v-model="event.end"
                                      type="datetime"
                                      class="theme" />
                        </div>
                    </div>

                    <div class="text-center" style="padding-top: 10px;">
                        <button class="btn btn-default"
                                @click.prevent.stop="store.modal.active = false">Annuler</button>
                        <button class="btn btn-green" @click.prevent.stop="addEvent"
                                :disabled="disabled">Ajouter</button>
                    </div>
                    <div class="clearfix"></div>
                </form>
            </div>
        </card>
    </div>
</template>

<script>
  import store from '../../config/store';
  import { Datetime } from 'vue-datetime';
  import { Settings } from 'luxon';
  import 'vue-datetime/dist/vue-datetime.css';
  import moment from 'moment';

  export default {

    components: {
      Datetime
    },

    data () {
      return {
        store,
        event: {
          type: null,
          title: '',
          start: '',
          end: '',
          coefficient: '',
        }
      }
    },

    computed: {
      disabled () {
        return (!this.event.type || !this.event.title || !this.event.start || !this.event.end || (this.event.type === 'Examen' && this.event.coefficient === ''))
      }
    },

    mounted () {
      Settings.defaultLocale = 'fr'
    },

    methods: {
      addEvent () {
        this.event.id = Date.now()//add id
        this.event.hasDocuments = false
        this.event.pointsRetard = 0
        this.event.textColor = 'white'

        switch (this.event.type) {
          case 'Examen':
            this.event.color = '#42b883'
            break
          case 'Courses':
            this.event.color = '#ffc502'
            break
        }

        this.event.start = moment(this.event.start).format('YYYY-MM-DDTHH:mm')
        this.event.end = moment(this.event.end).format('YYYY-MM-DDTHH:mm')
        store.events.push(this.event)

        localStorage.setItem(store.localKey, JSON.stringify(store))

        store.modal.active = false
      }
    }
  }
</script>

<style>
    .btn-green {
        background-color: #42b883;
        border-color: #42b883;
        margin-left: 15px;
    }

    .theme .vdatetime-popup__header,
    .theme .vdatetime-calendar__month__day--selected > span > span,
    .theme .vdatetime-calendar__month__day--selected:hover > span > span {
        background: #42b883;
    }

    .theme .vdatetime-year-picker__item--selected,
    .theme .vdatetime-time-picker__item--selected,
    .theme .vdatetime-popup__actions__button {
        color: #42b883;
    }
</style>
