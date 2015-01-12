/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

(function () {
    var app = angular.module('Journal', ['textAngular']);
    app.filter('get', function () {
        return function (input, index) {
            return input[index];
        };
    });

    app.factory('RemoteSaveService', function ($rootScope, NoteDataService) {
        var url = "http://localhost:3000";
        var socket = null;

        function _init() {
            if (socket == null) {
                socket = io.connect(url);


                socket.on('connect', function () {
                    socket.emit('identify', {
                        type: 'cache',
                        security_key: $rootScope.security_key
                    });
                    console.log('connected to ' + url);
                });

                socket.on('identify-resp', function (data) {

                    console.log('Identify ok');
                });

                socket.on('save-resp', function (resp) {
                    console.log('save ' + resp);
                });
                /**
                 * Synchronise id after save new element/note
                 * Sync structure:
                 *   {
                 *    Note:{from:id, to:id},
                 *    NoteElements:[{from:id, to:id},...] //elements to sync
                 *   }
                 *
                 * */
                socket.on('sync', function (noteIdToSync) {
                    var data = NoteDataService.getNoteData();
                    if (noteIdToSync['Note'] != undefined) {
                        for (var i in data) {
                            if (data[i].note.id == noteIdToSync['Note'].from) {
                                data[i].note.id = noteIdToSync['Note'].to;

                                if (noteIdToSync['NoteElements'] !== undefined) {//Sync element id

                                    for (var i in data[i]['elements']) {
                                        for (var j in noteIdToSync['NoteElements'])
                                            if (data[i]['elements'].id == noteIdToSync['NoteElements'][j].from) {
                                                data[i]['elements'].id = noteIdToSync['NoteElements'][j].to;
                                            }
                                    }
                                }

                                //Apply all scope and update id on html page
                                for (var s in data[i].scope) {
                                    data[i].scope[s].$apply();
                                }

                                break;
                            }
                        }
                    }
                });

                socket.on('update-resp', function (resp) {
                    console.log('update ' + resp);
                });

                socket.on('delete-resp', function () {

                });

                socket.on('restore-resp', function () {

                });

                socket.on('clear-resp', function (resp) {
                    console.log('clear ' + resp);
                });
            }
        }
        return {
            /**
             * new_Note_Data: New note to handler after save current note, can be null
             * */
            save: function (new_Note_Data) {
                _init();
                socket.emit('save', {
                    new_note_data: new_Note_Data
                });
            },
            //update an element data
            update: function (dataToUpdate) {
                _init();
                socket.emit('update', dataToUpdate);
            },
            //Delete an element data
            delete: function (dataToDelete) {
                _init();
                socket.emit('delete', dataToDelete);
            },
            //restore deleted data ?
            restore: function (dataToRestore) {
                _init();
                socket.emit('restore', dataToRestore);
            }
        };
    });

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

                    for (var index in obj) {
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

        //Template array for every element on the page
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

    app.factory('NoteDataService', function () {


        //Current note data/status in gridster
        /**
         *  [{
         note:{},
         elements:[],
         scope:[]
         }, ...]
         * 
         * 
         * */
        var notesData = [];
        return {
            getNoteData: function () {
                return notesData;
            }
        };
    });

    app.factory('GridsterShareService', function ($compile, $rootScope, $http, NoteTemplateManagerService, UtilsService, RemoteSaveService, NoteDataService) {
        var gridster = undefined;

        //pointer to current note data index in gridsterNotesData
        var currentNodeDataID = null;
        var gridsterNotesData = NoteDataService.getNoteData();

        function _addWidget(scope, widget, sizeX, sizeY, x, y) {
            if (scope.config === undefined) {
                throw "Must set widget config in the scope";
            }

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
            }
            else {
                console.log('undefined girdster');
            }
        }
        ;

        var gridsterObj = {};

        //To FIX: after save new element/note, ID will change
        gridsterObj.setGridster = function (gr) {
            console.log('set gridster');
            gridster = gr;
            gridster.options.draggable.stop = function (event, ui) {
                //Mise à jour de tableau position, on update ici puisqu'il n'est pas possible de rattacher ng-model 
                //les attributs et evenement Gridster sans modifier code source de ce dernier
                var context = $(ui.$helper.context);
                var col = context.attr('data-col');
                var row = context.attr('data-row');
                var id = context.attr('id');
                var elementsData = gridsterNotesData[currentNodeDataID].elements;
                for (var index in elementsData) {
                    if (elementsData[index].id == id) {
                        elementsData[index].position['data-col'] = col;
                        elementsData[index].position['data-row'] = row;
                    }
                }
            };

            gridster.options.resize.stop = function (event, ui, widget) {
                var sizex = $(widget).attr('data-sizex');
                var sizey = $(widget).attr('data-sizey');
                var id = $(widget).attr('id');
                var elementsData = gridsterNotesData[currentNodeDataID].elements;

                for (var index in elementsData) {
                    if (elementsData[index].id == id) {
                        elementsData[index].position['data-sizex'] = sizex;
                        elementsData[index].position['data-sizey'] = sizey;
                    }
                }
            };
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
            RemoteSaveService.save(noteData); //save note and give newest noteData

            var exists = true;
            var noteID = noteData.id;

            if (gridsterNotesData[noteID] == undefined || gridsterNotesData[noteID] == null) {
                exists = false;
            }

            //work...
            var processFunc = function (data, isFirstTime) {
                for (var index = 0; index < data.length; ++index) {

                    var elementData = data[index]['NoteElement'] === undefined ? data[index] : data[index]['NoteElement'];
                    if (isFirstTime) {
                        gridsterNotesData[noteID].elements.push(elementData);
                    }

                    var positionArr = elementData['position'];
                    //connect 
                    var elementHTML = $('<li id={{config.id}} save-valueChanged save_interval="2"><handler>|||</handler></li>');
                    elementHTML.append(NoteTemplateManagerService.getElementsTemplate()[elementData.type]);
                    var copyScope = null;
                    if (isFirstTime) {
                        copyScope = scope.$new(true);
                        gridsterNotesData[noteID].scope[elementData.id] = copyScope;
                    }
                    else {
                        copyScope = gridsterNotesData[noteID].scope[elementData.id];
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
                    gridsterNotesData[noteID] = {
                        note: noteData,
                        elements: [],
                        scope: []
                    };
                    gridster.remove_all_widgets();
                    processFunc(elementsData, true);
                });

            }
            else {
                gridster.remove_all_widgets();
                processFunc(gridsterNotesData[noteID].elements, false);
            }
            currentNodeDataID = noteID;
        };

        gridsterObj.newNote = function (scope) {

            //prepare
            gridster.remove_all_widgets();
            var defaultConfig = UtilsService.clone(NoteTemplateManagerService.getTemplateConfig());
            var newID = UtilsService.uniqueId();

            gridsterNotesData[newID] = {
                note: defaultConfig,
                elements: defaultConfig,
                scope: []
            };
            currentNodeDataID = newID;
            RemoteSaveService.save(defaultConfig); //Sauvegarde d'abord tous les modifications, et donne le nouveau noteData

            //work
            console.log(defaultConfig);
            for (var index in defaultConfig) {
                defaultConfig[index].id = UtilsService.uniqueId();
                var positionArr = defaultConfig[index].position;
                var type = defaultConfig[index].type;

                var element = $('<li id="{{config.id}}" save-valueChanged save_interval="2"><handler>|||</handler></li>');

                element.append(NoteTemplateManagerService.getElementsTemplate()[type]);
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


        gridsterObj.addWidget = function (widget) {
            //  _addWidget();
            // RemoteSaveService.update();
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
            var data = {
                oldMode: $rootScope.CurrentMode,
                newMode: mode
            };
            $rootScope.CurrentMode = mode; //Change mode
            $rootScope.$broadcast($rootScope.JournalEvents.SwitchJournalMode, data);
        };

        //resize event
        var w = angular.element($window);
        w.bind('resize', function (event) {
        });

        //close page event
        /*$rootScope.on('$locationChangeStart', function () {
         RemoteSaveService.save(null);
         });*/
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
                    console.log(data['templateConfig']);
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
                        },
                        handle: 'handler'
                    }
                }).data('gridster');
                GridsterShareService.setGridster(gridster);

                scope.$on($rootScope.JournalEvents.ServiceSetTemplateConfig, function (e, config) {
                    GridsterShareService.newNote(scope); //new note
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
                
                scope.availableElement = [{
                        label: 'Text Element',
                        type: "TEXT"
                    }, {
                        label: 'Numeric Element',
                        type: 'NUMERIC'
                    }, {
                        label: 'Date Element',
                        type: 'DATE'
                    }];

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
                                    copyScope.config = {
                                        id: UtilsService.uniqueId()
                                    };
                                    $compile(element)(copyScope);
                                    GridsterShareService.addWidget(copyScope, element);
                                });
                            }
                        });
                    }
                    else {
                        scope.$apply(function () {
                            var element = $('<li></li>');
                            element.html(NoteTemplateManagerService.getElementsTemplate()[type]);

                            var copyScope = scope.$new(true);
                            copyScope.config = {
                                id: UtilsService.uniqueId()
                            };
                            $compile(element)(copyScope);
                            GridsterShareService.addWidget(copyScope, element);

                        });
                    }
                    ;
                });
            }
        };

    });


    app.directive('saveFocusout', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                console.log('ss');
                if (scope.config == undefined || scope.config == null) {
                    throw "Must set 'config' attribute as watch data in scope for save-focusout";
                }

                $(element).on('focusout', function () {
                    RemoteSaveService.update(scope.config);
                    console.log('focusout, save');
                });
            }
        }
    });

    app.directive('saveValueChanged', function (RemoteSaveService, $timeout) {
        var saveTimeout = null;

        return {
            restrict: 'A',
            scope: {
                save_interval: '=' //for relaxe server pressure, save only after x second

            },
            link: function (scope, element, attr) {
                console.log('w');
                if (scope.config == undefined || scope.config == null) {
                    throw "Must set 'config' attribute as watch data in scope for save-valueChanged";
                }

                var unbindWatcher = scope.$watch("config", function (newVal, oldVal) {  
                    console.log(newVal);
                    if (scope.save_interval == undefined) {
                        RemoteSaveService.update(scope.config);
                        console.log("Save update");
                    }
                    else {
                        var interval = parseInt(scope.save_interval);
                        if (saveTimeout === null) {
                            saveTimeout = $timeout(function () {
                                RemoteSaveService.update(scope.config);
                                saveTimeout = null;
                                console.log("Timeout save update");
                            }, interval);
                        }
                    }
                }, true);
            }
        }
    });


    app.directive('dateTimePicker', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                console.log('dd');
            }
        };
    });

    app.controller('JournalFooterCtrl', function ($scope) {


    });

})();
