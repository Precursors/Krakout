'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

;
(function (factory, global) {

  global.Krakout = global.Krakout || factory(global);
})(function (global) {

  var defaultConfig = {};
  var WIDTH = 4096; // px 默认的游戏宽度 目前写死 宽高全靠缩放
  var HEIGHT = 2160; // px

  var Krakout =

  // build game
  function Krakout(container) {
    var config = arguments.length <= 1 || arguments[1] === undefined ? defaultConfig : arguments[1];

    _classCallCheck(this, Krakout);

    var self = this;
    var canvasList = self._canvas = {}; // 存放画布的集合 球 板 背景 各种...
    var screenWidth = self.screenWidth = parseFloat(getComputedStyle(container).width); // 容器的宽度
    var ratioWidth = self.ratioWidth = screenWidth / WIDTH; // 宽度缩放比例
    var screenHeight = self.screenHeight = parseFloat(getComputedStyle(container).height); // 容器的高度
    var ratioHeight = self.ratioHeight = screenHeight / HEIGHT; // 高度缩放比例

    /**
     * 初始化游戏
     */
    function init() {

      // 创建基础的画布
      buildCanvas(['ball', 'board', 'layout'], buildScreen(container));
      // 创建弹板
      var board = new PlainBoard(canvasList['board']);

      container.addEventListener('mousemove', function (e) {

        board.change({
          x: e.screenX / self.ratioWidth
        });
      });

      // 创建小球
      var ball = new PlainBall(canvasList['ball']);

      var balls = self.balls = [];

      balls.push(ball);
    }

    /**
     * 生成画布
     * @param  {string | object}   tag  一个标识符
     * @param  {Function} callback 完成创建后的一个函数调用 并且会将生成后的canvas当成参数传入进去
     */
    function buildCanvas(tag, callback) {

      if (typeof tag !== 'string') {
        for (var key in tag) {
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
        canvas.id = canvas.className = 'krakout-canvas-' + tag;

        // 将canvas添加至容器
        container.appendChild(canvas);

        // 设置画布的宽高
        callback(canvas);

        // 获取canvas的context 并存入canvasList
        canvasList[tag] = canvas.getContext('2d');
      }
    }

    /**
     * 生成一个设置画布的尺寸的函数
     * @param  {Element} container 实力化游戏传入的容器dom对象 主要用于获取它的宽高值
     * @return {Function}          返回的函数用于设置
     */
    function buildScreen(container) {
      var wrapWidth = parseFloat(global.getComputedStyle(container).width);
      var wrapHeight = parseFloat(global.getComputedStyle(container).height);
      return function (canvas) {
        canvas.width = WIDTH;
        canvas.height = HEIGHT;
        canvas.style.width = WIDTH; //global.getComputedStyle(container).width;
        canvas.style.height = HEIGHT; //global.getComputedStyle(container).height;
        canvas.style.transform = 'scale3d(' + wrapWidth / WIDTH + ', ' + wrapHeight / HEIGHT + ', 1)';
        canvas.style.transformOrigin = 'top left';
      };
    }

    // 调用初始化方法
    init();
  };

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
        this.ctx.clearRect(0, 0, WIDTH, HEIGHT);
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

        // 绘制前
        this.beforeDraw();
        // 绘制
        this.draw();
        // 绘制后
        this.afterDraw();
      }
    }]);

    return ModuleBase;
  }();

  // 弹板的结构


  var Board = function (_ModuleBase) {
    _inherits(Board, _ModuleBase);

    // 弹板默认宽400px 高 40px 在4k屏下 其余为自动缩放

    function Board(ctx) {
      var config = arguments.length <= 1 || arguments[1] === undefined ? {
        width: 400,
        height: 20
      } : arguments[1];

      _classCallCheck(this, Board);

      config.x = (WIDTH - config.width) / 2;
      config.y = HEIGHT - config.height;
      return _possibleConstructorReturn(this, Object.getPrototypeOf(Board).call(this, ctx, config));
    }

    return Board;
  }(ModuleBase);

  // 普通弹板


  var PlainBoard = function (_Board) {
    _inherits(PlainBoard, _Board);

    function PlainBoard() {
      _classCallCheck(this, PlainBoard);

      return _possibleConstructorReturn(this, Object.getPrototypeOf(PlainBoard).apply(this, arguments));
    }

    _createClass(PlainBoard, [{
      key: 'draw',

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
      key: 'initComplete',
      value: function initComplete() {}
    }]);

    return PlainBoard;
  }(Board);

  var stride = 10; // 就是小球 x ＋ y 的偏移量最大是这个数

  // 小球的基类

  var Ball = function (_ModuleBase2) {
    _inherits(Ball, _ModuleBase2);

    function Ball(ctx) {
      var config = arguments.length <= 1 || arguments[1] === undefined ? {
        width: 20
      } : arguments[1];

      _classCallCheck(this, Ball);

      config.x = (WIDTH - config.width) / 2;
      config.y = HEIGHT - config.width - 20;
      return _possibleConstructorReturn(this, Object.getPrototypeOf(Ball).call(this, ctx, config));
    }

    _createClass(Ball, [{
      key: 'move',
      value: function move() {
        this.offsetX = Math.random() * 9 | 1;
        this.offsetY = stride - this.offsetX;
        this.proceed();
      }
    }, {
      key: 'proceed',
      value: function proceed() {
        var self = this;
        self.moveFlag = setInterval(function () {
          accessMove(self);
        }, 1);
      }
    }]);

    return Ball;
  }(ModuleBase);

  // 普通小球


  var PlainBall = function (_Ball) {
    _inherits(PlainBall, _Ball);

    function PlainBall() {
      _classCallCheck(this, PlainBall);

      return _possibleConstructorReturn(this, Object.getPrototypeOf(PlainBall).apply(this, arguments));
    }

    _createClass(PlainBall, [{
      key: 'draw',
      value: function draw() {
        var ctx = this.ctx;
        var config = this.config;
        var rectangle = new Path2D();
        rectangle.arc(config.x, config.y, config.width, 0, 2 * Math.PI);
        ctx.fill(rectangle);
      }
    }, {
      key: 'initComplete',
      value: function initComplete() {
        this.move();
      }
    }]);

    return PlainBall;
  }(Ball);

  /**
   * 移动小球的方法
   * @param  {object} 当前某个小球模型的对象上下文
   */


  function accessMove(self) {
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
      x: self.config.x - self.offsetX,
      y: self.config.y - self.offsetY
    });
  }

  return Krakout;
}, window);