'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

;
(function (factory, global) {
  global.Krakout = global.Krakout || factory(global);
})(function (global) {
  var defaultConfig = {
    viewmode: 'fullscreen'
  };
  var width = 4096; // px 默认的游戏宽度 目前写死 宽高全靠缩放
  var height = 2160; // px

  var Krakout =

  // build game
  function Krakout(container) {
    var config = arguments.length <= 1 || arguments[1] === undefined ? defaultConfig : arguments[1];

    _classCallCheck(this, Krakout);

    var self = this;
    var canvasList = self._canvas = {}; // 存放画布的集合 球 板 背景 各种...

    // 初始化游戏
    function init() {
      // 创建基础的画布
      buildCanvas(['ball', 'board', 'layout'], buildScreen(container));

      new PlainBoard(canvasList['board']);
    }

    // 生成画布
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

    // 设置画布的宽高
    function buildScreen(container) {
      return function (canvas) {
        canvas.width = width;
        canvas.height = height;
        canvas.style.width = global.getComputedStyle(container).width;
        canvas.style.height = global.getComputedStyle(container).height;
      };
    }

    // 调用初始化方法
    init();
  };

  // 绘制图形的基类


  var ModuleBase = function () {
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
      this.regChange(['x', 'y', 'width', 'height']);
      this.initReady();
      // 绘制图形
      this.reDraw();
      this.initComplete();
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
        var config = this.last;
        if (!config) return;
        this.ctx.clearRect(config.x, config.y, config.width, config.height);
      }
      // 记录上次的属性信息 里边至少但不限于 x y width height

    }, {
      key: 'record',
      value: function record() {
        var last = this.last = {};
        for (var key in this.config) {
          last[key] = this.config[key];
        }
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
        // 记录本次绘制区域
        this.record();
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
        height: 40
      } : arguments[1];

      _classCallCheck(this, Board);

      // config.x = (width - config.width) / 2;
      // config.y = height - config.height;
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
      value: function initComplete() {
        var self = this;
        // 简单的测试下change方法好不好使
        setInterval(function () {
          console.log(self.config.x);
          self.change({
            x: +self.config.x + 1
          });
        }, 10);
      }
    }]);

    return PlainBoard;
  }(Board);

  return Krakout;
}, window);