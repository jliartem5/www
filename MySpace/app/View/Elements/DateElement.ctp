<?php
    if(!isset($MODE)){
        $MODE = 'show';
    }
?>
<div class="element element_<?php echo strtolower($MODE); ?>">
    <?php
        $FRONT['type']='numeric';
        echo $this->Form->input($ID, $FRONT);
        echo $this->Form->input('__'.$ID, array('type'=>'hidden', 'value'=>$BACK['config']));
    ?>
</div>