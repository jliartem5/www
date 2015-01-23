/**
 * Created by jian on 07/12/2014.
 * 
 */
var StockView = (function(){
    var SV =  function(element){
        this.root = element;
        this.plotter = new StockView_Plotter();
        this.chart_ticker = null; 
    };

    SV.prototype.start = function(csvData, onReady){
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
        if(onReady != undefined){
            this.dygraphs.ready(onReady);
        }
    };
    
    SV.prototype.setAnnotations = function(annotations){
        for(var i in annotations){
            annotations[i].x = this.chart_ticker.getMappedIndexFromVal(annotations[i].x);
        }
        this.dygraphs.setAnnotations(annotations);
    };

    SV.prototype.reset = function(){

    };
    
    return SV;
})();