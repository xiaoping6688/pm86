<template lang="pug">
  #app
    vheader
    transition(name="fade" mode="out-in")
      router-view
</template>

<script>
import {getCookie} from './filters'
export default {
  name: 'app',
  beforeMount () {
  }
}
</script>

<style lang="stylus">
html
  font-size 50%
  width 100%
  height 100%

body
  font-family -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  font-size 15px
  background-color lighten(#eceef1, 70%)
  margin 0
  padding-top 55px
  width 100%
  height 100%
  padding 0
  color #34495e
  overflow-y scroll

#app
  width 100%
  height 100%

.line
  width 100%
  height 1px
  background-color #DDDDDD

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
  width 70%
  margin 0 auto
  position relative
  height calc(100% - 60px)

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

html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed,
figure, figcaption, footer, header, hgroup,
menu, nav, output, ruby, section, summary,
time, mark, audio, video {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
}

article, aside, details, figcaption, figure,
footer, header, hgroup, menu, nav, section {
  display: block;
}

body {
  line-height: 1;
}

ol, ul {
  list-style: none;
}

blockquote, q {
  quotes: none;
}

blockquote:before, blockquote:after,

q:before, q:after {
  content: '';
  content: none;
}

table {
  border-collapse: collapse;
  border-spacing: 0;
}

</style>
