<template lang="pug">
  .w100.navbar(:class="{ admin }")
    .w100.flex-row.align-center
      span.text-white {{ user ? user.email : '' }}
      .flex-1
      .pointer.text-white(@click="loginorout") {{ user ? 'Logout' : 'Login' }}
</template>

<script>
import auth from '@/services/auth'

export default {
  props: {
    admin: Boolean
  },
  created() {
    auth.getUser()
      .then(user => {
        this.user = user
      })
  },
  data: () => ({
    user: null
  }),
  methods: {
    loginorout() {
      if (this.user) {
        auth.logout()
          .then(() => {
            this.$router.push({ name: 'login' })
          })
      } else {
        this.$router.push({ name: 'login' })
      }
    }
  }
}
</script>