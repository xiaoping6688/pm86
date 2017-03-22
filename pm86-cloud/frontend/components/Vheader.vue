<template lang="pug">
#vheader
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
      if (key === 'logout') {
        const _this = this
        api.post({
          url: 'account/logout',
          data: {}
        }).then((result) => {
          console.log(result);
          if (result.status === 200) {
            localStorage.setItem('email', null);
            localStorage.setItem('user', null);
            _this.$router.push('/login');
          }
        }).catch((err) => {
          console.log(err);
        })
      } else {
        this.$router.push(`/${key}`)
      }
      console.log(key, keyPath);
    }
  },
  beforeMount () {
    let email = localStorage.getItem('email');
    this.$set(this, 'email', email);
  }
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
</style>
