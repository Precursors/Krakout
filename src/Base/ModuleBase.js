// 绘制图形的基类
class ModuleBase {

  /**
   * 一切游戏中出现的canvas都继承于这个class
   * @param  {object} ctx    canvas的context属性
   * @param  {object} config 可选的配置参数
   */
  constructor(ctx, config = {}) {

    let self = this;
    // 会触发重绘的属性名
    self.__willChange = [];
    // 模型所对应界面显示的canvas的context引用
    self.ctx = ctx;
    // 模型的配置信息
    self.config = config;
    // 模型当前所处x坐标
    config.x = config.x || 0;
    // 模型当前所处y坐标
    config.y = config.y || 0;

    // 注册需要重绘的属性集合
    self.regChange(['x', 'y', 'width', 'height']);
    // 初始化前做的操作
    self.initReady();
    // 绘制图形
    self.reDraw();
    self.initComplete();
  }
  // 注册会触发重绘的属性名
  regChange(key) {
    if (!key) return;
    if (typeof key === 'string') { // 属性名为一个字符串
      this.__willChange.push(key);
    } else if (key.length) { // 注册的属性名为一个数字 直接与willChange合并
      this.__willChange = this.__willChange.concat(key);
    } else { // 其余则认为传入的是一个object 循环调用regChange方法并传入key ！！！传的是key 就是想到可能图方便 直接将this.config塞进去
      for (let attr in key) {
        this.regChange(item);
      }
    }
  }

  // 更改config的属性
  change(config) {
    let flag = false;
    for (let key in config) {
      // 如果config中存在这个key 说明是可能影响到绘制的
      if (key in this.config && this.__willChange.includes(key)) {
        this.config[key] = config[key];
        flag = true;
      }
    }
    flag && this.reDraw();
  }

  // 清除上次绘制的区域
  clear() {
    this.ctx.clearRect(0, 0, window.config.WIDTH, window.config.HEIGHT);
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
