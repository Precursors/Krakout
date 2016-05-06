'use strict';

;
((factory, global) => {
  global.Krakout = global.Krakout || factory(global);
})((global) => {
  let defaultConfig = {
    viewmode: 'fullscreen'
  };
  let WIDTH = 4096; // px 默认的游戏宽度 目前写死 宽高全靠缩放
  let HEIGHT = 2160; // px
  class Krakout {

    // build game
    constructor(container, config = defaultConfig) {
      let self = this;
      let canvasList = self._canvas = {}; // 存放画布的集合 球 板 背景 各种...
      let screenWidth = self.screenWidth = parseFloat(getComputedStyle(container).width); // 容器的宽度
      let ratioWidth = self.ratioWidth = (screenWidth / WIDTH); // 宽度缩放比例
      let screenHeight = self.screenHeight = parseFloat(getComputedStyle(container).height); // 容器的高度
      let ratioHeight = self.ratioHeight = (screenHeight / HEIGHT); // 高度缩放比例

      // 初始化游戏
      function init() {
        // 创建基础的画布
        buildCanvas(['ball', 'board', 'layout'], buildScreen(container));
        // 创建弹板
        var board = new PlainBoard(canvasList['board']);

        container.addEventListener('mousemove', e => {
          board.change({
            x: e.screenX / self.ratioWidth
          })
        });

        // 创建小球
        var ball = new PlainBall(canvasList['ball']);
      }

      // 生成画布
      function buildCanvas (tag, callback) {
        if (typeof tag !== 'string') {
          for (let key in tag) {
            buildCanvas(tag[key], callback);
          }
        } else {
          // 创建画布
          var canvas = document.createElement('canvas');

          // 设置画布定位方式 用于重叠显示
          canvas.style.position = 'absolute';
          canvas.style.top = 0;
          canvas.style.left = 0;
          // 设置唯一标识
          canvas.id = canvas.className = `krakout-canvas-${tag}`;

          // 将canvas添加至容器
          container.appendChild(canvas);

          // 设置画布的宽高
          callback(canvas);

          // 获取canvas的context 并存入canvasList
          canvasList[tag] = canvas.getContext('2d');

        }
      }

      // 设置画布的宽高
      function buildScreen (container) {
        return canvas => {
          canvas.width = WIDTH;
          canvas.height = HEIGHT;
          canvas.style.width = WIDTH;//global.getComputedStyle(container).width;
          canvas.style.height = HEIGHT;//global.getComputedStyle(container).height;
          canvas.style.transform = `scale3d(${parseFloat(global.getComputedStyle(container).width) / WIDTH}, ${parseFloat(global.getComputedStyle(container).height) / HEIGHT}, 1)`;
          canvas.style.transformOrigin = 'top left';
        }
      }

      // 调用初始化方法
      init();
    }

  }

  // 绘制图形的基类
  class ModuleBase {
    constructor (ctx, config = {}) {
      let self = this;
      // 会触发重绘的属性名
      self.__willChange = [];
      self.ctx = ctx;
      self.config = config;
      config.x = config.x || 0;
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
    regChange (key) {
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
    change (config) {
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
    clear () {
      this.ctx.clearRect(0, 0, WIDTH, HEIGHT);
    }
    // 初次渲染前的事件 会在beforeDraw前执行
    initReady () {}
    // 在绘制之前 先清除上次绘制 并记录当前信息
    beforeDraw () {
      // 先清除上次绘制的区域
      this.clear();
    }
    // 绘制弹板 需要子类实现去
    draw () {}
    // 绘制后调用
    afterDraw () {}
    // 初次渲染后的事件
    initComplete () {}
    // 重新绘制
    reDraw () {
      // 绘制前
      this.beforeDraw();
      // 绘制
      this.draw();
      // 绘制后
      this.afterDraw();
    }
  }

  // 弹板的结构
  class Board extends ModuleBase {
    // 弹板默认宽400px 高 40px 在4k屏下 其余为自动缩放
    constructor (ctx, config = {
        width: 400,
        height: 20
    }) {
        config.x = (WIDTH - config.width) / 2;
        config.y = HEIGHT - config.height;
        super(ctx, config);
    }
  }

  // 普通弹板
  class PlainBoard extends Board {
    // 子类实现的绘制方法
    draw () {
      var ctx = this.ctx;
      // 创建一个方块
      var config = this.config;
      // 创建一个形状
      var rectangle = new Path2D();
      rectangle.rect(config.x, config.y, config.width, config.height);
      ctx.fill(rectangle);

    }
    initComplete () {
      console.log(this);
    }
  }

  // 小球的基类
  class Ball extends ModuleBase {
    constructor (ctx, config = {
      width: 20
    }) {
      config.x = (WIDTH - config.width) / 2;
      config.y = HEIGHT - config.width - 20;
      super(ctx, config);
    }
  }
  // 普通小球
  class PlainBall extends Ball {
    draw () {
      var ctx = this.ctx;
      var config = this.config;
      var rectangle = new Path2D();
      rectangle.arc(config.x, config.y, config.width, 0, 2 * Math.PI);
      ctx.fill(rectangle);
    }
    initComplete () {
      var self = this;
      setInterval(() => {
        self.change({
          x: self.config.x - 5,
          y: self.config.y - 5
        });
      }, 1);
    }
  }


  return Krakout;
}, window);
