// 绘制图形的基类
Krakout.module.ModuleBase = class {

  /**
   * 一切游戏中出现的canvas都继承于这个class
   * @param  {object} ctx    canvas的context属性
   * @param  {object} config 可选的配置参数
   */
  constructor(ctx, config = {}) {

    let self = this;
    // 模型所对应界面显示的canvas的context引用
    self.ctx = ctx;
    // 将模型对应的canvas塞进去
    self.canvas = ctx.canvas;
    // 模型的配置信息
    self.config = config;
    // 模型当前所处x坐标
    config.x = config.x || 0;
    // 模型当前所处y坐标
    config.y = config.y || 0;
    // 设置屏幕的宽度
    config.containerWidth = config.controller.width || 0;
    // 设置屏幕的高度
    config.containerHeight = config.controller.height || 0;

    // 初始化前做的操作
    self.initReady();
    // 绘制图形
    self.reDraw();
    self.initComplete();
  }

  // 更改config的属性
  change(config) {
    for (let key in config) {
        this.config[key] = config[key];
    }
    this.reDraw();
  }

  // 清除上次绘制的区域
  clear() {
    this.canvas.width = this.canvas.width;
  }

  // 初次渲染前的事件 会在beforeDraw前执行
  initReady() { }

  // 在绘制之前 先清除上次绘制 并记录当前信息
  beforeDraw() {

    // 先清除上次绘制的区域
    this.clear();
  }
  // 绘制弹板 需要子类实现去
  draw() { }

  // 绘制后调用
  afterDraw() { }

  // 初次渲染后的事件
  initComplete() { }

  // 重新绘制
  reDraw() {

    this.beforeDraw(); // 绘制前

    this.draw(); // 绘制

    this.afterDraw(); // 绘制后

  }
}
