## T2R 世界坐标例子

```lua
--japi.DzFrameEditBlackBorders(0, 0.13)
local u1 = Unit(TPL_UNIT.HeroFlameLord, Player(1), 0, 0, 0)

local t2rFrame = FrameBackdrop("t2r", FrameGameUI)
    :relation(FRAME_ALIGN_CENTER, FrameGameUI, FRAME_ALIGN_LEFT_BOTTOM, 0, 0)
    :size(0.04, 0.004)
    :texture(TEAM_COLOR_BLP_PURPLE)

japi.Refresh("t2r", function()
    local rx, ry = japi.ConvertWorldPosition(u1:x(), u1:y(), 130 + u1:stature() + u1:h())
    if (rx == -1 or ry == -1) then
        t2rFrame:show(false)
        return
    end
    print("屏幕xy=", rx, ry)
    t2rFrame:relation(FRAME_ALIGN_CENTER, FrameGameUI, FRAME_ALIGN_LEFT_BOTTOM, rx, ry):show(true)
end)
```

#### 整合包可参考Screen对象实现