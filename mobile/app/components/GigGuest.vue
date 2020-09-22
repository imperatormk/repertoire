<template>
  <Page>
    <ActionBar>
      <Label text="Home Guest"/>
    </ActionBar>

    <ScrollView orientation="vertical" margin="15">
      <StackLayout v-if="loaded && !gig" orientation="vertical">
        <Label text="No active gig..."/>
      </StackLayout>
      <StackLayout v-if="loaded && gig" orientation="vertical">
        <FlexboxLayout v-for="song in songs" :key="song.id" justifyContent="space-between">
          <Label :text="song.type"/>
          <StackLayout width="20"/>
          <Label :text="song.title"/>
          <StackLayout width="20"/>
          <Label :text="song.artist"/>
          <StackLayout flexGrow="1"/>
          <check-box :checked="song.requested" @checkedChange="song.requested = $event.value"/>
        </FlexboxLayout>
        <Button text="Request songs" @tap="requestSongs"/>
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
    gig: null,
    songs: []
  }),
  methods: {
    loadGig() {
      this.loaded = false
      api.getActiveGig()
        .then(({ gig }) => {
          this.gig = gig
          this.songs = gig.songs.map((song) => ({
            ...song,
            requested: false
          }))
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
    },
    requestSongs() {
      const selectedSongs = this.songs.filter(song => song.requested).map(song => song.id)
      if (!selectedSongs.length) return
      api.requestsSongs(this.gig.id, selectedSongs)
        .then(() => {
          console.log('now what')
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