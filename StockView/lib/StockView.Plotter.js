/**
 * Created by jian on 08/12/2014.
 */
var StockView_Plotter = (function(){
    var SVP = function(){

    }
    SVP.prototype.canddlePlotter = function(e){
            // This is the officially endorsed way to plot all the series at once.
            if (e.seriesIndex !== 0) return;

            var setCount = e.seriesCount;
            if (setCount != 4) {
                throw "Exactly 4 prices each point must be provided for candle chart (open close high low)";
            }

            var prices = [];
            var price;
            var sets = e.allSeriesPoints;
            for (var p = 0 ; p < sets[0].length; p++) {
                price = {
                    open : sets[0][p].yval,
                    close : sets[1][p].yval,
                    high : sets[2][p].yval,
                    low : sets[3][p].yval,
                    openY : sets[0][p].y,
                    closeY : sets[1][p].y,
                    highY : sets[2][p].y,
                    lowY : sets[3][p].y
                };
                prices.push(price);
            }

            var area = e.plotArea;
            var ctx = e.drawingContext;
            ctx.strokeStyle = '#202020';
            ctx.lineWidth = 0.6;

            // Find the minimum separation between x-values.
            // This determines the bar width.
            var points = e.points;
            var min_sep = Infinity;
            for (var i = 1; i < points.length; i++) {
                var sep = points[i].canvasx - points[i - 1].canvasx;
                if (sep < min_sep) min_sep = sep;
            }
            var bar_width = Math.floor(2.0 / 2.2 * min_sep);

            for (p = 0 ; p < prices.length; p++) {
                ctx.beginPath();

                price = prices[p];
                var topY = area.h * price.highY + area.y;
                var bottomY = area.h * price.lowY + area.y;
                var centerX = area.x + sets[0][p].x * area.w;
                ctx.moveTo(centerX, topY);
                ctx.lineTo(centerX, bottomY);
                ctx.closePath();
                ctx.stroke();
                var bodyY;
                if (price.open > price.close) {
                    ctx.fillStyle ='rgba(244,44,44,1.0)';
                    bodyY = area.h * price.openY + area.y;
                }
                else {
                    ctx.fillStyle ='rgba(44,244,44,1.0)';
                    bodyY = area.h * price.closeY  + area.y;
                }
                var bodyHeight = area.h * Math.abs(price.openY - price.closeY);
                ctx.fillRect(centerX - bar_width / 2, bodyY, bar_width,  bodyHeight);
            }
    }
    return SVP;
})();