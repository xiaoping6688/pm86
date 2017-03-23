<template lang="pug">
#home-view.view
  .bucket(v-for='(item, index) in items')
    .line(v-if='index !== 0')
    router-link.link(:to="'/bucket/' + item.public_key")
      p.name Name:  {{item.bucket_name}}
    span.command pm86 interact {{item.secret_key}} {{item.public_key}}
  h1.warn(v-if='items.length === 0') 暂时还有没创建哦😯
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
    this.$store.dispatch('FETCH_BUCKETS', {msg: this.$message})
  }
}
</script>

<style lang="stylus" scoped>
#home-view
  height auto

  .warn
    text-align center
    margin-top 200px

  .bucket
    width 50%
    margin 50px auto

    .name
      padding 40px 0
      font-size 1.5rem

    .command
      background-color #999999
      border-radius 5px
      color white
      padding 5px 8px
      margin-bottom 10px
      cursor text
      font-size: 1rem

</style>
