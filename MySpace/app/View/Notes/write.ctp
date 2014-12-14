<h1>Add note</h1>
<?php
    echo $this->Form->create('notes',array('controller'=>'notes', 'action'=>'save'));
    echo $this->Element->generateMultiElement($DefaultConfig);
    echo $this->Form->end('Save');
?>