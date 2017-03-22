<template lang="pug">
#home-view.view
  el-card.box-card.bucket(v-for='item in items')
    router-link(:to="'/bucket/' + item.public_key")
      p.name Name:  {{item.bucket_name}}
    span.command pm86 interact {{item.secret_key}} {{item.public_key}}
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
#home-view
  // background-color #fff
  box-sizing border-box

  .bucket
    padding 20px
    position relative
    margin-top 10px

    .name
      font-size 2rem
      font-weight bold

    .pub
      font-size 1.8rem

    .command
      background-color #999999
      border-radius 5px
      color white
      padding 5px 8px
      margin-bottom 10px
      cursor text

</style>
