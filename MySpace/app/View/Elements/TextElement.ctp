<?php
if (!isset($MODE)) {
    $MODE = 'show';
}
?>
<div class="element element_<?php echo strtolower($MODE); ?>">

    <?php
    if ($MODE == 'edit'):

        $FRONT['type'] = 'text';
        echo $this->Form->input($ID, $FRONT);
        echo $this->Form->input('__' . $ID, array('type' => 'hidden', 'value' => $BACK['config']));
    endif;
    if ($MODE == 'show'):
        echo $FRONT['label'].':';
        echo $FRONT['value'];
    endif;
    if($MODE == 'raw'):
        $BACK['id']=$ID;
        echo json_encode(array_merge($BACK, $FRONT));
    endif;
    if($MODE == 'preview'):
        echo $FRONT['label'].':';
        echo $FRONT['value'];
    endif;
    ?>
</div>