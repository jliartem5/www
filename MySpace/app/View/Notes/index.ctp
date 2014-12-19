<?php debug($note); ?>
<div id="notes_content">
    <table>
        <thead>
            <tr>
                <th>Content</th>
                <th>Create Date</th>
            </tr>
        </thead>
        <tbody>
<?php
    foreach($notes as $index => $note){
?>
            <tr>
                <th><?php echo $note['value'] ?></th>
                <th><?php echo $note['crete_date']; ?></th>
                
            </tr>
<?php
    }
?>
        </tbody>
    </table>
</div>