<template lang="pug">
#bucket-view.view
  el-card.box-card(v-if='Object.keys(hostList.data).length')
    div(v-for='(host, $index) in hostList.data')
      .title {{host.server_name}}
      .server-info
        .platform
          p
            label processes:
            span {{host.processes.length}}
          p
            label platform:
            span {{host.server.platform}}
          p
            label arch:
            span {{host.server.arch}}
          p
            label cpu_info:
            span {{host.server.cpu.info}}
          p
            label cpu_number:
            span {{host.server.cpu.number}}
          p
            label node_version:
            span {{host.server.node_version}}
          p
            label pm86_version:
            span {{host.server.pm2_version}}
          p
            label avg
            span(v-for='avg in host.server.loadavg') {{avg.toFixed(2)}}
          p
            label uptime
            span {{uptime(host.server.uptime)}}
          p
            label memory {{memory(host.server.total_mem)}}
            .memory(v-bind:style={width: "500px"})
              .free(v-bind:style="{width: free(host)}")
              .used(v-bind:style="{width: used(host)}")
              .display {{memory(host.server.free_mem)}}  /  {{memory(host.server.total_mem - host.server.free_mem)}}

      .title PROCESSES
      el-table(:data='host.processes', style='width: 100%')
        el-table-column(type='expand')
          template(scope='props', style="{height: 200px}")
            .processes
              p
                label mode:
                span {{props.row.versioning.exec_mode}}
              p
                label type:
                span {{props.row.versioning.type}}
              p
                label branch:
                span {{props.row.versioning.branch}}
              p
                label remote:
                span {{props.row.versioning.remote}}
              p
                label revision:
                span {{props.row.versioning.revision}}
              p
                label last_rev:
                span {{props.row.versioning.prev_rev}}
              p
                label next_rev:
                span {{props.row.versioning.next_rev || 'nothing'}}
              p
                label comment:
                span {{props.row.versioning.comment}}
              p
                label update_time:
                span {{timestampParse(props.row.versioning.update_time)}}
              p
                label repo_url:
                span {{props.row.versioning.url}}
              p
                label repo_path:
                span {{props.row.versioning.repo_path}}
            el-button(size='small', @click='handleExecute(host, name, "reload", $event)') Reload
            el-button(size='small', @click='handleExecute(host, name, "restart", $event)') Restart
            el-button(size='small', @click='handleExecute(host, name, "forward", $event)') Forward
            el-button(size='small', @click='handleExecute(host, name, "backward", $event)') Backward
            .logs
              pre.log(v-html='formatLog(host.logs[props.$index])')
        el-table-column(prop='pid', label='Pid', width='100')
        el-table-column(prop='name', label='Name')
        el-table-column(prop='restart_time', label='Restarts', width='130')
        el-table-column(label='Uptime', width='100')
          template(scope="scope")
            span {{timeSince(scope.row.pm_uptime)}}
        el-table-column(label='Status', width='100')
          template(scope="props")
            i(v-bind:class="{ 'el-icon-circle-check' : props.row.status === 'online' }")
            i(v-bind:class="{ 'el-icon-circle-close' : props.row.status !== 'online' }")
        el-table-column(label='CPU', width='80')
          template(scope="scope")
            span {{scope.row.cpu}} %
        el-table-column(label='Memory')
          template(scope="scope")
            span {{memory(scope.row.memory)}}
        el-table-column(label='Errors', width='110')
          template(scope="scope")
            span {{host.logs[scope.$index].length}}
  h1(v-else) 暂时无数据😯
</template>

<script>

import { timestampParse, memory , uptime, timeSince, getCookie} from '../filters'
import ws from './ws'

export default {
  name: 'bucket-view',
  computed: {
    items () {
      return this.$store.state.buckets
    }
  },
  data () {
    return {
      hostList: {data: {}},
      socket: {}
    }
  },
  methods: {
    memory: memory,
    uptime: uptime,
    timeSince: timeSince,
    timestampParse: timestampParse,
    free (host) {
      return host.server.free_mem / host.server.total_mem * 100 + "%"
    },
    used (host) {
      return (host.server.total_mem - host.server.free_mem) / host.server.total_mem * 100 + "%"
    },
    formatLog (logs) {
      let all = ""
      logs.forEach((log) => {
        all +=  this.timestampParse(log.at) + "</br>" + log.message + "</br>" + log.stack + "</br>"
      })
      return all
    },
    filterProcesses (processes) {
      let obj = {}
      processes.forEach((el) => {
        obj[el.name] = el
      })
      return obj
    },
    handleExecute (host, process_name, method_name, $event) {
      console.log(host)
      console.log(method_name)
      console.log(process_name)
      $event.stopPropagation();
      this.socket.send('execute:-:-:' + JSON.stringify({
        machine_name: host.server_name,
        public_key: host.public_key,
        method_name: method_name,
        parameters: {
            name: process_name
        }
      }));
    }
  },
  mounted () {
    if(!location.href.match(/debug=true/igm)) {
      console.log = function() {};
    }
    ws(this)
  }
}
</script>

<style lang="stylus" scoped>
#bucket-view
  font-family 'Lucida Console', Monaco, monospace

  .server-info .platform, .processes
    .line
      margin 20px 0

    .el-button
      margin 20px 0

    p
      line-height 30px

      label
        display inline-block
        width   160px

  .title
    font-size   2rem
    padding     20px 0
    clear       both
    font-weight bold
    font-family -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;

  .server-info
    width 100%

    .memory
      width       500px
      position    relative
      margin-top  -30px
      margin-left 160px

    .used, .free
      height 30px
      float  left

    .used
      background-color #F5DAEB

    .free
      background-color #CEF4C9

    .display
      line-height  30px
      text-align   center
      padding-left 10px
      position     absolute

  .logs
    height 400px
    overflow auto
    padding 0
    margin-top 20px

    .log
      background-color #333
      color #fff
      padding 10px
      white-space pre
      overflow-x auto
      letter-spacing 1px
      line-height 15px

    .log:after
      content "\2588"
      margin-left 5px
      animation blinker 1s linear infinite

    @keyframes blinker {
      0% {
        opacity 1.0
      }
      50% {
        opacity 0.0
      }
      100% {
        opacity 1.0
      }
    }

</style>
