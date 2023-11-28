## sync 同步

> 网易给我们提供的与同步数据有关的函数有4条：
>
> japi已附带

```
DzSyncData
DzTriggerRegisterSyncData
DzGetTriggerSyncPlayer
DzGetTriggerSyncData
```

> 原理和服务器请求响应一样，简单易懂
>
> 一个发，一个收（注意过程时间0.1~0.15s）

#### 直接使用Game对象的同步

> 并不建议直接调用japi
>
> 使用两组配套，经由框架协助你优化调度同步过程

```lua
-- 发
sync.send("hzg", { "hunzsig", "是个开源框架作者" })

-- 收
sync.receive("hzg", function(syncData)
    echo(syncData.transferData[1] .. "确实" .. syncData.transferData[2])
end)
```
