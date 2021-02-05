<template lang="pug">
  Layout(admin)
    b-card
      h2 This is admin!
      br
      FileUpload(
        @filesChanged="filesChanged"
        :inProgress="false"
        :eventBus="getEventBus()"
      )
      b-button(@click="uploadRepertoire") Upload repertoire
</template>

<script>
import FileUpload from '@/components/FileUpload'
import api from '@/services/api'

export default {
  data: () => ({
    files: []
  }),
  methods: {
    filesChanged(files) {
      this.files = files || []
    },
    uploadRepertoire() {
      api.uploadRepertoire(this.files)
    },
    getEventBus() {
      return this
    },
  },
  components: {
    FileUpload
  }
}
</script>