<h1>Add note</h1>


<?php
echo $this->Form->input('select_element', array('options' => array(
        'Text', 'Numeric', 'Date'
)));

echo $this->Form->create('notes', array('controller' => 'notes', 'action' => 'save'));
?>
<div class="gridster ready" style="width:100%">
    <ul id="template_grid" style="position:relative; float: left;">
        <?php
        foreach ($DefaultConfig as $element) {
            $position_array = json_decode($element['position'], true);
            $row = $position_array['data-row'];
            $col = $position_array['data-col'];
            $sizex = $position_array['data-sizex'];
            $sizey = $position_array['data-sizey'];
            echo "<li data-row='$row' data-col='$col' data-sizex='$sizex' data-sizey='$sizey'>"
            . $this->Element->generateElement($element, ElementHelper::$MODE_EDIT)
            . '</li>';
        }
        ?>

    </ul>

    <?php
    echo $this->Form->end('Save');
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
        var gridWidth = $('.gridster').width() / 10;
        var gridster = $('#template_grid').gridster({
            widget_margins: [5, 5],
            widget_base_dimensions: [gridWidth, 50],
            resize: {
                enabled: false
            },
            draggable: {
                start: function () {
                    return false;
                }
            }
        }).data('gridster');

        $('#select_element').change(function (index, value) {
            var type = $(this).find('option:selected').text();
            $.ajax({
                url: '<?php echo $this->Html->url('/notes/element/'); ?>' + type + '/edit',
                type: 'get',
                success: function (html) {
                    gridster.add_widget('<li>' + html + '</li>');
                }
            });
        });
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