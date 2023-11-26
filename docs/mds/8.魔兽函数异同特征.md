## 魔兽函数异同特征

一般而言，魔兽的函数可以分为同步执行函数和异步执行函数

例如Japi的UI、声音、遮罩贴图等，少数就是异步执行函数

而创建单位，伤害目标、移动物品等，绝大多数就是同步执行函数

> 后续代码非正式执行代码，仅作结构演示

### 异步执行函数

异步执行函数不需要环境的加持，当你环境处于同步时，则函数对所有玩家有效，异步环境时，则对特定玩家有效

```lua
-- 允许异步数据的异步执行函数
japi.FrameSetTexture() -- 可以
async.call(Player(1),function()
    japi.FrameSetTexture() -- 也可以
end)
```

### 同步执行函数

同步执行函数需要环境的加持，你必须注意环境处于同步状态下，且效果对所有玩家有效

```lua
-- 必须同步数据的同步执行函数
J.CreateUnit() -- 可以
async.call(Player(1),function()
    J.CreateUnit() -- 几乎凉凉
end)
```

> 然而，魔兽里还存在一种特殊的函数系列

### 允许异步数据的同步执行函数

这类函数你必须注意环境处于同步状态下，才可执行！但它的数据可以异步，也就是各个玩家不一致

```lua
-- 允许异步数据的同步执行函数
local z = 100
async.call(Player(1),function()
    z = 996
end)
japi.EXSetEffectZ(e, z) -- 可以,但玩家1自己是996高度
async.call(Player(1),function()
    japi.EXSetEffectZ(e, z) -- 几乎凉凉
end
```
