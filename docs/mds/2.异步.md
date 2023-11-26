## async 异步

#### 本地玩家调用

```lua
async.call(PlayerLocal(), function()
    print("hello")
end)
```

#### 单独玩家1异步调用

```lua
async.call(Player(1), function()
    print("hello")
end)
```

#### 异步随机整数

```lua
async.call(PlayerLocal(), function()
    print(async.rand(0, 1000))
end)
```
