
<div class="template">
    <?php
    echo $this->Form->input('select_element', array('options' => array(
            'Text', 'Numeric', 'Date'
    )));
    ?>
    <ul id="template_grid">
        <?php
        foreach ($elements as $element) {
            echo '<li>' . $element['label'] . '</li>';
        }
        ?>
    </ul>
    <?php
        echo $this->Form->create('save_template');
        
        echo $this->end('Submit');
    ?>
</div>
<?php
$this->start('script');
echo $this->Html->script('jquery.gridster.min.js');
$this->end();
?>
<?php
$this->start('css');
echo $this->Html->css('jquery.gridster.min.css');
$this->end();
?>

<?php
$this->start('footer');
?>
<script type="text/javascript">
    $(function () {
        var gridster = $('#template_grid').gridster({
            widget_margins: [10, 10],
            widget_base_dimensions: [140, 140]
        }).data('gridster');
        
        $('#select_element').change(function (index, value) {
            var type = $(this).find('option:selected').text();
            $.ajax({
                url: '<?php echo $this->Html->url('/notes/element/'); ?>' + type + '/preview',
                type: 'get',
                success: function (html) {
                    gridster.add_widget('<li>' + html + '</li>');
                }
            });
        });
        
        $('#save_templace').submit(function(){
            var ajax_data = {};
            $('#template_grid li').each(function(index, item){
                var $element_config_data = $(item).find('.element_preview:first').data('config');
                ajax_data[$element_config_data['id']] = $element_config_data;
            });
            $.ajax({
                url:'<?php echo $this->Html->url('/notes/template_edit'); ?>',
                data:ajax_data,
                success:function(ret){
                    alert(ret);
                }
            });
            return false;
        });
    });
</script>
<?php
$this->end();
?>