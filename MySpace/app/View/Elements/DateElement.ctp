<?php
if (!isset($MODE)) {
    $MODE = 'show';
}
?>
<div class="element element_<?php echo strtolower($MODE); ?>" id="<?php echo $ID; ?>">

    <?php
    if ($MODE == 'edit'):

        echo $this->Form->input($ID, $FRONT);
        echo $this->Form->input('__' . $ID, array('type' => 'hidden', 'value' => $BACK['config']));
        ?>
        <script>
            (function () {
                var dom = $('#<?php echo $ID; ?> input:first');
                dom.datetimepicker({
                });
            })();
        </script>
        <?php
    endif;
    if ($MODE == 'view'):
        echo $FRONT['label'] . ':</br>';
        echo $FRONT['value'];
    endif;
    if ($MODE == 'raw'):
        $BACK['id'] = $ID;
        echo json_encode(array_merge($BACK, $FRONT));
    endif;
    if ($MODE == 'preview'):

        echo $FRONT['label'] . ':</br>';
        echo '2014/09/04';
        $BACK['id'] = $ID;
        $element_config_data = json_encode(array_merge($BACK, $FRONT));
        ?>
        <script>
            (function () {
                var dom = $('#<?php echo $ID; ?>');
                var element_data = JSON.parse('<?php echo $element_config_data; ?>');
                dom.data('elementData', element_data);
            })();
        </script>
        <?php
    endif;
    ?>
</div>