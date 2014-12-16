<h1>Add note</h1>

<?php
echo $this->Form->input('select_element', array('options' => array(
        'Text', 'Numeric', 'Date'
)));
echo $this->Form->create('notes', array('controller' => 'notes', 'action' => 'save'));
echo $this->Element->generateMultiElement($DefaultConfig);
?>
<div id="custom_elements"></div>
<?php
echo $this->Form->end('Save');
?>

<?php
$this->start('footer');
?>
<script type="text/javascript">
    $(function () {
        $('#select_element').change(function (index, value) {
            var type = $(this).find('option:selected').text();
            $.ajax({
                url: '<?php echo $this->Html->url('/notes/element/'); ?>' + type,
                type: 'get',
                success: function (html) {
                    $('#custom_elements').append(html);
                }
            });
        });
    });
</script>
<?php
$this->end();
?>