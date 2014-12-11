/**
 * Created by jian on 08/12/2014.
 */
/**
 * CSV Data Format:
 *
 * datetime,val1,val2,val3....
 *
 * **/
var StockView_Ticker = (function(){


    /******************
     *
     * Static value zone
     *
     */
    //Sauvegarder 'this' dans une variables exterieur pour les fonction callback d'apres
    var $this;
    var AcceptedGranularities = [
        Dygraph.DAILY,
        Dygraph.TWO_DAILY,
        Dygraph.WEEKLY ,
        Dygraph.MONTHLY,
        Dygraph.QUARTERLY ,
        Dygraph.BIANNUAL,
        Dygraph.ANNUAL
    ];

    /**
     * Private Functions
     *
     * Mapping structure:
     * 1:1999/01/01
     * 2:1999/01/02
     * 3:1999/01/10
     * 4:....
     *
     */

    function acceptedGranularitie(granuID){

        for(gran in AcceptedGranularities){

            if(AcceptedGranularities[gran] == granuID){
                return true;
            }

        }
        return false;
    }

    function calculDateMapping(SVT){
        SVT.mapping = [];
        SVT.formatedCSV = '';
        for(line in SVT.arrayData){
            var data = SVT.arrayData[line];
            if(line == 0){//header
                SVT.formatedCSV += data.join()+'\n';

            }else{//data
                SVT.mapping[line] = data[0];
                data[0] = line;

                //Ensuite on doit reconstruire csv
                SVT.formatedCSV += data.join()+'\n';
            }
        }
    }
    /***************
     *
     * Class content
     *
     *
     *
     * ************/
    var SVT = function(csvData){
        $this = this;
        if(csvData != undefined){
            this.arrayData = $.csv2Array(csvData);
            calculDateMapping(this);
        }
    };

    SVT.prototype.setCSVData = function(csvData){
        if(csvData != undefined){
            this.arrayData = $.csv2Array(csvData);
            calculDateMapping(this);
        }else{
            throw 'CSV data parameter is required';
        }
    }
    SVT.prototype.getFormattedCSVData = function(){
        if(this.mapping == undefined || this.arrayData == undefined || this.formatedCSV == undefined){
            throw 'CSV data must be setted';
        }
        return this.formatedCSV;
    }

    SVT.prototype.DiscontinuousDateTicker = function(min, max, pixels, opts, dygraph, vals){

        if($this.mapping == undefined){
            throw 'CSV data must be set for the first time';
        }
        var beginIndex = Math.floor(min);
        var endIndex = Math.floor(max);
        if(beginIndex < 1
            || beginIndex > $this.mapping.length
            || endIndex < 1
            || endIndex > $this.mapping.length){
            return [];
        }

        var beginDate = new Date($this.mapping[beginIndex]);
        var endDate = new Date($this.mapping[endIndex]);
        //example: min = 1.50 pour la date entre 1999/01/01 et 1999/01/02 est 
        //(1.5-1) * (1999/01/02 - 1999/01/01) = 1999/01/01 12:00:00
        var zoomedBeginDateTime =  (new Date($this.mapping[beginIndex+1]).getTime() -
            beginDate.getTime()) * (min - beginIndex) + beginDate.getTime();
        var zoomedEndDateTime = endDate.getTime();
        if(endIndex < $this.mapping.length - 1){
            zoomedEndDateTime = (new Date($this.mapping[endIndex + 1]).getTime() - endDate.getTime()) *
            (max - endIndex) + endDate.getTime();
        }
        var chosen = Dygraph.pickDateTickGranularity(zoomedBeginDateTime, zoomedEndDateTime, pixels, opts);
        var step = Dygraph.TICK_PLACEMENT[chosen].step;


        var smoothedTickers = [];
        if(acceptedGranularitie(chosen)){
            //But we will not default genered date, it's not 'Smooth'
            var anchorDayOffset = 0;

            while(anchorDayOffset <= endIndex){
                if(anchorDayOffset < beginIndex){
                    anchorDayOffset += step;
                    continue;
                }
                var index = anchorDayOffset;

                var date = new Date($this.mapping[index]);
                smoothedTickers.push({
                    v: index,
                    label: date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate()
                });
                anchorDayOffset += step;
            }
        }
        return smoothedTickers;
    };

    return SVT;
})();
