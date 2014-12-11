/**
 * Created by jian on 07/12/2014.
 */
var StockView = (function(){
    var SV =  function(element){
        this.root = element;
        this.plotter = new StockView_Plotter();
    };

    SV.prototype.start = function(csvData){
        var $this = this;
        this.chart_ticker = new StockView_Ticker(csvData);
        this.dygraphs = new Dygraph(
            this.root,
            //csvData,
           this.chart_ticker.getFormattedCSVData(),
            {
                plotter:  $this.plotter.canddlePlotter,
                width: window.innerWidth * 0.9,
                height: window.innerHeight * 0.9,
                showRangeSelector:true,
                highlightCallback: function (e, x, x_obj) {

                },
                unhighlightCallback:function(e){

                },
                axes:{
                    x:{
                        ticker: this.chart_ticker.DiscontinuousDateTicker,
                        valueFormatter:function(s){
                            var mapping = $this.chart_ticker.mapping;

                            return mapping[s];
                        }
                    },
                    y2:{

                    }
                }
                });
    };

    SV.prototype.reset = function(){

    }
    return SV;
})();