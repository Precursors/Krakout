// 小球的基类
class Ball extends ModuleBase {

  constructor(ctx, config) {
    config.width = config.width || 20;  // 默认宽高为20px
    config.x = (window.config.WIDTH - config.width) / 2;
    config.y = window.config.HEIGHT - config.width - 20;
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
      self.config.controller.accessMove(self);
      self.moveFlag = requestAnimationFrame(move);
    }
    self.moveFlag = requestAnimationFrame(move);
  }

  pause() {
    cancelAnimationFrame(this.moveFlag);
  }
}
