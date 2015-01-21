<?php
if (!isset($MODE)) {
    $MODE = 'show';
}
?>
<div class="element element_<?php echo strtolower($MODE); ?>">

    <div ng-show="$root.CurrentMode == $root.JournalMode.Edit">
        <label class="element-label" for="{{config.id}}">{{config.label}}</label>
        <input picker-datetime type="text" value="{{config.value}}" ng-model="config.value" id="{{config.id}}"/>
        
    </div>
    <div ng-show="$root.CurrentMode == $root.JournalMode.View">
        <label class="element-label" for="{{config.id}}">{{config.label}}:</label>
        <br>
        <div>{{config.value}}</div>
    </div>
    <div ng-show="$root.CurrentMode == $root.JournalMode.Preview">

        <label class="element-label" for="{{config.id}}">{{config.label}}:</label>
        <br>
        <div>2014/09/04</div>
    </div>
    
</div>