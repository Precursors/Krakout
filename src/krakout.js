'use strict';

;
((factory, global) => {
  global.Krakout = global.Krakout || factory(global);
})((global) => {
  let defaultConfig = {
    viewmode: 'fullscreen'
  };
  let width = 4096; // px
  let height = 2160; // px
  class Krakout {

    // build game
    constructor(container, config = defaultConfig) {
      let self = this;
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

      function setScreen (container, canvas) {
        canvas.width = width;
        canvas.height = height;
        canvas.style.width = global.getComputedStyle(container).width;
        canvas.style.height = global.getComputedStyle(container).height;
      }

      init();
    }


    // 静态方法

  }



  return Krakout;
}, window);
