'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Krakout =

// build game
function Krakout(container) {
  var config = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  _classCallCheck(this, Krakout);

  var WIDTH = 4096; // 默认宽度
  var HEIGHT = 2160; // 默认高度
  var self = this; // 指向当前游戏的实例
  var canvasList = void 0; // 存放画布的集合 球 板 背景 各种...
  var width = self.width = config.width || WIDTH;
  var height = self.height = config.height || HEIGHT;
  var screenWidth = self.screenWidth = parseFloat(getComputedStyle(container).width); // 容器的宽度
  var ratioWidth = self.ratioWidth = screenWidth / width; // 宽度缩放比例
  var screenHeight = self.screenHeight = parseFloat(getComputedStyle(container).height); // 容器的高度
  var ratioHeight = self.ratioHeight = screenHeight / height; // 高度缩放比例

  /**
   * 初始化游戏
   */
  function init() {

    // 创建基础的画布
    canvasList = self._canvas = buildCanvas(container, ['ball', 'board', 'layout'], buildScreen(container));
    // 创建弹板
    var board = self.loadMod('PlainBoard', canvasList['board'], {
      controller: self
    });

    container.addEventListener('mousemove', function (e) {

      board.change({
        x: e.screenX / self.ratioWidth
      });
    });

    // 创建小球
    var ball = self.loadMod('PlainBall', canvasList['ball'], {
      controller: self
    });

    var balls = self.balls = [];

    balls.push(ball);

    /**
     * 生成画布
     * @param  {=object}   container 游戏的容器dom对象
     * @param  {string | object}   tag  一个标识符
     * @param  {Function} callback 完成创建后的一个函数调用 并且会将生成后的canvas当成参数传入进去
     */
    function buildCanvas(container, tag, callback) {

      var canvasList = {};

      if (typeof tag !== 'string') {
        for (var key in tag) {
          canvasList[tag[key]] = buildCanvas(container, tag[key], callback);
        }
        return canvasList;
      } else {
        // 创建画布
        var canvas = document.createElement('canvas');
        // 设置唯一标识符
        canvas.id = canvas.className = 'krakout-canvas-' + tag;

        // 设置画布的宽高
        callback(canvas);

        // 获取canvas的context 并存入canvasList
        return canvas.getContext('2d');
      }
    }

    /**
     * 生成一个设置画布的尺寸的函数
     * @param  {Element} container 实力化游戏传入的容器dom对象 主要用于获取它的宽高值
     * @return {Function}          返回的函数用于设置
     */
    function buildScreen(container) {
      var wrapWidth = parseFloat(window.getComputedStyle(container).width);
      var wrapHeight = parseFloat(window.getComputedStyle(container).height);
      return function (canvas) {

        // 设置canvas的各种属性
        canvas.width = width;
        canvas.height = height;
        canvas.style.position = 'absolute';
        canvas.style.top = 0;
        canvas.style.left = 0;
        canvas.style.width = width; //global.getComputedStyle(container).width;
        canvas.style.height = height; //global.getComputedStyle(container).height;
        canvas.style.transform = 'scale3d(' + wrapWidth / width + ', ' + wrapHeight / height + ', 1)';
        canvas.style.transformOrigin = 'top left';

        // 将canvas添加至容器
        container.appendChild(canvas);
      };

      // 调用初始化方法
    }
  }

  init();
};

Krakout.module = Krakout.module || {};
Krakout.getMod = function (key) {
  return Krakout.module[key];
};
Krakout.prototype.loadMod = function (key) {
  for (var _len = arguments.length, attr = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    attr[_key - 1] = arguments[_key];
  }

  return new (Function.prototype.bind.apply(Krakout.getMod(key), [null].concat(attr)))();
};
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// 绘制图形的基类
Krakout.module.ModuleBase = function () {

  /**
   * 一切游戏中出现的canvas都继承于这个class
   * @param  {object} ctx    canvas的context属性
   * @param  {object} config 可选的配置参数
   */

  function _class(ctx) {
    var config = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, _class);

    var self = this;
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


  _createClass(_class, [{
    key: "change",
    value: function change(config) {
      for (var key in config) {
        this.config[key] = config[key];
      }
      this.reDraw();
    }

    // 清除上次绘制的区域

  }, {
    key: "clear",
    value: function clear() {
      this.canvas.width = this.canvas.width;
    }

    // 初次渲染前的事件 会在beforeDraw前执行

  }, {
    key: "initReady",
    value: function initReady() {}

    // 在绘制之前 先清除上次绘制 并记录当前信息

  }, {
    key: "beforeDraw",
    value: function beforeDraw() {

      // 先清除上次绘制的区域
      this.clear();
    }
    // 绘制弹板 需要子类实现去

  }, {
    key: "draw",
    value: function draw() {}

    // 绘制后调用

  }, {
    key: "afterDraw",
    value: function afterDraw() {}

    // 初次渲染后的事件

  }, {
    key: "initComplete",
    value: function initComplete() {}

    // 重新绘制

  }, {
    key: "reDraw",
    value: function reDraw() {

      this.beforeDraw(); // 绘制前

      this.draw(); // 绘制

      this.afterDraw(); // 绘制后
    }
  }]);

  return _class;
}();
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// 弹板的结构
Krakout.module.Board = function (_Krakout$module$Modul) {
  _inherits(_class, _Krakout$module$Modul);

  // 弹板默认宽400px 高 40px 在4k屏下 其余为自动缩放

  function _class(ctx, config) {
    _classCallCheck(this, _class);

    config.width = config.width || 400; // 默认宽度
    config.height = config.height || 20; // 默认高度
    // 默认水平居中
    config.x = (config.controller.width - config.width) / 2;
    // 紧挨底部
    config.y = config.controller.height - config.height;
    // 调用基类构造函数
    return _possibleConstructorReturn(this, Object.getPrototypeOf(_class).call(this, ctx, config));
  }

  return _class;
}(Krakout.module.ModuleBase);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// 小球的基类
Krakout.module.Ball = function (_Krakout$module$Modul) {
  _inherits(_class, _Krakout$module$Modul);

  function _class(ctx, config) {
    _classCallCheck(this, _class);

    config.width = config.width || 20; // 默认宽高为20px

    config.x = (config.controller.width - config.width) / 2;
    config.y = config.controller.height - config.width - 20;
    config.stride = 30; // 就是小球 x ＋ y 的偏移量最大是这个数

    return _possibleConstructorReturn(this, Object.getPrototypeOf(_class).call(this, ctx, config));
  }

  /**
   * 弹射出小球
   * 目前就是随机产生一个方向然后弹射
   */


  _createClass(_class, [{
    key: "fire",
    value: function fire() {

      this.offsetX = Math.random() * 14 | 1;
      this.offsetY = this.config.stride - this.offsetX;
      this.proceed();
    }

    /**
     * 暂停当前小球的运动
     * 目前没什么作用 先把口子留出来
     */

  }, {
    key: "proceed",
    value: function proceed() {
      var self = this;
      var move = function move() {
        self.accessMove();
        self.moveFlag = requestAnimationFrame(move);
      };
      self.moveFlag = requestAnimationFrame(move);
    }
  }, {
    key: "pause",
    value: function pause() {
      cancelAnimationFrame(this.moveFlag);
    }

    /**
     * 移动的方法
     * 目前只是监测是否会触碰到墙壁
     * @TODO 后期需要添加对砖块的响应
     * @param  {object} 当前某个模型的对象上下文
     */

  }, {
    key: "accessMove",
    value: function accessMove() {
      var config = this.config;
      var x = config.x;
      var y = config.y;
      var position = {};

      // 默认是往左上移动（我乐意）
      if (x <= 0 || x + config.width >= config.containerWidth) {
        this.offsetX = ~this.offsetX + 1;
      }
      if (y <= 0 || y + config.width >= config.containerHeight) {
        this.offsetY = ~this.offsetY + 1;
      }
      this.change({
        x: x - this.offsetX,
        y: y - this.offsetY
      });
    }
  }]);

  return _class;
}(Krakout.module.ModuleBase);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// 普通弹板
Krakout.module.PlainBoard = function (_Krakout$module$Board) {
  _inherits(_class, _Krakout$module$Board);

  function _class() {
    _classCallCheck(this, _class);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(_class).apply(this, arguments));
  }

  _createClass(_class, [{
    key: "draw",

    // 子类实现的绘制方法
    value: function draw() {
      var ctx = this.ctx;
      // 创建一个方块
      var config = this.config;
      // 创建一个形状
      var rectangle = new Path2D();
      rectangle.rect(config.x, config.y, config.width, config.height);
      ctx.fill(rectangle);
    }
  }, {
    key: "initComplete",
    value: function initComplete() {}
  }]);

  return _class;
}(Krakout.module.Board);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// 普通小球
Krakout.module.PlainBall = function (_Krakout$module$Ball) {
  _inherits(_class, _Krakout$module$Ball);

  function _class() {
    _classCallCheck(this, _class);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(_class).apply(this, arguments));
  }

  _createClass(_class, [{
    key: "draw",
    value: function draw() {

      var ctx = this.ctx;
      var config = this.config;
      var rectangle = new Path2D();
      rectangle.arc(config.x, config.y, config.width, 0, 2 * Math.PI);
      ctx.fill(rectangle);
    }
  }, {
    key: "initComplete",
    value: function initComplete() {
      // 弹射方法
      this.fire();
    }
  }]);

  return _class;
}(Krakout.module.Ball);