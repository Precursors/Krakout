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
      canvas.width = WIDTH;
      canvas.height = HEIGHT;
      canvas.style.position = 'absolute';
      canvas.style.top = 0;
      canvas.style.left = 0;
      canvas.style.width = WIDTH; //global.getComputedStyle(container).width;
      canvas.style.height = HEIGHT; //global.getComputedStyle(container).height;
      canvas.style.transform = `scale3d(${wrapWidth / WIDTH}, ${wrapHeight / HEIGHT}, 1)`;
      canvas.style.transformOrigin = 'top left';

      // 将canvas添加至容器
      container.appendChild(canvas);
    }
  }

  utils.buildScreen = buildScreen;
  utils.buildCanvas = buildCanvas;
})();
