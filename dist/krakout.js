'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

;
(function (factory, global) {
  global.Krakout = global.Krakout || factory(global);
})(function (global) {
  var defaultConfig = {
    viewmode: 'fullscreen'
  };
  var width = 4096; // px
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

  return Krakout;
}, window);