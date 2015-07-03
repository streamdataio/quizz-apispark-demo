/**
 * Created by ctranxuan on 29/05/15.
 */
var Color;

Color = (function() {
  function Color() {}

  Color.prototype.randomColors = function(quantity) {
    var a, c, i, index, ref;
    a = [];
    for (index = i = 0, ref = quantity; 0 <= ref ? i < ref : i > ref; index = 0 <= ref ? ++i : --i) {
      c = {};
      c.h = 360 / quantity * index;
      c.s = 50 + Math.random() * 10;
      c.l = 50 + Math.random() * 10;
      a.push({
        color: tinycolor(c).toHexString()
      });
    }
    return a;
  };

  return Color;

})();

window.color = new Color;