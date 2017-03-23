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

import config from '../../config.json'
import {timestampParse, memory , uptime, timeSince, getCookie} from '../filters'
const isProd = process.env.NODE_ENV === 'production'
let wsaddr = isProd ? config.prod.ws : config.dev.ws

export default (__this) => {
  let __lags = new Date().getTime()
  let __public_key = __this.$route.params.key
  let socket = new WebSocket('ws://' + wsaddr);
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

  console.log(channel);
  socket.on(channel, function(data) {
    console.log(channel);
    console.log(data);
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
       console.log("---")
       console.log(host)
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
  __this.$set(__this, 'socket', socket)
}
