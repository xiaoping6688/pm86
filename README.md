# PM86

## 说明
  - pm86-ci 命令行工具, 兼容 PM2

  - pm86-cloud SSR, API

  - Vue 2.0 SSR 管理界面, Webscoket 数据传输

  - [完全开源](https://github.com/ericjjj/PM86), 可部署在私有服务器, 利用 SSR 开发监控 APP


## 功能
- [x] Element UI
- [x] 独立账号管理系统
- [x] 监控应用进程信息
- [x] 远程控制进程 Reload, Restart, Rorward, Backward
- [x] 邮件报警通知
- [ ] 移动端 APP
- [ ] 路由监听


## Demo Pic

![Login](http://ohusmobs2.bkt.clouddn.com/20170323149025368139834.png)

![Buckets](http://ohusmobs2.bkt.clouddn.com/2017032314902537029509.png)

![Bucket](http://ohusmobs2.bkt.clouddn.com/20170323149025373745286.png)

![Bucket](http://ohusmobs2.bkt.clouddn.com/2017032314902537439632.png)

email 通知
![email](http://ohusmobs2.bkt.clouddn.com/20170323149025516183982.png)




## 运行
**Requires Node.js 6+**

``` shell
1. 打开 mongodb

2. 运行 cloud service
$ cd pm86-cloud
$ cp config.simple.json config.json
# 修改config.json对应配置
$ cnpm install
$ node server.js

3. 注册账号 生成 secret_key public_key
  打开 http://127.0.0.1:3000/login 注册
  打开 http://127.0.0.1:3000/create 创建实例

4.安装命令行工具 (即 pm86-ci)
$ cnpm install pm86 -g
$ cd your-project-path, 创建下面的 processes.json 文件
// 本机环境注册
$ KEYMETRICS_NODE=127.0.0.1 KEYMETRICS_PORT=3000 REMOTE_REVERSE_PORT=43554  REMOTE_PORT=41624 pm86 interact secret_key public_key
// 启动服务
$ pm86 start processes.json
  打开 http://127.0.0.1:3000/buckets 进入对应实例 即可看到对应监控项目
```

## 部署

``` shell
1. 打包
$ npm run build

2. 配置 nginx 代理

3. 修改 config

4 pm86 start processes.json
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


