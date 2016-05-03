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
    function init() {
      // 创建基础的画布
      var canvas = document.createElement('canvas');
      // 设置画布的宽高
      setScreen(container, canvas);
      // 将canvas添加至容器
      container.appendChild(canvas);

      var ctx = self.context = canvas.getContext('2d');
      ctx.font = "48px serif";
      ctx.fillText("Hello world", 10, 50);
    }

    function setScreen(container, canvas) {
      canvas.width = width;
      canvas.height = height;
      canvas.style.width = global.getComputedStyle(container).width;
      canvas.style.height = global.getComputedStyle(container).height;
    }

    init();
  }

  // 静态方法

  ;

  return Krakout;
}, window);