
<div class="template">
    <?php
    echo $this->Form->input('select_element', array('options' => array(
            'Text', 'Numeric', 'Date'
    )));
    ?>
    <ul id="template_grid">
        <?php
        foreach ($elements as $element) {
            echo '<li>'.$element['label'].'</li>';
        }
        ?>
    </ul>
</div>
<?php
$this->start('script');
echo $this->Html->script('jquery.gridster.min.js');
$this->end();
?>
<?php
$this->start
?>

<?php
$this->start('footer');
?>
<script type="text/javascript">
    $(function () {
        $('#select_element').change(function (index, value) {
            var type = $(this).find('option:selected').text();
            $.ajax({
                url: '<?php echo $this->Html->url('/notes/element/'); ?>' + type+'/preview',
                type: 'get',
                success: function (html) {
                    $('#template_grid').append('<li>'+html+'</li>');
                }
            });
        });
        
        
    });
</script>
<?php
$this->end();
?>