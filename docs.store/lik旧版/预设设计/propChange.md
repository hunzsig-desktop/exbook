### 参数监听

> 可以预设任意参数在变动时的触发机制

#### 任意监听范围

```lua
-- 任意同步监听范围
event._prop_std = "any"

-- 任意异步监听范围
event._prop_dyn = "any"
```

#### 只限定异步监听3个key的变动

> 当设为true时才有效，可作为临时改动

```lua
event._prop_dyn = {
    attack = true,
    defend = true,
    crit = false,
}
```

#### 监听事件的使用

> number数据没有变化时，不会触发此事件

```lua
---@param evtData noteOnPropPlayer
event.reaction(EVENT.Prop.Change, "myChange", function(evtData)
    if (isClass(evtData.triggerObject, UnitClass)) then
        if (evtData.key == "attack") then
            print("攻击改变了")
        end
    end
end)
```
