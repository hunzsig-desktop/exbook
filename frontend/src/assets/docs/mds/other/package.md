## 打包修正

#### 虽然自动混淆已进行了相当多精细的调整和处理

#### 但仍然会存在少数使得-b及之后打包后报错的情况

#### 如注释符信息、字符串调用对象方法等，下面举一个例子，万一遇到也可以轻松解决

```lua
local process = Process("test")
process:onStart(function(this)
    print("--这是个毁天灭地的打印")
end)
```

#### 这里 -h 测试结果是可以运行的

![PackageH](/assets/packageH.png)

#### 但使用 -b 时却报错了

![PackageB](/assets/packageB.png)

#### 很多人这时候就已经不知所措了，这时不能慌，我们知道打包的临时文件其实都在 temp 目录里

#### 根据提示知道是 script\process\test.lua，进入 map 目录查找问题

> 这个 _build 就是 -b 指令对应的临时目录了

![PackageBuild](/assets/packageBuild.png)

#### 打开代码文件可以看到里面报错了

![PackageError](/assets/packageError.png)

#### 这样当然难以查看，我们将其结果代码格式化

![PackageFormat](/assets/packageFormat.png)

#### 可以看到 print("--这是个毁天灭地的打印") 后面的 “这是个毁天灭地的打印")” 都不见了

#### 说明在消除注释的时候被删除了

#### 我们就不要这样写了，因为会被优化，换成>>

```lua
local process = Process("test")
process:onStart(function(this)
    print(">>这是个毁天灭地的打印")
end)
```

#### -b 测试发现不再报错，问题解决

#### 除了最后这种被动修正，平时我们测试的时候可以留意终端提示的问题

#### 例如资源不存在的警告，资源没有被使用的警告

![PackageAssetsError](/assets/packageAssetsError.png)

![PackageAssetsWarn](/assets/packageAssetsWarn.png)

#### 整合版必须在 -d 测试后才能启动 -r封装

#### 在 -d 没有出现问题后 -r 必不会出问题，而公开版不能保证这点
