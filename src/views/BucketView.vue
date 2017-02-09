<template lang="pug">
#bucket-view
  p 123
  
</template>

<script>

var __lags = new Date().getTime()

var hostListProcess = function(hostList, reportedHostList) {
    reportedHostList.forEach(function(host, index) {
        if(host === null) {
            return;
        }

        var server_name = host.data.server_name;

        if(new Date().getTime() - host.sent_at - __lags > 31000 ||
          host.data.status.data.process.length === 0) {
            console.log('socket data expired or process list is empty');
            console.log('host.sent_at: ' + host.sent_at);
            console.log('time delay: ' + (new Date().getTime() - host.sent_at));
            console.log('server name: ' + host.data.server_name);

            if(location.href.match(/view=live/igm)) {
                host = { data: { status: { data: { process: [], server: {} } }, monitoring: {} } };
            } else {
                host.delay = (new Date().getTime() - host.sent_at);
            }
        } else {
            console.log('socket data fetch success');
            console.log('host.sent_at: ' + host.sent_at);
            console.log('time delay: ' + (new Date().getTime() - host.sent_at));
            console.log('server name: ' + host.data.server_name);

            if(host.delay) delete host.delay;
        }

        if(hostList.hasOwnProperty(server_name)) {
            hostList[server_name].update(host);
        } else {
            hostList[server_name] = new HostData(host);
        }

        // Remove HostData While Processes Empty
        if(host.data.status.data.process.length === 0) {
            delete hostList[server_name];
            return;
        }
    });

    updateHostListLength(hostList);
};

var updateHostListLength = function(hostList) {
  console.log("updateHostListLength");
    // $scope.hostListLength = Object.keys(hostList).length;
};

var hostListProfilingProcess = function(hostList, profilings) {
    for(var hostName in profilings) {
        if(profilings.hasOwnProperty(hostName)) {
            var host = hostList[hostName];
            var targetProcess;

            if(!host) continue;

            profilings[hostName].forEach(function(profiling, index) {
                targetProcess = host.findProcessByPmId(profiling.pm_id);

                if(!targetProcess) return;

                targetProcess.heapdump = profiling.heapdump;
                targetProcess.cpuprofile = profiling.cpuprofile;

                if(profiling.heapdump) {
                    targetProcess.file_name_heapdump = profiling.file_name;
                }

                if(profiling.cpuprofile) {
                    targetProcess.file_name_cpuprofile = profiling.file_name;
                }
            });
        }
    }
}
var __public_key = "__public_key"
var socket
if (typeof window !== 'undefined') {
  socket = new WebSocket('ws://127.0.0.1:9000');
  // socket.io wrapper for clean websocket
socket.on = (function(channel, handler) {
    var channels = {};
    var messageParse = function(message, data) {
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
  console.log("on channel")
    // $scope.$apply(function($scope) {
    //     hostListProcess($scope.hostList, data);
    //     $scope.hostListPending = false;
    // });

    setTimeout(ask, 1000);
});

socket.on(channel + ':profiling', function(data) {
  console.log("on channel profiling")
    // $scope.$apply(function($scope) {
    //     hostListProfilingProcess($scope.hostList, data);
    // });
});
// cookie
// 
var session_id = decodeURIComponent("123").match(/s\:([^.]+)/im);
var channel = session_id + ':' + __public_key;
var ask = function() {
    socket.send('ask:-:-:' + JSON.stringify({
        t: new Date().getTime() - __lags,
        public_key: __public_key,
        session_id: session_id
    }));
};

setTimeout(ask, 1000);
}




export default {
  name: 'bucket-view',
  computed: {
    items () {
      return this.$store.state.buckets
    }
  },
  mounted () {
  }
}
</script>

<style lang="stylus">
#bucket-view
  background-color #fff
  box-sizing border-box
</style>