
<div class="gridster ready" style="width:100%">
    <ul id="template_grid" style="position:relative; float: left;">
        <?php
        foreach ($note["note_element"] as $element) {
            $position_array = json_decode($element['position'], true);
            $row = $position_array['data-row'];
            $col = $position_array['data-col'];
            $sizex = $position_array['data-sizex'];
            $sizey = $position_array['data-sizey'];
            echo "<li data-row='$row' data-col='$col' data-sizex='$sizex' data-sizey='$sizey'>"
            . $this->Element->generateElement($element, ElementHelper::$MODE_VIEW)
            . '</li>';
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
        }).data('gridster').disable();

    });
</script>
<?php
$this->end();
?>