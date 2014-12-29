<div ng-controller="JournalNoteCtrl as noteCtrl" ng-style="{height:getContentHeight()}">
    <gridster class="gridster ready" style="width:100%">
        <gridsterelement ng-repeat="config in getTemplateConfig()" config="config">
            
        </gridsterelement>
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
        });    </script>
    <?php
    $this->end();
    ?>
</div>