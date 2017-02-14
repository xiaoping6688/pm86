##### 静态配置信息调整

```
KEYMETRICS_ROOT_URL : 'pm86root.jk77.me',
DEFAULT_MODULE_JSON : 'package.json',
REMOTE_PORT_TCP : 8080,
REMOTE_PORT : 8080,
REMOTE_REVERSE_PORT : 8080,
REMOTE_HOST : 'pm86root.jk77.me',
SEND_INTERVAL : 1000
```

##### 基础握手信息服务

```
端口：443 -> 80
```

##### 安装包元信息调整

```
包名称、版本号、BIN路径
```

##### [Keymetrics.io] 提示文案批量替换

```
[Keymetrics.io] -> [pm86root.jk77.me]
PM2: Keymetrics.io Agent -> PM2: pm86root.jk77.me Agent
```

##### README 文案信息更改

```
pm2 -> pm86
PM2 -> PM86
Keymetrics -> PM86
Unitech/PM2 -> jiakeqi/pm86
```

##### 改动文件列表

- `constants.js`
- `lib/Interactor/Daemon.js`
- `package.json`
- `bin/pm2`
- `lib/Interactor/Daemon.js`
- `lib/Interactor/InteractorDaemonizer.js`
- `README.md`
