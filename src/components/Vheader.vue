<template lang="pug">
#vheader header
</template>

<script>

export default {
  name: 'home-view',
  computed: {
    items () {
      return this.$store.state.buckets
    }
  },
  methods: {
  },
  mounted () {
    this.$store.dispatch('FETCH_BUCKETS')
  }
}
</script>

<style lang="stylus">
#vheader
  background-color #fff
  box-sizing border-box
        
</style>
