
<div ng-controller="JournalNoteCtrl as noteCtrl" ng-style="{height:getContentHeight()}" style="vertical-align: top; width: 74%; display: inline-block;">

    <div style="height:35px;">
        <div class="header-left">
            <div ng-show="$root.CurrentMode == $root.JournalMode.Edit">
                <menuadd url="{{$root.baseURL + 'notes/element/'}}">
                </menuadd>
                <button ng-click="$root.switchJournalMode($root.JournalMode.View)">View Mode</button>
            </div>
            <div ng-show="$root.CurrentMode == $root.JournalMode.View">
                <button ng-click="$root.switchJournalMode($root.JournalMode.Edit)">Edit Mode</button>
            </div>
            <div ng-show="$root.CurrentMode == $root.JournalMode.Preview">

            </div>
        </div>
        <div class="header-middle">
            <a href="http://localhost/StockView?s=GPRO" target="__blank">
                <span>Info </span>
                Gopro +4.65(<span style="color: green">5.77%</span>)
            </a>
        </div>
        <div class="header-right">
        </div>
    </div>

    <gridster class="gridster ready" style="width:100%" config="config">
    </gridster>
    <?php
    $this->start('script');
    echo $this->Html->script('jquery.gridster.js');
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
    <?php
    $this->end();
    ?>
</div>

<div ng-controller="JournalMenuControl as menuCtrl" ng-style="{height:getContentHeight()}" style="vertical-align: top; width: 25%; display: inline-block;">

    <div style="height:35px;">
        <button ng-click="newClick()">New</button>
    </div>
    <div>
        <ul>
            <li ng-repeat="note in notes">
                <a href="#" ng-click="switchNote(note)">{{note.id| limitTo:10}}</a>
            </li>
        </ul>
    </div>
</div>