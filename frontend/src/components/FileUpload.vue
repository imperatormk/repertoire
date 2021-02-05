<template lang="pug">
  .file-upload.font-black(:style="{'pointer-events': inProgress ? 'none' : 'auto'}")
    .flex-column.align-center
      label
        form(ref="fileform")
          input.hidden(type="file" ref="fileInput" @change="fileBrowsed" multiple="multiple")
          .flex-column.h100.justify-center
            .p10.fs25 Drag and drop
            .far.fa-copy.fs60
            .p10.fs25 Click to browse
            .file-listing(v-for="fileObj in files" :key="fileObj.metadata.id")
              .wrapper.p10(@click.prevent="")
                .flex-row.p5.align-center.space-around
                  span {{ fileObj.file.name }}
                .flex-row.p5.align-center.space-between
                  .flex-row
                    .flex-row.align-center
                      span.p10-right Type
                      b-form-input.min-text(v-model="fileObj.metadata.type")
                .flex-row.justify-end.p5
                  b-button(variant="danger"
                    @click.stop.prevent="removeFile(fileObj.metadata.id)"
                    color="error"
                    outline) Remove
                .w100.p5
                  b-progress(:value="fileObj.progress" animated)
</template>

<script>
export default {
  props: {
    filesProp: Array,
    inProgress: Boolean,
    eventBus: {
      type: Object,
      required: true
    }
  },
  mounted() {
    if (this.filesProp) this.files = this.filesProp
    this.eventBus.$on('progress', this.onProgress)
  },
  destroyed() {
    this.eventBus.$off('progress')
  },
  data: () => ({
    dragAndDropCapable: false,
    files: []
  }),
  methods: {
    prepareDragNDrop() {
      this.dragAndDropCapable = this.determineDragAndDropCapable()
      if (this.dragAndDropCapable) {
        ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop']
          .forEach(evt => {
            this.$refs.fileform.addEventListener(evt, e => {
              e.preventDefault()
              e.stopPropagation()
            })
          })
        // TODO: remove the event listener on destroyed
        this.$refs.fileform.addEventListener('drop', e => {
          for (let i = 0; i < e.dataTransfer.files.length; i += 1) {
            this.pushFile(e.dataTransfer.files[i])
          }
        })
      }
    },
    fileBrowsed(e) {
      const { files } = e.target
      for (let i = 0; i < files.length; i += 1) {
        this.pushFile(files[i])
      }
      this.$emit('filesChanged', this.files)
    },
    pushFile(file) {
      const metadata = {
        id: `file-${file.lastModified}`,
        type: 'own'
      }
      this.files.push({
        metadata,
        file,
        progress: 0
      })
    },
    removeFile(key) {
      this.files.splice(key, 1)
      this.$emit('filesChanged', this.files)
    },
    onProgress({ progress, file }) {
      if (!progress) return
      const fileObj = this.files.find(match => match.metadata.id === file)
      if (!fileObj) return
      fileObj.progress = progress
    },
    determineDragAndDropCapable() {
      const div = document.createElement('div')
      return (('draggable' in div)
              || ('ondragstart' in div && 'ondrop' in div))
              && 'FormData' in window
              && 'FileReader' in window
    },
  }
}
</script>

<style lang="scss">
.file-upload {
  form {
    display: block;
    height: auto;
    min-height: 300px;
    border: 5px solid #bbbbbb;
    border-style: dashed;
    margin: auto;
    text-align: center;
    line-height: 1.6;
    padding: 40px;
  }
  div.file-listing {
    margin: auto;
    padding: 10px;
  }
  div.file-listing span {
    line-height: 1.5 !important;
  }
  div.wrapper {
    text-align: center;
    border: 2px solid #bbbbbb;
  }
  div.wrapper a {
    color: red;
    cursor: pointer;
  }
  .min-text {
    padding-top:inherit;
    padding-bottom:inherit;
    height:auto;
  }
}
</style>