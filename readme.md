#打砖块游戏 通过canvas来实现

现在并没有完成。。。

### thinking：

* 控制器
> 用于控制游戏的事件，操作...等等 属于顶层对象

* 矩阵
> 生成矩阵<BR/>
> 将矩阵最外层的坐标信息传给控制器<BR/>
> 监听小球是否碰撞,调用被碰撞的砖块的事件

* 方块
> 生成自身方块形状<BR/>
> 方块的描述<BR/>
> 碰撞效果

* 小球
> 运动轨迹<BR/>
> 小球的形状<BR/>

* 弹板
> 位移<BR/>
> 弹板的形状

* 每个模块就是一个canvas 省的到时候有动画效果重绘代价太大
