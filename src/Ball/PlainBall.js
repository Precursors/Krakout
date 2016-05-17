// 普通小球
var PlainBall = class extends Ball {

  draw() {

    var ctx = this.ctx;
    var config = this.config;
    var rectangle = new Path2D();
    rectangle.arc(config.x, config.y, config.width, 0, 2 * Math.PI);
    ctx.fill(rectangle);

  }
  initComplete() {
    // 弹射方法
    this.fire();
  }
}
