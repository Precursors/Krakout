// 小球的基类
Krakout.module.Ball = class extends Krakout.module.ModuleBase {

  constructor(ctx, config) {

    config.width = config.width || 20;  // 默认宽高为20px

    config.x = (config.controller.width - config.width) / 2;
    config.y = config.controller.height - config.width - 20;
    config.stride = 30;  // 就是小球 x ＋ y 的偏移量最大是这个数

    super(ctx, config);
  }

  /**
   * 弹射出小球
   * 目前就是随机产生一个方向然后弹射
   */
  fire() {

    this.offsetX = Math.random() * 14 | 1;
    this.offsetY = this.config.stride - this.offsetX;
    this.proceed();
  }

  /**
   * 暂停当前小球的运动
   * 目前没什么作用 先把口子留出来
   */
  proceed() {
    var self = this;
    var move = () => {
      self.accessMove();
      self.moveFlag = requestAnimationFrame(move);
    }
    self.moveFlag = requestAnimationFrame(move);
  }

  pause() {
    cancelAnimationFrame(this.moveFlag);
  }

  /**
   * 移动的方法
   * 目前只是监测是否会触碰到墙壁
   * @TODO 后期需要添加对砖块的响应
   * @param  {object} 当前某个模型的对象上下文
   */
  accessMove() {
    var config = this.config;
    var x = config.x;
    var y = config.y;
    var position = {};

    // 默认是往左上移动（我乐意）
    if (x <= 0 || (x + config.width) >= config.containerWidth) {
      this.offsetX = ~this.offsetX + 1;
    }
    if (y <= 0 || (y + config.width) >= config.containerHeight) {
      this.offsetY = ~this.offsetY + 1;
    }
    this.change({
      x: x - this.offsetX,
      y: y - this.offsetY
    });
  }

}
