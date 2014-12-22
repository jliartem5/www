<?php debug($notes); ?>
<div id="notes_content">
    <table>
        <thead>
            <tr>
                <th>Content</th>
                <th>Create Date</th>
                <th>View</th>
            </tr>
        </thead>
        <tbody>
<?php
    foreach($notes as $index => $note){
?>
            <tr>
                <th><?php echo $note['Notes']['id'] ?></th>
                <th><?php echo $note['Notes']['create_date']; ?></th>
                <th><?php echo $this->Html->link('Check detail',array('controller'=>'notes', 'action'=>'view', $note['Notes']['id'])); ?></th>
            </tr>
<?php
    }
?>
        </tbody>
    </table>
</div>