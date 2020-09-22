<template>
  <Page>
    <ActionBar>
      <Label text="Home Host"/>
    </ActionBar>

    <ScrollView orientation="vertical" margin="15">
      <StackLayout v-if="loaded && !gig" orientation="vertical">
        <Label text="No active gig..."/>
        <Button text="Start gig" @tap="startGig"/>
      </StackLayout>
      <StackLayout v-if="loaded && gig" orientation="vertical">
        <FlexboxLayout v-for="song in songs" :key="song.id" justifyContent="space-between">
          <Label :text="song.type"/>
          <StackLayout width="20"/>
          <Label :text="song.title"/>
          <StackLayout width="20"/>
          <Label :text="song.artist"/>
          <StackLayout flexGrow="1"/>
          <Label :text="song.requests.length"/>
        </FlexboxLayout>
        <Button text="Stop gig" @tap="stopGig"/>
      </StackLayout>
    </ScrollView>
  </Page>
</template>

<script>
import { SocketIO } from 'nativescript-socketio'
import api from '@/services/api'

const socketIO = new SocketIO('https://studiodoblo.de:3002', {})

export default {
  mounted() {
    socketIO.connect()
    socketIO.on('new-request', (request) => {
      const { song_id } = request
      this.gig.songs.find(song => song.id === song_id).requests.push(request)
    })
    this.loadGig()
  },
  data: () => ({
    loaded: false,
    gig: null
  }),
  computed: {
    songs() {
      if (!this.gig) return []
      return this.gig.songs
    }
  },
  methods: {
    loadGig() {
      this.loaded = false
      api.getActiveGig()
        .then(({ gig }) => {
          this.gig = gig
        })
        .catch((e) => {
          console.log(e)
        })
        .finally(() => {
          this.loaded = true
        })
    },
    startGig() {
      const gig = {
        title: 'My best gig ever!'
      }
      api.startGig(gig)
        .then(() => {
          this.loadGig()
        })
    },
    stopGig() {
      api.stopGig(this.gig.id)
        .then(() => {
          this.loadGig()
        })
    }
  }
}
</script>

<style scoped lang="scss">
@import '~@nativescript/theme/scss/variables/blue';

.fas {
  @include colorize($color: accent);
}
</style>