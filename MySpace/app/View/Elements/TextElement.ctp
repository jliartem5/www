<?php
if (!isset($MODE)) {
    $MODE = 'show';
}
?>
<div class="element element_<?php echo strtolower($MODE); ?>" id="{{config.id}}">
    <div ng-show="$root.CurrentMode == $root.JournalMode.Edit">
        <label class="element-label" for="{{config.id}}">{{config.label}}</label>
        <input type="text" value="{{config.value}}" ng-model="config.value" id="{{config.id}}"/>
    </div>
    <div ng-show="$root.CurrentMode == $root.JournalMode.View">
        <label class="element-label" for="{{config.id}}">{{config.label}}:</label>
        <br>
        <div>{{config.value}}</div>
    </div>
    <div ng-show="$root.CurrentMode == $root.JournalMode.Preview">
        
        <label class="element-label" for="{{config.id}}">{{config.label}}:</label>
        <br>
        <div>Your text here</div>
    </div>
</div>