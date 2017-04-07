<template lang="pug">
#verify
</template>

<script>

import * as api from '../store/api'

export default {
  name: 'verify',
  computed: {
  },
  data () {
    return {
    }
  },
  methods: {
  },
  mounted () {
    console.log(this.$route.params)
    const _this = this
    api.post({
      url: 'account/verify',
      data: this.$route.params}).then(result => {
        _this.$message.success('success')
        _this.$router.push('/')
      }).catch(e => {
        _this.$message.error(e.toString())
      })
  }
}
</script>

<style lang="stylus" scoped>
</style>
