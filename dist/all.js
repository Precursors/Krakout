'use strict';

(function () {
  var utils = window.utils = window.utils || {};
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
      canvas.width = WIDTH;
      canvas.height = HEIGHT;
      canvas.style.position = 'absolute';
      canvas.style.top = 0;
      canvas.style.left = 0;
      canvas.style.width = WIDTH; //global.getComputedStyle(container).width;
      canvas.style.height = HEIGHT; //global.getComputedStyle(container).height;
      canvas.style.transform = 'scale3d(' + wrapWidth / WIDTH + ', ' + wrapHeight / HEIGHT + ', 1)';
      canvas.style.transformOrigin = 'top left';

      // 将canvas添加至容器
      container.appendChild(canvas);
    };
  }

  utils.buildScreen = buildScreen;
  utils.buildCanvas = buildCanvas;
})();
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

window.config = {};
window.config.WIDTH = 4096; // px 默认的游戏宽度 目前写死 宽高全靠缩放
window.config.HEIGHT = 2160; // px

var WIDTH = window.config.WIDTH;
var HEIGHT = window.config.HEIGHT;
var defaultConfig = {};

var Krakout = function () {

  // build game

  function Krakout(container) {
    var config = arguments.length <= 1 || arguments[1] === undefined ? defaultConfig : arguments[1];

    _classCallCheck(this, Krakout);

    var self = this; // 指向当前游戏的实例
    var canvasList = void 0; // 存放画布的集合 球 板 背景 各种...
    var screenWidth = self.screenWidth = parseFloat(getComputedStyle(container).width); // 容器的宽度
    var ratioWidth = self.ratioWidth = screenWidth / WIDTH; // 宽度缩放比例
    var screenHeight = self.screenHeight = parseFloat(getComputedStyle(container).height); // 容器的高度
    var ratioHeight = self.ratioHeight = screenHeight / HEIGHT; // 高度缩放比例

    /**
     * 初始化游戏
     */
    function init() {

      // 创建基础的画布
      canvasList = self._canvas = utils.buildCanvas(container, ['ball', 'board', 'layout'], utils.buildScreen(container));
      // 创建弹板
      var board = new PlainBoard(canvasList['board'], {
        controller: self
      });

      container.addEventListener('mousemove', function (e) {

        board.change({
          x: e.screenX / self.ratioWidth
        });
      });

      // 创建小球
      var ball = new PlainBall(canvasList['ball'], {
        controller: self
      });

      var balls = self.balls = [];

      balls.push(ball);
    }

    // 调用初始化方法
    init();
  }
  /**
   * 移动的方法
   * 目前只是监测是否会触碰到墙壁
   * @TODO 后期需要添加对砖块的响应
   * @param  {object} 当前某个模型的对象上下文
   */


  _createClass(Krakout, [{
    key: 'accessMove',
    value: function accessMove(self) {
      var x = self.config.x;
      var y = self.config.y;
      var position = {};

      // 默认是往左上移动（我乐意）
      if (x <= 0 || x + self.config.width >= WIDTH) {
        self.offsetX = ~self.offsetX + 1;
      }
      if (y <= 0 || y + self.config.width >= HEIGHT) {
        self.offsetY = ~self.offsetY + 1;
      }
      self.change({
        x: x - self.offsetX,
        y: y - self.offsetY
      });
    }
  }]);

  return Krakout;
}();
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// 绘制图形的基类

var ModuleBase = function () {

  /**
   * 一切游戏中出现的canvas都继承于这个class
   * @param  {object} ctx    canvas的context属性
   * @param  {object} config 可选的配置参数
   */

  function ModuleBase(ctx) {
    var config = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, ModuleBase);

    var self = this;
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


  _createClass(ModuleBase, [{
    key: 'regChange',
    value: function regChange(key) {
      if (!key) return;
      if (typeof key === 'string') {
        // 属性名为一个字符串
        this.__willChange.push(key);
      } else if (key.length) {
        // 注册的属性名为一个数字 直接与willChange合并
        this.__willChange = this.__willChange.concat(key);
      } else {
        // 其余则认为传入的是一个object 循环调用regChange方法并传入key ！！！传的是key 就是想到可能图方便 直接将this.config塞进去
        for (var attr in key) {
          this.regChange(item);
        }
      }
    }

    // 更改config的属性

  }, {
    key: 'change',
    value: function change(config) {
      var flag = false;
      for (var key in config) {
        // 如果config中存在这个key 说明是可能影响到绘制的
        if (key in this.config && this.__willChange.includes(key)) {
          this.config[key] = config[key];
          flag = true;
        }
      }
      flag && this.reDraw();
    }

    // 清除上次绘制的区域

  }, {
    key: 'clear',
    value: function clear() {
      this.ctx.clearRect(0, 0, window.config.WIDTH, window.config.HEIGHT);
    }

    // 初次渲染前的事件 会在beforeDraw前执行

  }, {
    key: 'initReady',
    value: function initReady() {}

    // 在绘制之前 先清除上次绘制 并记录当前信息

  }, {
    key: 'beforeDraw',
    value: function beforeDraw() {

      // 先清除上次绘制的区域
      this.clear();
    }
    // 绘制弹板 需要子类实现去

  }, {
    key: 'draw',
    value: function draw() {}

    // 绘制后调用

  }, {
    key: 'afterDraw',
    value: function afterDraw() {}

    // 初次渲染后的事件

  }, {
    key: 'initComplete',
    value: function initComplete() {}

    // 重新绘制

  }, {
    key: 'reDraw',
    value: function reDraw() {

      this.beforeDraw(); // 绘制前

      this.draw(); // 绘制

      this.afterDraw(); // 绘制后
    }
  }]);

  return ModuleBase;
}();
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// 弹板的结构

var Board = function (_ModuleBase) {
  _inherits(Board, _ModuleBase);

  // 弹板默认宽400px 高 40px 在4k屏下 其余为自动缩放

  function Board(ctx, config) {
    _classCallCheck(this, Board);

    config.width = config.width || 400; // 默认宽度
    config.height = config.height || 20; // 默认高度
    // 默认水平居中
    config.x = (window.config.WIDTH - config.width) / 2;
    // 紧挨底部
    config.y = window.config.HEIGHT - config.height;
    // 调用基类构造函数
    return _possibleConstructorReturn(this, Object.getPrototypeOf(Board).call(this, ctx, config));
  }

  return Board;
}(ModuleBase);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// 小球的基类

var Ball = function (_ModuleBase) {
  _inherits(Ball, _ModuleBase);

  function Ball(ctx, config) {
    _classCallCheck(this, Ball);

    config.width = config.width || 20; // 默认宽高为20px
    config.x = (window.config.WIDTH - config.width) / 2;
    config.y = window.config.HEIGHT - config.width - 20;
    config.stride = 30; // 就是小球 x ＋ y 的偏移量最大是这个数
    return _possibleConstructorReturn(this, Object.getPrototypeOf(Ball).call(this, ctx, config));
  }

  /**
   * 弹射出小球
   * 目前就是随机产生一个方向然后弹射
   */


  _createClass(Ball, [{
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
        self.config.controller.accessMove(self);
        self.moveFlag = requestAnimationFrame(move);
      };
      self.moveFlag = requestAnimationFrame(move);
    }
  }, {
    key: "pause",
    value: function pause() {
      cancelAnimationFrame(this.moveFlag);
    }
  }]);

  return Ball;
}(ModuleBase);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// 普通弹板

var PlainBoard = function (_Board) {
  _inherits(PlainBoard, _Board);

  function PlainBoard() {
    _classCallCheck(this, PlainBoard);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(PlainBoard).apply(this, arguments));
  }

  _createClass(PlainBoard, [{
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

  return PlainBoard;
}(Board);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// 普通小球

var PlainBall = function (_Ball) {
  _inherits(PlainBall, _Ball);

  function PlainBall() {
    _classCallCheck(this, PlainBall);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(PlainBall).apply(this, arguments));
  }

  _createClass(PlainBall, [{
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

  return PlainBall;
}(Ball);