<div class="element">
    <?php
        $FRONT['type']='numeric';
        echo $this->Form->input($ID, $FRONT);
        echo $this->Form->input('__'.$ID, array('type'=>'hidden', 'value'=>$BACK['config']));
    ?>
</div>