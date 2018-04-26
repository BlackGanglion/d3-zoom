/**
 * 缩放因素 k
 * tx x 轴上的平移量
 * ty y 轴上的平移量
 */
export function Transform(k, x, y) {
  this.k = k;
  this.x = x;
  this.y = y;
}

/**
 * 对于 Canvas, context.translate(transform.x, transform.y); context.scale(transform.k, transform.k);
 * 对于 HTML，div.style("transform", "translate(" + transform.x + "px," + transform.y + "px) scale(" + transform.k + ")");
 * div.style("transform-origin", "0 0");
 * 对于 SVG，g.attr("transform", "translate(" + transform.x + "," + transform.y + ") scale(" + transform.k + ")");
 */
Transform.prototype = {
  constructor: Transform,
  // 缩放
  scale: function(k) {
    return k === 1 ? this : new Transform(this.k * k, this.x, this.y);
  },
  // 平移
  translate: function(x, y) {
    return x === 0 & y === 0 ? this : new Transform(this.k, this.x + this.k * x, this.y + this.k * y);
  },
  apply: function(point) {
    return [point[0] * this.k + this.x, point[1] * this.k + this.y];
  },
  applyX: function(x) {
    return x * this.k + this.x;
  },
  applyY: function(y) {
    return y * this.k + this.y;
  },
  // 变换值
  invert: function(location) {
    return [(location[0] - this.x) / this.k, (location[1] - this.y) / this.k];
  },
  invertX: function(x) {
    return (x - this.x) / this.k;
  },
  invertY: function(y) {
    return (y - this.y) / this.k;
  },
  rescaleX: function(x) {
    return x.copy().domain(x.range().map(this.invertX, this).map(x.invert, x));
  },
  rescaleY: function(y) {
    return y.copy().domain(y.range().map(this.invertY, this).map(y.invert, y));
  },
  toString: function() {
    return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")";
  }
};

// 初始值
export var identity = new Transform(1, 0, 0);

transform.prototype = Transform.prototype;

export default function transform(node) {
  // __zoom 主要存储了节点的 transform
  return node.__zoom || identity;
}
