<h1>Add note</h1>


<?php
//echo $this->Form->create('notes', array('controller' => 'notes', 'action' => 'save'));
?>
<gridster class="gridster ready" style="width:100%">
        <?php
        debug($DefaultConfig);
        foreach ($DefaultConfig as $element) {
            $position_array = json_decode($element['position'], true);
            $row = $position_array['data-row'];
            $col = $position_array['data-col'];
            $sizex = $position_array['data-sizex'];
            $sizey = $position_array['data-sizey'];
            echo "<li data-row='$row' data-col='$col' data-sizex='$sizex' data-sizey='$sizey'>"
            . $this->Element->genaerateElement($element, ElementHelper::$MODE_EDIT)
            . '</li>';
        }
        ?>
    <?php
   // echo $this->Form->end('Save');
    ?>
</gridster>
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
        $('#save_template').click(function () {
            var ajax_data = {};
            $('#template_grid li').each(function (index, item) {
                var $element_config_data = $(item).find('.element_preview:first').data('elementData');
                $element_config_data['position'] = {
                    'data-row': $(item).attr('data-rowa'),
                    'data-col': $(item).attr('data-col'),
                    'data-sizex': $(item).attr('data-sizex'),
                    'data-sizey': $(item).attr('data-sizey')
                };
                ajax_data[$element_config_data['id']] = $element_config_data;
            });
            console.log(ajax_data);
            $.ajax({
                url: '<?php echo $this->Html->url('/notes/template_edit'); ?>',
                data: ajax_data,
                type: 'post',
                success: function (ret) {
                    $('#ajax_result').html(ret);
                }
            });
        });
    });
</script>
<?php
$this->end();
?>