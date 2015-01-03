<!DOCTYPE html>
<html>
    <head lang="en">
        <script type="text/javascript" src="lib/dygraphs/dygraph-combined-dev.js"></script>
        <script type="text/javascript" src="lib/jquery/jquery-1.11.1.min.js"></script>
        <script type="text/javascript" src="lib/jquery/jquery.csv-0.71.min.js"></script>
        <script type="text/javascript" src="lib/StockView.Plotter.js"></script>
        <script type="text/javascript" src="lib/StockView.Ticker.js"></script>
        <script type="text/javascript" src="lib/StockView.js"></script>
        <meta charset="UTF-8">
        <title></title>
    </head>
    <body>
        <div>
            <button>Back</button>
            <button>Pause</button>
            <button>Play</button>
        </div>
        <div id="chart"></div>
        <?php
        $stockTag = $_GET['s'];
        
        $yahooApi = "http://ichart.yahoo.com/table.csv?s=" . $stockTag . "&a=0&b=1&c=2014&d=11&e=31&f=2014&g=d";
        $data = "";

        $ch = curl_init();
        
        curl_setopt($ch, CURLOPT_URL, $yahooApi);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $result = curl_exec($ch);
        curl_close($ch);
        if ($result) {
            $data = array_reverse(str_getcsv($result,"\n"));
            $inter = $data[count($data)-1];
            $data[0] = $inter;
            unset($data[count($data)-1]);
            ?>
            <script type="text/javascript">
                var candleData =  <?php
                
                
                    foreach($data as $index=>$line){
                        $champ = explode(',', $line);
                        $is_last = $index <  count($data)-1;
                        echo "'".$champ[0].",".$champ[1].",".$champ[4].",".$champ[2].",".$champ[3]."\\n'".(!$is_last?";":"+")."\n";
                    }
                ?>

                var sv = new StockView(document.getElementById('chart'));
                sv.start(candleData);
            </script>

            <?php
        }
        ?>

    </body>
</html>