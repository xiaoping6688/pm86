# PM86

**Requires Node.js 6+**

独立账号管理系统;

可监控应用进程信息,;

可远程控制 reload, restart, forward, backward;

### 文件说明
> pm86-ci 是命令行工具 代替 pm2;

> pm86-service 是服务端, 负责 websocket 和 tcp 端口相关;

> pm86-cloud 后端 api 界面相关;


### 在本机运行
``` bash
1. 打开 mongodb

2. 运行 service
$ cd pm86-service
$ cnpm install
$ node src/index.js

2. 运行 cloud
$ cd pm86-cloud
$ cnpm install
$ node index.js

3. 注册账号 生成 secret_key public_key
  打开 http://127.0.0.1:3000/ 注册
  打开 http://127.0.0.1:3000/create 创建实例
  
4.安装命令行工具 (即 pm86-ci)
$ cnpm install pm86 -g
$ cd ...yourpath, 创建如下的 processes.json 文件
$ KEYMETRICS_NODE=127.0.0.1 KEYMETRICS_PORT=8000 REMOTE_REVERSE_PORT=43554  REMOTE_PORT=41624 pm86 interact secret_key public_key
$ pm86 start processes.json
  打开 http://127.0.0.1:3000/ 进入对应实例 即可看到对应监控项目
```


processes.json 文件, 请把 pm86 替换为实际名称
``` json

  /**
   * Application configuration section
   */
  "apps" : [
        {
            "name"      : "pm86",
            "max_memory_restart": "300M",
            "script"    : "index.js",
            "log_date_format": "YYYY-MM-DD HH:mm Z",
            "out_file" : "var/log/pm86/pm86_out.log",
            "error_file" : "var/log/pm86/pm86_error.log",
            "instances"  : 4,
            "exec_mode"  : "cluster",
            "env": {
                "NODE_ENV": "production"
            }
        }
  ]
}

```
### 运行状态
![实例列表](http://ww3.sinaimg.cn/large/006tNc79jw1fcq0qjpvjlj31400hhdhd.jpg)

![进程监控](http://ww2.sinaimg.cn/large/006tNc79jw1fcq0rlo0vaj312c0jugof.jpg)

![进程控制](http://ww4.sinaimg.cn/large/006tNc79jw1fcqz3ebdxxj30mo09gmyh.jpg)

### TODO
1. 报警通知



