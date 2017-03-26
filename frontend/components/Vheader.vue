<template lang="pug">
#vheader
  router-link(to='/')
    img.header-logo(src='http://ohusmobs2.bkt.clouddn.com/20170323149024023196292.png')
  el-menu.el-menu-demo(theme='dark',
                       :default-active='activeIndex',
                       mode='horizontal',
                       @select='handleSelect')
    el-menu-item(index='create')
      i.el-icon-plus
    el-submenu(index='profile')
      template(slot='title') PM86
      el-menu-item(index='profile') Profile
      el-menu-item(index='logout') Logout
</template>

<script>

import * as api from '../store/api'

export default {
  name: 'vheader',
  data () {
    return {
      activeIndex: "1",
      email: '',
    }
  },
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
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
      if (key === 'logout') {
        logout(this)
      } else {
        this.$router.push(`/${key}`)
      }
    }
  },
  beforeMount () {
    let email = localStorage.getItem('email');
    this.$set(this, 'email', email);
  }
}

function logout () {
  api.post({
    url: 'account/logout',
    data: {}
  }).then((result) => {
    console.log(result);
      localStorage.setItem('email', null);
      localStorage.setItem('user', null);
      _this.$router.push('/login');
  }).catch((err) => {
    console.log(err);
  })
}
</script>

<style lang="stylus">
#vheader
  height 60px
  width 70%
  padding 0 15%
  background-color #324157

.el-menu
  float right

.header-logo
  height 60px
</style>
