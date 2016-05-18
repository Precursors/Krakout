'use strict';

class Krakout {

  // build game
  constructor(container, config = {}) {
    const WIDTH = 4096; // 默认宽度
    const HEIGHT = 2160; // 默认高度
    let self = this; // 指向当前游戏的实例
    let canvasList; // 存放画布的集合 球 板 背景 各种...
    let width = self.width = config.width || WIDTH;
    let height = self.height = config.height || HEIGHT;
    let screenWidth = self.screenWidth = parseFloat(getComputedStyle(container).width); // 容器的宽度
    let ratioWidth = self.ratioWidth = (screenWidth / width); // 宽度缩放比例
    let screenHeight = self.screenHeight = parseFloat(getComputedStyle(container).height); // 容器的高度
    let ratioHeight = self.ratioHeight = (screenHeight / height); // 高度缩放比例

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

      container.addEventListener('mousemove', e => {

        board.change({
          x: e.screenX / self.ratioWidth
        })
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
          for (let key in tag) {
            canvasList[tag[key]] = buildCanvas(container, tag[key], callback);
          }
          return canvasList;
        } else {
          // 创建画布
          var canvas = document.createElement('canvas');
          // 设置唯一标识符
          canvas.id = canvas.className = `krakout-canvas-${tag}`;

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
        return canvas => {

          // 设置canvas的各种属性
          canvas.width = width;
          canvas.height = height;
          canvas.style.position = 'absolute';
          canvas.style.top = 0;
          canvas.style.left = 0;
          canvas.style.width = width; //global.getComputedStyle(container).width;
          canvas.style.height = height; //global.getComputedStyle(container).height;
          canvas.style.transform = `scale3d(${wrapWidth / width}, ${wrapHeight / height}, 1)`;
          canvas.style.transformOrigin = 'top left';

          // 将canvas添加至容器
          container.appendChild(canvas);
        }

        // 调用初始化方法

      }
    }

    init();
  }

}

Krakout.module = Krakout.module || {};
Krakout.getMod = function (key) {
  return Krakout.module[key];
}
Krakout.prototype.loadMod = function (key, ...attr) {
  return new (Krakout.getMod(key))(...attr);
}
