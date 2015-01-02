<?php
/**
 * CakePHP(tm) : Rapid Development Framework (http://cakephp.org)
 * Copyright (c) Cake Software Foundation, Inc. (http://cakefoundation.org)
 *
 * Licensed under The MIT License
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) Cake Software Foundation, Inc. (http://cakefoundation.org)
 * @link          http://cakephp.org CakePHP(tm) Project
 * @package       app.View.Layouts
 * @since         CakePHP(tm) v 0.10.0.1076
 * @license       http://www.opensource.org/licenses/mit-license.php MIT License
 */
$cakeDescription = __d('cake_dev', 'CakePHP: the rapid development php framework');
$cakeVersion = __d('cake_dev', 'CakePHP %s', Configure::version())
?>
<!DOCTYPE html>
<html>
    <head>
        <?php echo $this->Html->charset(); ?>
        <title>
            <?php echo $cakeDescription ?>:
            <?php echo $this->fetch('title'); ?>
        </title>
        <?php
        echo $this->Html->meta('icon');

        echo $this->Html->css('styles');
        echo $this->Html->css('cake.generic.css');
        echo $this->Html->script('jquery-1.11.1.min.js');
        echo $this->Html->script('plugins/angular.js');
        echo $this->Html->css('plugins/jquery.datetimepicker.css');
        echo $this->Html->script('Journal.js');
        echo $this->Html->script('plugins/jquery.datetimepicker.js');
        echo $this->fetch('meta');
        echo $this->fetch('css');
        echo $this->fetch('script');
        ?>
    </head>
    <body class="white" ng-app="Journal" ng-init="$root.baseURL = '<?php echo $this->Html->url('/'); ?>'">
        <div id="container" ng-controller="JournalCtrl">
            <div id="header" ng-controller="JournalHeaderCtrl as headerCtrl">

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
                    <div>List</div>
                </div>
            </div>
            <div id="content">
                <?php echo $this->fetch('content'); ?>
            </div>
            <div id="footer" ng-controller="JournalFooterCtrl as footerCtrl">
                <footer>
                    <?php
                    echo $this->fetch('footer');
                    ?>
                </footer>
                <?php
                echo $this->Html->link(
                        $this->Html->image('cake.power.gif', array('alt' => $cakeDescription, 'border' => '0')), 'http://www.cakephp.org/', array('target' => '_blank', 'escape' => false, 'id' => 'cake-powered')
                );
                ?>
                <p>
                    <?php echo $cakeVersion; ?>
                </p>
            </div>
        </div>
        <?php echo $this->element('sql_dump'); ?>
    </body>
</html>
