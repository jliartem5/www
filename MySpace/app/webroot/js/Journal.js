/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

(function () {
    var app = angular.module('Journal', []);
    
    //JournalCtrl gerent les choses globaux
    app.controller('JournalCtrl', function ($scope, $rootScope) {
        $rootScope.JournalEvents = {
            Ping: 'Ping',
            SwitchJournalMode: 'switch-journal-mode',
            AddElement: 'add-element'
        };
        $rootScope.JournalMode = {
            View: 'view',
            Edit: 'edit',
            Preview: 'preview'
        };


        $rootScope.CurrentMode = $rootScope.JournalMode.Edit;
        
        $rootScope.switchJournalMode = function (mode) {
            var data = {oldMode: $rootScope.CurrentMode, newMode: mode};
            $rootScope.CurrentMode = mode;//Change mode
            $rootScope.$broadcast($rootScope.JournalEvents.SwitchJournalMode, data);
        };

    });

    app.controller('JournalHeaderCtrl', function ($scope, $rootScope) {
        $scope.availableElement = [
            {label: 'Text Element', type: "TextElement"},
            {label: 'Numeric Element', type: 'NumericElement'},
            {label: 'Date Element', type: 'DateElement'}
        ];
        $scope.$on($rootScope.JournalEvents.SwitchJournalMode, function (e, data) {
            console.log(data);
        });
    });
    app.directive('menuadd', function ($rootScope) {
        return {
            restrict: 'E',
            template: '<select>' +
                    '<option value="{{element.type}}" ng-repeat="element in availableElement">{{element.label}}</option>' +
                    '</select>',
            replace: true,
            transclude: false,
            link: function (scope, element, attr) {
                $(element).change(function (index, value) {
                    var type = $(this).find('option:selected').val();
                    $.ajax({
                        url: attr['url'] + type + '/edit',
                        type: 'get',
                        success: function (html) {
                            //on emet une evenement de AddElement pour tous les Controllers qui s'interesse
                            $rootScope.$broadcast($rootScope.JournalEvents.AddElement, html);
                        }
                    });
                });
            }
        };

    });



    app.controller('JournalNoteCtrl', function ($scope, $rootScope) {
        $scope.getContentHeight = function () {
            return '450px';
        };

        $scope.$on($rootScope.JournalEvents.AddElement, function (e, data) {
            $scope.gridster.add_widget('<li>' + data + '</li>');
        });

        $scope.$on($rootScope.JournalEvents.SwitchJournalMode, function (e, data) {

        });
    });

    app.directive('gridster', function () {
        return {
            restrict: 'E',
            template: '<div ><ul style="float:left" ng-transclude></ul></div>',
            replace: true,
            transclude: true,
            link: function (scope, element, attr) {
                var widthGrideCount = 40;
                var gridWidth = $(element).width() / widthGrideCount;

                var gridster = $(element).find('ul:first').gridster({
                    widget_margins: [5, 5],
                    widget_base_dimensions: [gridWidth, gridWidth],
                    resize: {
                        enabled: true
                    },
                    draggable: {
                        start: function () {
                            return false;
                        }
                    }
                }).data('gridster');

                scope.gridster = gridster;//Ajouter l'objet gridster au $scope
            }
        };

    });

    app.controller('JournalFooterCtrl', function ($scope) {


    });
})();
