<template lang="pug">
#home-view.view
  .listItem(v-for='(item, index) in items')
    router-link.link(:to="'/bucket/' + item.public_key")
      p.name {{item.bucket_name}}
    span.command &nbsp $ pm86 interact {{item.secret_key}} {{item.public_key}} &nbsp
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
/* 列表项间隔padding-top */
.listItem {
    position: relative;
    padding-left: 40px;
    padding-top: 4px;
    width: 90%;
    margin: 0 auto;
    height: 150px;
    margin-left 100px;
}
/* 列表项自带竖线 */
.listItem:before {
    content: "";
    display: inline-block;
    position: absolute;
    top: 0;
    left: 0;
    width: 1px;
    height: 100%;
    border-right: 1px solid rgb(50, 65, 87);
    left: 19px;
    z-index: 1;
}
/* 列表项自带小圆点 */
.listItem:after {
    content: "";
    display: inline-block;
    position: absolute;
    width: 12px;
    height: 1px;
    background-color: rgb(50, 65, 87);
    left: 20px;
    top: 50%;
    margin-top: -3px;
    z-index: 1;
}
#home-view
  height auto
  padding-top 30px

  .warn
    text-align center
    margin-top 200px

  .name
    font-size 1.5rem
    position    absolute
    bottom 90px

  .command
    position    absolute
    bottom 35px
    font-family 'Lucida Console', Monaco, monospace
    background-color #3F3F3F
    border-radius 5px
    color white
    cursor text
    font-size 1rem
    line-height 30px

</style>
