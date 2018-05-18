<template>
  <div>
    <h3>Étape 1 : Choisir une période à optimiser</h3>
    <card class="card" style="z-index: 1000;">
        <div>
            <form>
                <div class="row">
                    <div class="col-md-4">
                        <p>Début de période</p>
                        <datetime input-class="form-control border"
                                  v-model="date.start"
                                  type="date"
                                  class="theme" />
                    </div>
                    <div class="col-md-4">
                        <p>Fin de période</p>
                        <datetime input-class="form-control border"
                                  v-model="date.end"
                                  type="date"
                                  class="theme" />
                    </div>
                    <div class="col-md-3">
                        <p>&nbsp;</p>
                        <button class="btn btn-darkgrey btn-block"
                                :disabled="!date.start || !date.end"
                                @click.prevent.stop="onChoseDate">Suivant&nbsp;&nbsp;&nbsp;<span class="ti-arrow-right"/></button>
                    </div>
                </div>
            </form>
        </div>
    </card>
    <br>
    <transition-group name="list">
        <h3 v-if="store.selectedEvents.length" :key="'title'">Etape 2 : Renseignez vos réponses</h3>
        <div v-if="store.selectedEvents.length" v-for="(event, index) in store.selectedEvents" :key="index">
            <card class="card" :title="event.title">
                <br>
                <div class="row">
                    <div class="col-md-6">
                        <p>Difficulté estimée :</p>
                        <vue-slider v-model="event.score.difficulte"
                                    :tooltip="'hover'"
                                    :lazy="true"
                                    :min="1"
                                    :max="10"
                                    :interval="1"
                                    :process-style="{'backgroundColor': '#42b883'}"
                                    :tooltip-style="{'backgroundColor': '#42b883', 'borderColor': '#42b883'}"/>
                    </div>
                    <div class="col-md-6">
                        <p>Avancement dans les révisions :</p>
                        <vue-slider v-model="event.score.avancement"
                                    :tooltip="'hover'"
                                    :lazy="true"
                                    :min="1"
                                    :max="10"
                                    :interval="1"
                                    :process-style="{'backgroundColor': '#42b883'}"
                                    :tooltip-style="{'backgroundColor': '#42b883', 'borderColor': '#42b883'}"/>
                    </div>
                </div>
                <br>
                <div class="row">
                    <div class="col-md-6">
                        <p>Assiduité sur la matière :</p>
                        <vue-slider v-model="event.score.assiduite"
                                    :tooltip="'hover'"
                                    :lazy="true"
                                    :min="1"
                                    :max="10"
                                    :interval="1"
                                    :process-style="{'backgroundColor': '#42b883'}"
                                    :tooltip-style="{'backgroundColor': '#42b883', 'borderColor': '#42b883'}"/>
                    </div>
                    <div class="col-md-3">
                        <p>Document autorisés :</p>
                        <toggle-button v-model="event.hasDocuments"
                                       :color="{checked: '#444444', unchecked: '#cccccc'}"
                                       :height="30"
                                       :width="65"/>&nbsp;&nbsp;&nbsp;&nbsp;<span>{{ event.hasDocuments ? 'Oui' : 'Non' }}</span>
                    </div>
                    <div class="col-md-3">
                        <p>Points à rattraper :</p>
                        <select class="form-control border" v-model="event.pointsRetard">
                            <option>0</option>
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                            <option>6</option>
                            <option>7</option>
                            <option>8</option>
                            <option>9</option>
                            <option>10</option>
                        </select>
                    </div>
                </div>
            </card>
        </div>
        <div class="col-md-12 text-right"
             v-if="store.selectedEvents.length"
             :key="'optimize'">
            <button class="btn btn-darkgrey col-md-3" @click.prevent.stop="optimizeSchedule">Optimiser&nbsp;&nbsp;&nbsp;<span class="ti-arrow-right"/></button>
        </div>
    </transition-group>
  </div>
</template>

<script>
  import store from '../config/store'
  import moment from 'moment'
  import { Datetime } from 'vue-datetime'
  import { Settings } from 'luxon'
  import vueSlider from 'vue-slider-component'
  import ToggleButton from 'vue-js-toggle-button/src/Button'

  export default {

    components: {
      Datetime,
      vueSlider,
      ToggleButton
    },

    data () {
      return {
        store,
        date: {
          start: '',
          end: ''
        },
        score: {
          interet: 5,
          avancement: 5,
          difficulte: 5,
          assiduite: 5
        }
      }
    },

    mounted () {
      Settings.defaultLocale = 'fr'
      store.selectedEvents = JSON.parse(JSON.stringify(store.events))
      store.selectedEvents.forEach(event => {
        event.score = JSON.parse(JSON.stringify(this.score))
        //console.log(moment(event.start).diff(moment(), 'days'))
      })
    },

    methods: {
      onChoseDate () {
        store.selectedEvents = []

        store.events.forEach(event => {
          if (moment(event.start).isAfter(this.date.start) && moment(event.end).isBefore(this.date.end) && event.type === 'Examen') {
            let newEvent = JSON.parse(JSON.stringify(event))
            newEvent.score = JSON.parse(JSON.stringify(this.score))
            store.selectedEvents.push(newEvent)
          }
        })

        console.log(store.selectedEvents)

      },

      optimizeSchedule () {
        let dayScore = 0
        let coefficientScore = 0
        let pointsRetardScore = 0
        let assiduiteScore = 0
        let difficulteScore = 0
        let avancementScore = 0

        let totalScore = 0

        store.selectedEvents.forEach(event => {
          dayScore = moment(event.start).diff(moment(), 'days') >= 10 ? 0 : (10 - moment(event.start).diff(moment(), 'days'))//Score basé sur le nombre de jours pour travailler
          dayScore = dayScore*5//Multiplions par le coefficient

          if (event.coefficient < 1) {
            coefficientScore = event.coefficient*10*4
          } else {
            coefficientScore = event.coefficient*4//Multiplie par le coefficient 4
          }

          pointsRetardScore = event.pointsRetard*3

          assiduiteScore = (10 - event.score.assiduite)*3
          difficulteScore = event.score.difficulte*2
          avancementScore = 10 - event.score.avancement*3

          totalScore = dayScore + coefficientScore + pointsRetardScore + assiduiteScore + difficulteScore + avancementScore
          console.log(totalScore)
        })
      }
    }
  }
</script>

<style>
    .btn-darkgrey {
        background-color: #333333;
        border-color: #333333;
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

    .list-item {
        display: inline-block;
        margin-right: 10px;
    }
    .list-enter-active, .list-leave-active {
        transition: opacity 1s ease;
    }
    .list-enter, .list-leave-to {
        opacity: 0;
    }
</style>
