<?php
if (!isset($MODE)) {
    $MODE = 'show';
}
?>
<div  class="element element_<?php echo strtolower($MODE); ?>">
    <div ng-show="$root.CurrentMode == $root.JournalMode.Edit">
        <label class="element-label" for="_{{config.id}}">{{config.label}}</label>
        <div text-angular="text-angular" ng-model="config.value"></div>
    </div>
    <div ng-show="$root.CurrentMode == $root.JournalMode.View">
        <label class="element-label">{{config.label}}:</label>
        <br>
        <div>{{config.value}}</div>
    </div>
    <div ng-show="$root.CurrentMode == $root.JournalMode.Preview">
        
        <label class="element-label">{{config.label}}:</label>
        <br>
        <div>Your text here</div>
    </div>
</div>