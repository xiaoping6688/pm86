<template lang="pug">
  #app
    vheader
    transition(name="fade" mode="out-in")
      router-view.view
</template>

<script>
import {getCookie} from './filters'
import Vheader from './components/Vheader.vue'
export default {
  name: 'app',
  components: {
    'vheader': Vheader
  },
  beforeMount () {
    const email = getCookie('email')
    if (email) {
      this.$store.commit('SET_LOGIN', 0)
      this.$store.commit('SET_EMAIL', email)
    }
  }
}
</script>

<style lang="stylus">
html
  font-size 50%

body
  font-family -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  font-size 15px
  background-color lighten(#eceef1, 30%)
  margin 0
  padding-top 55px
  padding 0
  color #34495e
  overflow-y scroll

a
  color #34495e
  text-decoration none

.header
  position fixed
  z-index 999
  text-align center
  top 0
  left 0
  right 0

.logo
  width 24px
  margin-right 10px
  display inline-block
  vertical-align middle

.view
  max-width 90%
  margin 0 auto
  position relative
  
li
  list-style-type none

a
  cursor pointer
  
.border1
  border 1px solid #D3D3D3

.fade-enter-active, .fade-leave-active
  transition all .2s ease

.fade-enter, .fade-leave-active
  opacity 0

@media (max-width 860px)
  .header .inner
    padding 15px 30px

@media (max-width 600px)
  body
    font-size 14px
  .header
    .inner
      padding 15px
    a
      margin-right 1em
    .github
      display none
      
</style>
