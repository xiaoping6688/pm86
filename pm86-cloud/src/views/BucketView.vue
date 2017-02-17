<template lang="pug">
#bucket-view
  el-card.box-card(v-if='Object.keys(hostList.data).length')
    div(v-for='(host, $index) in hostList.data')

      p.title {{host.server_name}}
      .server-info
        thead
          tr
            th Processes
            th CPUs
            th Load
            th Uptime
            th Memory {{memory(host.server.total_mem)}}
        tbody
          tr
            td {{host.processes.length}}
            td 
              el-tooltip(:content='host.server.cpu.info', placement='top', effect='light')
                span {{host.server.cpu.number}}
            td
              p(v-for='avg in host.server.loadavg') {{avg.toFixed(2)}}
            td {{uptime(host.server.uptime)}}
            td(v-bind:style={width: "500px"})
              .free(v-bind:style="{width: free(host)}")
              .used(v-bind:style="{width: used(host)}")
              .display {{memory(host.server.free_mem)}}  /  {{memory(host.server.total_mem - host.server.free_mem)}}

      p.title PROCESSES
      el-table(:data='host.processes', style='width: 100%')
        el-table-column(type='expand')
          template(scope='scope', style="{height: 200px}")
            .logs
              p.title LOGS
              pre.log(v-html='formatLog(host.logs[scope.$index])')

        el-table-column(prop='pid', label='Pid', width='100')
        el-table-column(prop='name', label='Name')
        el-table-column(prop='restart_time', label='Restarts', width='100')
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
        el-table-column(label='Errors', width='80')
          template(scope="scope")
            span {{host.logs[scope.$index].length}}

      .infos
        p.title  INFOMATION
        .info(v-for='(process, name) in filterProcesses(host.processes)')
          p name: {{name}}
          p type: {{process.versioning.type}}
          p url: {{process.versioning.url}}
          p branch: {{process.versioning.branch}}
          p remote: {{process.versioning.remote}}
          p update_time: {{timestampParse(process.versioning.update_time)}}
          p repo_path: {{process.versioning.repo_path}}
          p revision: {{process.versioning.revision}}  
          el-button(size='small',  @click='handleExecute(host, name, "reload", $event)') Reload
          el-button(size='small', type='danger', @click='handleExecute(host, name, "restart", $event)') Restart
          el-button(size='small', type='danger',  @click='handleExecute(host, name, "forward", $event)') Forward
          el-button(size='small', type='danger', @click='handleExecute(host, name, "backward", $event)') Backward
          
          p -----------------------------
  h1(v-else) 暂时无数据😯 
</template>

<script>

import { timestampParse, memory , uptime, timeSince, getCookie} from '../filters'

let HostData = function(host, config) {
  Object.defineProperty(this, "_config", {
      enumerable: false,
      value: config
  });

  this.server_name = host.data.server_name;
  this.processes = [];
  this.server = host.data.status.data.server;
  this.monitoring = host.data.monitoring;
  this.public_key = host.public_key;
  this.sent_at = host.sent_at;
  this.delay = host.delay;
  this.update(host);
};

HostData.prototype.update = function(host) {
  this.lastUpdated = Date.now();
  this.sent_at = host.sent_at;
  this.delay = host.delay ? host.delay : null;

  // Clear HostData While Processes Empty
  if(host.data.status.data.process.length === 0) {
    this.clear();
    return;
  }

  // Update Server Infos
  Object.keys(this.server).forEach(function(key) {
    this.server[key] = host.data.status.data.server[key];
  }.bind(this));

  // Update Monitoring Infos
  Object.keys(this.monitoring).forEach(function(key) {
    this.monitoring[key] = host.data.monitoring[key];
  }.bind(this));

  this._removeMissingProcesses(host.data.status.data.process);
  this._mixProcessExceptions(host.data.status.data.process, host.data['process:exception']);
  this._sortProcessByPmId(host.data.status.data.process);

  host.data.status.data.process.forEach(function(reportedProcess) {
    var existingProcess = this.findProcessByPid(reportedProcess.pid);

    console.log(existingProcess);

    if(!existingProcess) {
      existingProcess = new ProcessData(this._config, reportedProcess);
      this.processes.push(existingProcess);
    }

    existingProcess.update(reportedProcess);
  }.bind(this));

  this._sortProcessByPmId(this.processes);
};

HostData.prototype._removeMissingProcesses = function(reportedProcesses) {
  this.processes = this.processes.filter(function(existingProcess) {
    for(var i = 0; i < reportedProcesses.length; i++) {
      if(reportedProcesses[i].name == existingProcess.name &&
         reportedProcesses[i].pid == existingProcess.pid) {
        return true;
      }
    }

    return false;
  });
};

HostData.prototype.findProcessByPid = function(pid) {
  for(var i = 0; i < this.processes.length; i++) {
    if(this.processes[i].pid == pid) {
      return this.processes[i];
    }
  }

  return null;
};

HostData.prototype.findProcessByPmId = function(pm_id) {
  for(var i = 0; i < this.processes.length; i++) {
    if(this.processes[i].pm_id == pm_id) {
      return this.processes[i];
    }
  }

  return null;
};

HostData.prototype.clear = function() {
  this.processes = [];
  this.server = {};
  this.monitoring = {};
  this.public_key = null;
  this.sent_at = null;
};

HostData.prototype._mixProcessExceptions = function(processes, exceptions) {
  var that = this;

  processes && processes.forEach(function(process) {
    var logs = [];

    exceptions && exceptions.forEach(function(exception) {
      if(exception.data && exception.data.exception) {
        exception.data.exception.forEach(function(e, index) {
          if(process.pm_id === e.process.pm_id) {
            e.data.at = e.at;
            logs.push(e.data);
          }
        });
      }
    });

    that.logs = that.logs || {};
    that.logs[process.pm_id] = logs;
  });
};

HostData.prototype._sortProcessByPmId = function(processes) {
  processes.sort(function(a, b) {
    return a.pm_id - b.pm_id;
  });
};
    // process

let ProcessData = function(config, data) {
  Object.defineProperty(this, "_config", {
    enumerable: false,
    value: config
  });
  this._map(data);
};

ProcessData.prototype.update = function(data) {
  this._map(data);
};

ProcessData.prototype._map = function(data) {
  Object.keys(data).forEach(function(key) {
    this[key] = data[key];
  }.bind(this));
};

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
    let __this = this
    let __lags = new Date().getTime()
    let __public_key = this.$route.params.key
    let socket = new WebSocket('ws://127.0.0.1:3002');
    let sid = getCookie("connect.sid");
    let session_id = decodeURIComponent(sid).match(/s\:([^.]+)/im)[1];
    let channel = session_id + ':' + __public_key;
    let ask = function() {
      socket.send('ask:-:-:' + JSON.stringify({
        t: new Date().getTime() - __lags,
        public_key: __public_key,
        session_id: session_id
      }));
    };
    setTimeout(ask, 1000);

    // socket.io wrapper for clean websocket
    socket.on = (function(channel, handler) {
      let channels = {};
      let messageParse = function(message, data) {
      message = message.split(':-:-:');
      data = message[1];
      message = message[0];

      try {
        data = JSON.parse(data);
      } catch(e) {}

      return [message, data];
    };

    socket.onmessage = function(event, message, data, result) {
      result = messageParse(event.data);
      message = result[0];
      data = result[1];

      if(channels.hasOwnProperty(message)) {
        channels[message].call(this, data);
      }
    };
    return function(channel, handler) {
        channels[channel] = handler;
      };
    })();

    socket.on(channel, function(data) {
      let hostList = __this.hostList.data
      data.forEach(function(host, index) {
        if(host === null) { return; }

        let server_name = host.data.server_name;
        console.log('socket data fetch success');
        console.log('host.sent_at: ' + host.sent_at);
        console.log('time delay: ' + (new Date().getTime() - host.sent_at));
        console.log('server name: ' + host.data.server_name);

        if(host.delay) delete host.delay;
        if(hostList.hasOwnProperty(server_name)) {
            hostList[server_name].update(host);
        } else {
            hostList[server_name] = new HostData(host);
        }

        __this.$set(__this, 'hostList', {data: hostList})
        // Remove HostData While Processes Empty
        if(host.data.status.data.process.length === 0) {
            delete hostList[server_name];
            return;
        }
      });
      setTimeout(ask, 1000);
    });

    socket.on(channel + ':profiling', function(data) {
      console.log("on profiling")
    });
    this.$set(this, 'socket', socket)
  }
}
</script>

<style lang="stylus">
#bucket-view
  background-color #fff
  box-sizing border-box
  
  .title
    font-size 3rem
    font-weight bold
    
  .logs
    height 400px
    overflow auto
    padding 0 
    
    .log
      background-color #333
      color #fff
      font-family 'Lucida Console', Monaco, monospace
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
  
  .server-info
    width calc(100% - 42px)
    border 1px solid #dfe6ec
    padding 0 20px
  
    th, td
      min-width 150px
      text-align left
      height 30px
      
      span
        float left
      
      .used, .free
        height 30px
        float left
      
      .used
        background-color #F5DAEB
        
      .free
        background-color #CEF4C9
        
      .display
        line-height 30px
        text-align center
        padding-left 10px
        position absolute
  
  // p span:nth-child(1)
  //   float left
  //   min-width 100px
  
</style>