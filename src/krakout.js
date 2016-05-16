'use strict';
window.config = {};
window.config.WIDTH = 4096; // px 默认的游戏宽度 目前写死 宽高全靠缩放
window.config.HEIGHT = 2160; // px

let WIDTH = window.config.WIDTH;
let HEIGHT = window.config.HEIGHT;
let defaultConfig = {};
class Krakout {

  // build game
  constructor(container, config = defaultConfig) {

    let self = this;  // 指向当前游戏的实例
    let canvasList; // 存放画布的集合 球 板 背景 各种...
    let screenWidth = self.screenWidth = parseFloat(getComputedStyle(container).width); // 容器的宽度
    let ratioWidth = self.ratioWidth = (screenWidth / WIDTH); // 宽度缩放比例
    let screenHeight = self.screenHeight = parseFloat(getComputedStyle(container).height); // 容器的高度
    let ratioHeight = self.ratioHeight = (screenHeight / HEIGHT); // 高度缩放比例

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

      container.addEventListener('mousemove', e => {

        board.change({
          x: e.screenX / self.ratioWidth
        })
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
  accessMove(self) {
    var x = self.config.x;
    var y = self.config.y;
    var position = {};

    // 默认是往左上移动（我乐意）
    if (x <= 0 || (x + self.config.width) >= WIDTH) {
      self.offsetX = ~self.offsetX + 1;
    }
    if (y <= 0 || (y + self.config.width) >= HEIGHT) {
      self.offsetY = ~self.offsetY + 1;
    }
    self.change({
      x: x - self.offsetX,
      y: y - self.offsetY
    });
  }

}
