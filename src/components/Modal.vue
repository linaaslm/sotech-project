<template>
    <transition name="modal">
        <div class="modal" v-if="store.modal.active">
            <div class="modal-content">
                <component :is="store.modal.component" />
            </div>
        </div>
    </transition>
</template>

<script>
  import store from '../config/store'
  import NewEventForm from './Modals/NewEventForm.vue'
  import EventDetail from './Modals/EventDetail.vue'

  export default {

    components: {
      'new-event-form': NewEventForm,
      'event-detail': EventDetail
    },

    data () {
      return {
        store
      }
    },

    beforeDestroy () {
      store.modal.component = ''
      store.modal.value = {}
    }

  }
</script>

<style scoped>

    .modal {
        height: 100vh;
        width: 100%;
        position: fixed;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.8);
        transition: opacity .3s ease;
    }

    .modal-content {
        max-width: 60%;
        max-height: 80vh;
        padding: 5vh;
        border-radius: 12px;
    }

    .modal-enter {
        opacity: 0;
    }

    .modal-leave-active {
        opacity: 0;
    }

    .modal-enter {
        transform: scale(0.9)
    }


</style>