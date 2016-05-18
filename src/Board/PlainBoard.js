// 普通弹板
 Krakout.module.PlainBoard = class extends Krakout.module.Board {
  // 子类实现的绘制方法
  draw() {
    var ctx = this.ctx;
    // 创建一个方块
    var config = this.config;
    // 创建一个形状
    var rectangle = new Path2D();
    rectangle.rect(config.x, config.y, config.width, config.height);
    ctx.fill(rectangle);
  }

  initComplete() { }
}
