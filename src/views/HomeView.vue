<template lang="pug">
#home-view
  ul
    li(v-for='item in items').border1
      router-link(:to="'/bucket/' + item.uuid")
        p.name Bucket Name:  {{item.bucket_name}}
        p.pub public key: {{item.public_key}}
      span.command pm86 interact {{item.secret_key}} {{item.secret_key}}
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
    link (id) {return `/bucket/${id}`}
  },
  mounted () {
    this.$store.dispatch('FETCH_BUCKETS')
  }
}
</script>

<style lang="stylus">
#home-view
  background-color #fff
  box-sizing border-box
  
  ul
    padding 0
  
    li
      padding 20px
      position relative
      margin-top 10px
      
      .name
        font-size 3rem
        font-weight bold
        
      .pub
        font-size 1.8rem
      
      .command
        background-color #999999
        border-radius 5px
        color white
        padding 5px 8px
        margin-bottom 30px
        cursor pointer
        
</style>
