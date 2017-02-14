

**P**(rocess) **M**(anager) **86**

PM86 is a production process manager for Node.js / io.js applications with a built-in load balancer. It allows you to keep applications alive forever, to reload them without downtime and to facilitate common system admin tasks.

Starting an application in production mode is as easy as:

```bash
$ pm86 start app.js
```

PM86 is constantly assailed by [more than 400 tests](https://travis-ci.org/jiakeqi/pm86).

Compatible with [io.js](https://github.com/iojs/io.js) and [Node.js](https://github.com/joyent/node).
Compatible with CoffeeScript.
Works on Linux (stable) & MacOSx (stable) & Windows (stable).

[![Version npm](https://img.shields.io/npm/v/pm2.svg?style=flat-square)](https://www.npmjs.com/package/pm2)[![NPM Downloads](https://img.shields.io/npm/dm/pm2.svg?style=flat-square)](https://www.npmjs.com/package/pm2)[![Build Status](https://img.shields.io/travis/jiakeqi/pm86/master.svg?style=flat-square)](https://travis-ci.org/jiakeqi/pm86)[![Dependencies](https://img.shields.io/david/Unitech/pm2.svg?style=flat-square)](https://david-dm.org/Unitech/pm2)

[![NPM](https://nodei.co/npm/pm86.png?downloads=true&downloadRank=true)](https://nodei.co/npm/pm86/)

## Install PM86

```bash
$ npm install pm86 -g
```

*npm is a builtin CLI when you install Node.js - [Installing Node.js or io.js with NVM](https://keymetrics.io/2015/02/03/installing-node-js-and-io-js-with-nvm/)*

## Start an application

```bash
$ pm86 start app.js
```

Your app is now put in background, kept alive forever and monitored.

Or you can use pm86 programmatically:

```javascript
var pm86 = require('pm86');

pm2.connect(function() {
  pm2.start({
    script    : 'app.js',         // Script to be run
    exec_mode : 'cluster',        // Allow your app to be clustered
    instances : 4,                // Optional: Scale your app by 4
    max_memory_restart : '100M'   // Optional: Restart your app if it reaches 100Mo
  }, function(err, apps) {
    pm2.disconnect();
  });
});
```

## Update PM86

```bash
# Install latest pm86 version
$ npm install pm86 -g
# Save process list, exit old PM86 & restore all processes
$ pm86 update
```

*PM86 updates are seamless*

## Main features

### Process management

Once apps are started you can list and manage them easily:

![Process listing](https://github.com/unitech/pm2/raw/master/pres/pm2-list.png)

Listing all running processes:

```bash
$ pm86 list
```

Managing your processes is straightforward:

```bash
$ pm86 stop     <app_name|id|'all'|json_conf>
$ pm86 restart  <app_name|id|'all'|json_conf>
$ pm86 delete   <app_name|id|'all'|json_conf>
```

To have more details on a specific process:

```bash
$ pm86 describe <id|app_name>
```

### CPU / Memory Monitoring

![Monit](https://github.com/unitech/pm2/raw/master/pres/pm2-monit.png)

Monitoring all processes launched:

```bash
$ pm86 monit
```

### Log facilities

![Monit](https://github.com/unitech/pm2/raw/master/pres/pm2-logs.png)

Displaying logs of a specified process or all processes, in real time:

`pm86 logs ['all'|'PM86'|app_name|app_id] [--err|--out] [--lines <n>] [--raw] [--ti\
mestamp [format]]`

Examples:

```bash
$ pm86 logs
$ pm86 logs WEB-API --err
$ pm86 logs all --raw
$ pm86 logs --lines 5
$ pm86 logs --timestamp "HH:mm:ss"
$ pm86 logs WEB-API --lines 0 --timestamp "HH:mm" --out
$ pm86 logs PM86 --timestamp

$ pm86 flush          # Clear all the logs
```

### Load balancing / 0s reload downtime

When an app is started with the -i <worker number> option, the **cluster** mode is enabled.

Supported by all major Node.js frameworks and any Node.js / io.js applications

![Framework supported](https://raw.githubusercontent.com/jiakeqi/pm86/development/pres/cluster-support.png)

**Warning**: If you want to use the embedded load balancer (cluster mode), we recommend the use of `node#0.12.0+`, `node#0.11.16+` or `io.js#1.0.2+`. We do not support `node#0.10.*`'s cluster module anymore.

With the cluster mode, PM86 enables load balancing between multiple application to use all CPUs available in a server.
Each HTTP/TCP/UDP request will be forwarded to one specific process at a time.

```bash
$ pm86 start app.js -i max  # Enable load-balancer and cluster features

$ pm86 reload all           # Reload all apps in 0s manner

$ pm86 scale <app_name> <instance_number> # Increase / Decrease process number
```

[More informations about how PM86 make clustering easy](https://keymetrics.io/2015/03/26/pm2-clustering-made-easy/)

### Startup script generation

PM86 can generate and configure a startup script to keep PM86 and your processes alive at every server restart.  Execute the startup command only as the user to be running the PM86 daemon.

```bash
$ pm86 startup
# auto-detect platform
$ pm86 startup [platform]
# render startup-script for a specific platform, the [platform] could be one of:
#   ubuntu|centos|redhat|gentoo|systemd|darwin|amazon
```

To save a process list just do:

```bash
$ pm86 save
```

### Development mode

PM86 comes with a development tool that allow you to start an application and restart it on file change.

```
# Start your application in development mode
# = Print the logs and restart on file change
$ pm86-dev run my-app.js
```

### Run Next generation Javascript

PM86 embeds [BabelJS](https://babeljs.io/) to use [next generation Javascript](http://es6-features.org/) both in development and production.

All features are supported, like watch and restart, cluster mode, reload and related.

To run an ES6/ES7 applications:

```bash
# Enable ES6/ES7 live compilation
$ pm86 start app.js --next-gen-js

# Or use the .es extension to automatically enable it
$ pm86 start app.es
```

## PM86 monitoring

[![PM86 Dashboard](http://pm86.io/img/preview_status_log.png)](http://pm86.io/login)

If you manage your NodeJS app with PM86, PM86 makes it easy to monitor and manage apps accross servers.
Feel free to try it:

[Discover the monitoring dashboard for PM86](http://pm86.io/login)

Thanks in advance and we hope that you like PM86!

## More PM86 features

- [Watch & Restart](https://github.com/jiakeqi/pm86/blob/master/ADVANCED_README.md#watch--restart)
- [JSON application declaration](https://github.com/jiakeqi/pm86/blob/master/ADVANCED_README.md#json-app-declaration)
- [Using PM86 in your code](https://github.com/jiakeqi/pm86/blob/master/ADVANCED_README.md#programmatic-example)
- [Deployment workflow](https://github.com/jiakeqi/pm86/blob/master/ADVANCED_README.md#deployment)
- [Startup script generation (SystemD/Ubuntu/Gentoo/AWS)](https://github.com/jiakeqi/pm86/blob/master/ADVANCED_README.md#startup-script)
- [Advanced log management (flush, reload, logs)](https://github.com/jiakeqi/pm86/blob/master/ADVANCED_README.md#a9)
- [GracefullReload](https://github.com/jiakeqi/pm86/blob/master/ADVANCED_README.md#a690)

## PM86 Full documentation

[Advanced README.md](https://github.com/jiakeqi/pm86/blob/master/ADVANCED_README.md)

## Changelog

[CHANGELOG](https://github.com/jiakeqi/pm86/blob/master/CHANGELOG.md)

## Contributors

[Contributors](https://github.com/jiakeqi/pm86/graphs/contributors)

## License

PM86 is made available under the terms of the GNU Affero General Public License 3.0 (AGPL 3.0).
For other license [contact us](https://github.com/jiakeqi/pm86/issues).

[![Analytics](https://ga-beacon.appspot.com/UA-65153384-1/jiakeqi/pm86?pixel)](https://github.com/jiakeqi/pm86)
