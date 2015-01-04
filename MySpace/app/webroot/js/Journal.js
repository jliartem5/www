/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

(function () {
    var app = angular.module('Journal', []);


    app.factory('UtilsService', function () {
        return {
            uniqueId: function () {
                function _p8(s) {
                    var p = (Math.random().toString(16) + "000000000").substr(2, 8);
                    return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
                }
                return _p8() + _p8(true) + _p8(true) + _p8();
            },
            isUniqueId: function (str) {
                return str.indexOf('-') !== -1;
            },
            clone: function (obj) {
                var copy;

                // Handle the 3 simple types, and null or undefined
                if (null == obj || "object" != typeof obj)
                    return obj;

                // Handle Date
                if (obj instanceof Date) {
                    copy = new Date();
                    copy.setTime(obj.getTime());
                    return copy;
                }

                // Handle Array
                if (obj instanceof Array) {
                    var itemArray = [];
                    
                    for(var index in obj){
                        itemArray.push(this.clone(obj[index]));
                    }
                    return itemArray;
                }

                // Handle Object
                if (obj instanceof Object) {
                    copy = {};
                    for (var attr in obj) {
                        if (obj.hasOwnProperty(attr))
                            copy[attr] = this.clone(obj[attr]);
                    }
                    return copy;
                }

                throw new Error("Unable to copy obj! Its type isn't supported.");
            }
        };
    });
    app.factory('NoteTemplateManagerService', function ($rootScope, $http) {

        //Default user template data, les données sone en mode prive
        var templateConfig = {};

        //Template array for every element disponible on the page
        var elementsTemplate = {};

        var noteController = {
            setTemplateConfig: function (c) {
                templateConfig = c;
                //jeter un evenement pour ceux qui l'interesse
                //(dans le cas de ajax, il aura fallu permettre aux autres controller/directive de 
                //faire quelque choses quand templateConfig est modifié)
                $rootScope.$broadcast($rootScope.JournalEvents.ServiceSetTemplateConfig, c);
                this.onTemplateConfig(c);
            },
            onTemplateConfig: function (c) {
            },
            getTemplateConfig: function () {
                return templateConfig;
            },
            setElementsTemplate: function (t) {
                $rootScope.$broadcast($rootScope.JournalEvents.ServiceSetElementsTemplate, t);
                elementsTemplate = t;

            },
            getElementsTemplate: function () {
                return elementsTemplate;
            },
            addElementTemplate: function (templateName, html) {
                if (elementsTemplate[templateName] === undefined) {
                    elementsTemplate[templateName] = html;

                }
            }

        };
        return noteController;
    });

    app.factory('GridsterShareService', function ($compile, $rootScope, $http, NoteTemplateManagerService, UtilsService) {
        var gridster = undefined;

        //pointer to current note data index in gridsterNotesData
        var currentNodeDataIndex = undefined;

        //Current note data/status in gridster
        var gridsterNotesData = [];


        function _addWidget(scope, widget, sizeX, sizeY, x, y) {
            if (scope.config === undefined) {
                throw "Must set widget config in the scope";
            }
            var c = scope.config;
            var unbindWatcher = scope.$watch("config", function (newVal, oldVal) {
            }, true);

            if (gridster !== undefined) {
                if (typeof (sizeX) !== typeof (0)) {
                    sizeX = parseInt(sizeX);
                }
                if (typeof (sizeY) !== typeof (0)) {
                    sizeY = parseInt(sizeY);
                }
                if (typeof (x) !== typeof (0)) {
                    x = parseInt(x);
                }
                if (typeof (y) !== typeof (0)) {
                    y = parseInt(y);
                }
                gridster.add_widget(widget, sizeX, sizeY, x, y);
                $rootScope.$broadcast($rootScope.JournalEvents.GridsterAddWidget, widget);
            } else {
                console.log('undefined girdster');
            }
        }
        ;

        var gridsterObj = {
        };

        gridsterObj.setGridster = function (gr) {
            console.log('set gridster');
            gridster = gr;
        };
        gridsterObj.getGridster = function () {
            return gridster;
        };

        /**
         * 
         * @param {type} scope
         * @param {type} noteID
         * @returns {undefined}
         */
        gridsterObj.switchNote = function (scope, noteData) {
            console.log(noteData);
            var exists = true;
            var noteID = noteData.id;

            if (gridsterNotesData[noteID] == undefined || gridsterNotesData[noteID] == null) {
                exists = false;
            }

            //work...
            var processFunc = function (data) {
                gridster.remove_all_widgets();
                for (var index in data) {
                    var elementData = data[index]['NoteElement'] === undefined ? data[index] : data[index]['NoteElement'];
                    var positionArr = JSON.parse(elementData['position']);
                    var elementHTML = $('<li></li>');
                    elementHTML.html(NoteTemplateManagerService.getElementsTemplate()[elementData.type]);
                    var copyScope = null;
                    //save scope in data
                    if (data[index].angular === undefined) {
                        copyScope = scope.$new(true);
                        data[index].angular = {scope: copyScope};
                    } else {
                        copyScope = data[index].angular.scope;
                    }

                    copyScope.config = elementData;
                    $compile(elementHTML)(copyScope);
                    _addWidget(copyScope,
                            elementHTML,
                            positionArr['data-sizex'],
                            positionArr['data-sizey'],
                            positionArr['data-col'],
                            positionArr['data-row']);
                }

            };

            if (exists === false) {
                var url = $rootScope.baseURL + "notes/noteElements/" + noteID;
                $http.post(url, {}).success(function (elementsData, status, headers, config) {
                    gridsterNotesData[noteID] = {note: noteData, elements: elementsData};
                    processFunc(elementsData);
                });

            } else {
                processFunc(gridsterNotesData[noteID].elements);
            }
        };

        gridsterObj.newNote = function (scope) {
            gridster.remove_all_widgets();
            var defaultConfig = UtilsService.clone(NoteTemplateManagerService.getTemplateConfig());
            console.log(defaultConfig);
            for (var index in defaultConfig) {
                var positionArr = JSON.parse(defaultConfig[index].position);
                var type = defaultConfig[index].type;
                var element = $('<li></li>');
                element.html(NoteTemplateManagerService.getElementsTemplate()[type]);
                //Il faut compiler l'element pour qu'il réagit comme une page AngularJs
                //Sinon tous les directives comme {{name}} ne sera pas compilé
                var copyScope = scope.$new(true);
                copyScope.config = defaultConfig[index];

                $compile(element)(copyScope);
                _addWidget(copyScope,
                        element,
                        positionArr['data-sizex'],
                        positionArr['data-sizey'],
                        positionArr['data-col'],
                        positionArr['data-row']);
            };
        };

        return gridsterObj;
    });

    //JournalCtrl gerent les choses globaux
    app.controller('JournalCtrl', function ($scope, $rootScope, $http, $window, GridsterShareService) {
        $rootScope.JournalEvents = {
            Ping: 'Ping',
            SwitchJournalMode: 'switch-journal-mode',
            GridsterAddWidget: 'gridster-add-widget',
            ReiceiveDefaultTemplate: 'reiceive-defaukt-template',
            ServiceSetTemplateConfig: 'service-set-template-config',
            ServiceSetElementsTemplate: 'service-set-elements-template'
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

        //resize event
        var w = angular.element($window);
        w.bind('resize', function (event) {
        });
    });

    app.controller('JournalHeaderCtrl', function ($scope, $rootScope, NoteTemplateManagerService) {
        $scope.$on($rootScope.JournalEvents.SwitchJournalMode, function (e, data) {
        });
    });



    app.controller('JournalNoteCtrl', function ($scope, $rootScope, $http, NoteTemplateManagerService) {
        $scope.getContentHeight = function () {
            return '450px';
        };

        $scope.getTemplateConfig = function () {
            return NoteTemplateManagerService.templateConfig;
        };


        //get default template data and fill $scope.template objet
        $http.post($rootScope.baseURL + 'notes/templateConfig', {}).
                success(function (data, status, headers, config) {
                    NoteTemplateManagerService.setElementsTemplate(data['elementTemplate']);
                    NoteTemplateManagerService.setTemplateConfig(data['templateConfig']);
                }).
                error(function (data, status, headers, config) {

                });
    });

    app.controller('JournalMenuControl', function ($scope, $http, $rootScope, GridsterShareService) {

        $scope.notes = [];

        $http.post($rootScope.baseURL + 'notes/allNotes', {}).
                success(function (data, status, headers, config) {
                    for (var index in data) {
                        var note = data[index];
                        $scope.notes.push(note['Notes']);
                    }
                }).
                error(function (data, status, headers, config) {

                });

        $scope.switchNote = function (noteData) {
            GridsterShareService.switchNote($scope, noteData);
        };

        $scope.newClick = function () {
            GridsterShareService.newNote($scope);
        };
    });

    /**
     * 
     * BUG : dans la fonction addWidget() si data-sizey est different pour chaque element alors la page se fige
     * Solution: depalcer l'ajout des widgets dans directive "·gridster"
     */
    /*
     app.directive('gridsterelement', function ($rootScope, NoteTemplateManagerService, GridsterShareService) {
     return {
     restrict: 'E',
     template: '<li data-row="{{getPositionRow()}}" data-col="{{getPositionColone()}}" data-sizex="{{getPositionWidth()}}" data-sizey="{{getPositionHeight()}}"></li>',
     replace: true,
     transclude: true,
     scope: {
     config: '='
     },
     link: function (scope, element, attr) {
     scope.$watch(attr.config, function (a) {
     if (NoteTemplateManagerService.elementTemplate[a.type] !== undefined) {
     //Make a copy for config data
     scope.templateConfig = (JSON.parse(JSON.stringify(a)));
     if (typeof (scope.templateConfig['position']) === typeof ("")) {
     scope.templateConfig['position'] = JSON.parse(scope.templateConfig['position']);
     }
     scope.template = NoteTemplateManagerService.elementTemplate[a.type];
     $(element).html(scope.template);
     var positionArr = scope.templateConfig.position;
     GridsterShareService.addWidget(element,
     positionArr['data-sizex'],
     positionArr['data-sizey'],
     positionArr['data-col'],
     positionArr['data-row']);
     }
     });
     
     scope.getPositionRow = function () {
     if (scope.templateConfig != undefined)//
     return scope.templateConfig['position']['data-row'];
     };
     
     scope.getPositionColone = function () {
     if (scope.templateConfig != undefined)
     return scope.templateConfig.position['data-col'];
     };
     scope.getPositionWidth = function () {
     if (scope.templateConfig != undefined)
     return scope.templateConfig.position['data-sizex'];
     };
     scope.getPositionHeight = function () {
     if (scope.templateConfig != undefined)
     return scope.templateConfig.position['data-sizey'];
     };
     
     }
     };
     });*/

    app.directive('gridster', function (GridsterShareService, NoteTemplateManagerService, $rootScope, $compile) {
        return {
            restrict: 'E',
            template: '<div ><ul style="float:left" ng-transclude></ul></div>',
            replace: true,
            transclude: true,
            scope: true,
            link: function (scope, element, attr) {

                var widthGrideCount = 20;
                var gridWidth = Math.round($(element).width() / widthGrideCount);
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
                GridsterShareService.setGridster(gridster);

                scope.$on($rootScope.JournalEvents.ServiceSetTemplateConfig, function (e, config) {
                    GridsterShareService.newNote(scope);//new note
                });
            }
        };

    });



    app.directive('menuadd', function ($rootScope, $compile, NoteTemplateManagerService, GridsterShareService, UtilsService) {
        return {
            restrict: 'E',
            template: '<select>' +
                    '<option value="{{element.type}}" ng-repeat="element in availableElement">{{element.label}}</option>' +
                    '</select>',
            replace: true,
            transclude: false,
            link: function (scope, element, attr) {

                scope.availableElement = [
                    {label: 'Text Element', type: "TEXT"},
                    {label: 'Numeric Element', type: 'NUMERIC'},
                    {label: 'Date Element', type: 'DATE'}
                ];

                $(element).change(function (index, value) {
                    var type = $(this).find('option:selected').val();
                    var templates = NoteTemplateManagerService.getElementsTemplate();
                    if (templates[type] === undefined) {
                        $.ajax({
                            url: attr['url'] + type + '/edit',
                            type: 'get',
                            success: function (html) {
                                //on emet une evenement de AddElement pour tous les Controllers qui l'interesse
                                NoteTemplateManagerService.addElementTemplate(type, html);
                                scope.$apply(function () {
                                    var element = $('<li></li>');
                                    element.html(NoteTemplateManagerService.getElementsTemplate()[type]);

                                    var copyScope = scope.$new(true);
                                    copyScope.config = {id: UtilsService.uniqueId()};
                                    $compile(element)(copyScope);
                                    GridsterShareService.addWidget(copyScope, element);
                                });
                            }
                        });
                    } else {
                        scope.$apply(function () {
                            var element = $('<li></li>');
                            element.html(NoteTemplateManagerService.getElementsTemplate()[type]);

                            var copyScope = scope.$new(true);
                            copyScope.config = {id: UtilsService.uniqueId()};
                            $compile(element)(copyScope);
                            GridsterShareService.addWidget(copyScope, element);

                        });
                    }
                    ;
                });
            }
        };

    });

    app.directive('dateTimePicker', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                $(element).datetimepicker({});
            }
        };
    });

    app.controller('JournalFooterCtrl', function ($scope) {


    });
})();
