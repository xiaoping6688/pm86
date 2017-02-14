<template lang="pug">
#vheader
  .line
  el-menu.el-menu-demo(router=true, default-active='1', mode='horizontal', @select='handleSelect')
    el-menu-item(index='/buckets') Buckets
    el-menu-item(index='/create') New Bucket
    el-menu-item(index="") {{email}}
</template>

<script>

export default {
  name: 'home-view',
  computed: {
    isLogin () {
      return this.$store.state.isLogin
    },
    email () {
      return this.$store.state.email || 'Login'
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    }
  }
}
</script>

<style lang="stylus">
#vheader
  background-color #fff
  box-sizing border-box
  
  .el-menu-demo
    padding-left 5%
</style>
