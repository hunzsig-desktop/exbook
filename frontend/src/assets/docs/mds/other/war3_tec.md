## 魔兽作图小技巧

### 如何令加载地图时播放音乐

随意创建一个F4触发器

转为自定义代码并删除里面所有代码

贴上以下代码即可：
> * 此方法在重制版魔兽中可能是无效的

```c
function myBgm takes string s returns nothing
    local string uri = "main.mp3" //这个路径你可以播放默认的音乐（在F5）也可以播放F12导入的音乐
    call SetMapDescription(s)
    call PlayMusic(uri)
    set uri = null
endfunction
#define SetMapDescription(s) myBgm(s)
```

### 为什么我的mp3背景音乐不能循环播放

背景音乐无法循环播放时，可以尝试格式工厂转wav再转回mp3

一般问题已解决~

### 如何令一个技能隐藏但是依然有效

设置它的图标坐标为（0,-11）

### 物品编辑器如何输入负数的数值

按住shift再双击即可输入负值，某些技能负数会引起崩溃，如“水元素”

### 如何修改单位的最大生命/魔法

利用生命牌的bug可以实现，例如X点生命值。

有个叫生命护身符的物品，将它的技能设为2级，1级数据为0，2级数据为-X，将技能添加给目标单位后，设为2级，然后删除

目标单位会永久增加X点生命值

> * 最大魔法值同理
