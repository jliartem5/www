<?php
if (!isset($MODE)) {
    $MODE = 'show';
}
?>
<div class="element element_<?php echo strtolower($MODE); ?>" id="<?php echo $ID; ?>">

    <?php
    if ($MODE == 'edit'):

        $FRONT['type'] = 'text';
        echo $this->Form->input($ID, $FRONT);
        echo $this->Form->input('__' . $ID, array('type' => 'hidden', 'value' => $BACK['config']));
    endif;
    if ($MODE == 'show'):
        echo $FRONT['label'] . ':';
        echo $FRONT['value'];
    endif;
    if ($MODE == 'raw'):
        $BACK['id'] = $ID;
        echo json_encode(array_merge($BACK, $FRONT));
    endif;
    if ($MODE == 'preview'):

        echo 'Title:';
        echo 'Your text here';
        $BACK['id'] = $ID;
        $element_config_data = json_encode(array_merge($BACK, $FRONT));
        ?>
        <script>
            (function () {
                var element_data = '<?php echo str_replace($element_config_data, "'", '"'); ?>';
                $('#<?php echo $ID; ?>').data('config', element_data);
            })();
        </script>
        <?php
    endif;
    ?>
</div>