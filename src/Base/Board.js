// 弹板的结构
Krakout.module.Board = class extends Krakout.module.ModuleBase {
  // 弹板默认宽400px 高 40px 在4k屏下 其余为自动缩放
  constructor(ctx, config) {

    config.width = config.width || 400; // 默认宽度
    config.height = config.height || 20; // 默认高度
    // 默认水平居中
    config.x = (config.controller.width - config.width) / 2;
    // 紧挨底部
    config.y = config.controller.height - config.height;
    // 调用基类构造函数
    super(ctx, config);
  }
}
