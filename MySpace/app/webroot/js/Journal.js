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

        function _init(onAvailable) {
            if (socket == null) {
                socket = io.connect(url);


                socket.on('connect', function () {
                    socket.emit('identify', {
                        type: 'cache',
                        security_key: $rootScope.security_key
                    });
                    console.log('connected to ' + url);
                });
                socket.on('disconnect', function () {
                    socket = null;
                });
                socket.on('newElement-resp', function (data) {
                    console.log('new element ok');
                });

                socket.on('identify-resp', function (data) {
                    console.log('Identify ok');
                    if (onAvailable !== undefined) {
                        onAvailable(data);
                    }
                });

                socket.on('save-resp', function (resp) {
                    console.log('save ' + resp);
                });
                /**
                 * Synchronise id after save new element/note
                 * Sync structure:
                 *   {
                 *    Note[from]:to,
                 *    NoteElements:{fromID:toID, fromID:toID, ...} //elements to sync
                 *   }
                 *
                 * PS: Sync sera faite après changement de note dans save au cas de  switchNote 
                 * */
                socket.on('sync', function (noteIdToSync) {
                    console.log('Sync ID:');
                    console.log(noteIdToSync);
                    var data = NoteDataService.getNoteData();
                    //Pour tous les sync il faut un Note pour identifier quel note à mettre à jour
                    if (noteIdToSync['Note'] != undefined) {

                        for (var i in data) {
                            var noteID = data[i].note.id;
                            if (noteIdToSync['Note'][noteID] != undefined) {
                                //Sync note id et la clé dans le tableau de Note
                                data[i].note.id = noteIdToSync['Note'][noteID];

                                //sync elements id
                                if (noteIdToSync['NoteElements'] !== undefined) { //Sync element id

                                    for (var k in data[i]['elements']) {
                                        for (var j in noteIdToSync['NoteElements'])
                                            if (data[i]['elements'][k].id == j) {
                                                console.log('sync id ' + j);
                                                var cryptedID = noteIdToSync['NoteElements'][j];
                                                var oldID = data[i]['elements'][k].id;
                                                //modif ID
                                                data[i]['elements'][k].id = cryptedID;
                                                //puis modif la clé de scope
                                                //ce cle sera util dans switchNote pour retrouver Scope
                                                data[i]['scope'][cryptedID] = data[i]['scope'][oldID];
                                                delete data[i]['scope'][oldID];

                                                // console.log(data[i]['elements'][cryptedID]);
                                                break;
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
            } else {
                if (onAvailable != undefined) {
                    onAvailable();
                }
            }
        }
        return {
            /**
             * new_Note_Data: New note to handler after save current note, can be null
             * */
            save: function (new_Note_Data) {
                console.log('save note, next note data');
                _init();
                socket.emit('save', new_Note_Data);
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
            },
            new : function (dataToNew) {
                _init(function () {
                    socket.emit('new', dataToNew);
                });
            },
            emit: function (code, data) {
                _init(function () {
                    socket.emit(code, data);
                });
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
         elements:[0:Object, 1:Object],
         scope:[id:Scope, id:Scope]
         }, 
         {note:{}, elements:[], scope:[]}, ...]
         * 
         * 
         * */
        var notesData = [];
        return {
            getNoteData: function () {
                return notesData;
            },
            getNoteDataById: function (id) {
                console.log(notesData);
                for (var i in notesData) {
                    if (notesData[i].note.id == id) {
                        return notesData[i];
                    }
                }
                return null;
            },
            insertNoteData: function (data) {
                notesData.push(data);
            }
        };
    });

    app.factory('GridsterShareService', function ($compile, $rootScope, $http, NoteTemplateManagerService, UtilsService, RemoteSaveService, NoteDataService) {
        var gridster = undefined;

        //pointer to current note data index 
        var currentNodeDataID = null;

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
                var noteData = NoteDataService.getNoteDataById(currentNodeDataID);
                var elementsData = noteData.elements;// gridsterNotesData[currentNodeDataID].elements;

                for (var index in elementsData) {
                    var oldPosition = elementsData[index].position;
                    var elemID = elementsData[index].id;
                    var newElem = $('#' + elementsData[index].id);
                    var newCol = newElem.attr('data-col');
                    var newRow = newElem.attr('data-row');
                    var newSizeX = newElem.attr('data-sizex');
                    var newSizeY = newElem.attr('data-sizey');

                    //Update sur la position pour tous les elements modifiés
                    if (oldPosition['data-col'] != newCol
                            || oldPosition['data-row'] != newRow
                            || oldPosition['data-sizex'] != newSizeX
                            || oldPosition['data-sizey'] != newSizeY) {
                        oldPosition['data-col'] = newCol;
                        oldPosition['data-row'] = newRow;
                        oldPosition['data-sizex'] = newSizeX;
                        oldPosition['data-sizey'] = newSizeY;
                        noteData.scope[elemID].$apply();

                    }
                }

            };

            gridster.options.resize.stop = function (event, ui, widget) {

                var noteData = NoteDataService.getNoteDataById(currentNodeDataID);
                var elementsData = noteData.elements;// gridsterNotesData[currentNodeDataID].elements;

                for (var index in elementsData) {
                    var oldPosition = elementsData[index].position;
                    var elemID = elementsData[index].id;
                    var newElem = $('#' + elementsData[index].id);
                    var newCol = newElem.attr('data-col');
                    var newRow = newElem.attr('data-row');
                    var newSizeX = newElem.attr('data-sizex');
                    var newSizeY = newElem.attr('data-sizey');

                    //Update sur la position pour tous les elements modifiés
                    if (oldPosition['data-col'] != newCol
                            || oldPosition['data-row'] != newRow
                            || oldPosition['data-sizex'] != newSizeX
                            || oldPosition['data-sizey'] != newSizeY) {
                        oldPosition['data-col'] = newCol;
                        oldPosition['data-row'] = newRow;
                        oldPosition['data-sizex'] = newSizeX;
                        oldPosition['data-sizey'] = newSizeY;
                        noteData.scope[elemID].$apply();

                    }
                }

            };
        };

        gridsterObj.getGridster = function () {
            return gridster;
        };

        gridsterObj.getCurrentNoteID = function () {
            return currentNodeDataID;
        };

        /**
         *
         * @param {type} scope
         * @param {type} noteID
         * @returns {undefined}
         */
        gridsterObj.switchNote = function (scope, noteData) {
            var nextNoteData = {Note: noteData, NoteElements: []};
            console.log("noteDatsdfsdf  a");
            console.log(noteData);
            var exists = true;
            var noteID = noteData.id;
            var completeNoteData = NoteDataService.getNoteDataById(noteID);
            if (completeNoteData == undefined || completeNoteData == null) {
                exists = false;
            }

            //work...
            var processFunc = function (elements, completeNote, isFirstTime) {

                for (var index = 0; index < elements.length; ++index) {
                    var elementData = elements[index]['NoteElement'] === undefined ? elements[index] : elements[index]['NoteElement'];
                    if (isFirstTime) {
                        completeNote.elements.push(elementData);
                    }

                    var positionArr = elementData['position'];
                    //connect 
                    var elementHTML = $('<li id={{config.id}} save-valuechange save_interval="2"><handler>|||</handler></li>');
                    elementHTML.append(NoteTemplateManagerService.getElementsTemplate()[elementData.type]);
                    var copyScope = null;
                    if (isFirstTime) {
                        copyScope = scope.$new(true);
                        completeNote.scope[elementData.id] = copyScope;
                    }
                    else {
                        copyScope = completeNote.scope[elementData.id];
                    }
                    if (copyScope == undefined) {
                        console.log('Scope not exists for ' + elementData.id);
                    }
                    copyScope.config = elementData;
                    $compile(elementHTML)(copyScope);
                    _addWidget(copyScope,
                            elementHTML,
                            positionArr['data-sizex'],
                            positionArr['data-sizey'],
                            positionArr['data-col'],
                            positionArr['data-row']);
                    nextNoteData.NoteElements.push({id: elementData.id});
                }
            };

            //Si les doonée cache n'exists pas encore, trouve tous les noteelements et remplir 
            if (exists === false) {
                console.log('Unknow Note elements data, go find from PHP server...');
                var url = $rootScope.baseURL + "notes/noteElements/" + noteID;
                $http.post(url, {}).success(function (elementsData, status, headers, config) { 
                    
                    var newNoteData = {
                        note: noteData,
                        elements: [],
                        scope: []
                    };
                    NoteDataService.insertNoteData(newNoteData);
                    gridster.remove_all_widgets();
                    processFunc(elementsData, newNoteData, true);
                    RemoteSaveService.save(nextNoteData); //save note and give newest noteData
                });

            }
            else {
                console.log('Already know elements data, charge by cache');
                gridster.remove_all_widgets();
                processFunc(completeNoteData.elements, completeNoteData, false);
                RemoteSaveService.save(nextNoteData); //save note and give newest noteData
            }
            currentNodeDataID = noteID;
        };

        gridsterObj.newNote = function (scope) {
            //prepare
            gridster.remove_all_widgets();
            var defaultConfig = UtilsService.clone(NoteTemplateManagerService.getTemplateConfig());
            var newID = UtilsService.uniqueId();

            var newNoteData = {
                note: {id: newID},
                elements: defaultConfig,
                scope: []
            };

            currentNodeDataID = newID;

            //work
            for (var index in defaultConfig) {
                var newElementID = UtilsService.uniqueId();
                defaultConfig[index].id = newElementID;
                var positionArr = defaultConfig[index].position;
                var type = defaultConfig[index].type;

                var element = $('<li id="{{config.id}}" save-valuechange save_interval="2"><handler>|||</handler></li>');

                element.append(NoteTemplateManagerService.getElementsTemplate()[type]);
                //Il faut compiler l'element pour qu'il réagit comme une page AngularJs
                //Sinon tous les directives comme {{name}} ne sera pas compilé
                var copyScope = scope.$new(true);
                copyScope.config = defaultConfig[index];
                newNoteData.scope[defaultConfig[index].id] = copyScope;
                $compile(element)(copyScope);
                _addWidget(copyScope,
                        element,
                        positionArr['data-sizex'],
                        positionArr['data-sizey'],
                        positionArr['data-col'],
                        positionArr['data-row']);
            }
            ;
            NoteDataService.insertNoteData(newNoteData);
            console.log('Remote new note data:');
            console.log({Note: newNoteData.note, NoteElements: newNoteData.elements});
            RemoteSaveService.new({Note: newNoteData.note, NoteElements: newNoteData.elements}); //Sauvegarde d'abord tous les modifications, et donne le nouveau noteData
            $rootScope.$broadcast($rootScope.JournalEvents.AddNewNote, newNoteData.note);
        };


        gridsterObj.addNewWidget = function (scope, widget) {
            _addWidget(
                    scope,
                    widget);
            //save position data
            var element = $('#' + scope.config.id);
            var col = element.attr('data-col');
            var row = element.attr('data-row');
            var sizex = element.attr('data-sizex');
            var sizey = element.attr('data-sizey');
            scope.config.position = {
                'data-col': col,
                'data-row': row,
                'data-sizex': sizex,
                'data-sizey': sizey
            };

        };


        return gridsterObj;
    });

    //JournalCtrl gerent les choses globaux
    app.controller('JournalCtrl', function ($scope, $rootScope, $http, $window, GridsterShareService, RemoteSaveService) {
        $rootScope.JournalEvents = {
            Ping: 'Ping',
            SwitchJournalMode: 'switch-journal-mode',
            GridsterAddWidget: 'gridster-add-widget',
            ReiceiveDefaultTemplate: 'reiceive-defaukt-template',
            ServiceSetTemplateConfig: 'service-set-template-config',
            ServiceSetElementsTemplate: 'service-set-elements-template',
            AddNewNote: 'add-new-note'
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
        $rootScope.save = function () {
            RemoteSaveService.save(null);
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
                    NoteTemplateManagerService.setElementsTemplate(data['elementTemplate']);
                    NoteTemplateManagerService.setTemplateConfig(data['templateConfig']);
                }).
                error(function (data, status, headers, config) {

                });
    });

    app.controller('JournalMenuControl', function ($scope, $http, $rootScope, GridsterShareService, RemoteSaveService, NoteDataService) {

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
            console.log('Switch note with data:');
            console.log(noteData);
            var currentSelectedID = GridsterShareService.getCurrentNoteID();
            //Ici on vérifier si on clique sur le même note, c'est pour éviter de recharger la note,
            //Mais aussi pour une autre raison d'éviter un BUG; ce BUG se produit si on fait:
            //1=> Créer une nouvelle Note
            //2=> Clique sur la nouvelle Note crée (Charge->Send new Note(GUID)->Save->Sync ID), donc coté server il prendra toujours les anciens GUID, et du coup Server PHP va créer un nouveau Note
            //3=> Reclique sur la nouvelle Note (Charge->Send new Note(Crypted ID)->Save->Sync ID)
            //Et puis il sauvegarde 2 note...
            if (noteData.id == currentSelectedID) {
                console.log("Same Note, not need to recharge, will simply save note");
            } else {

                GridsterShareService.switchNote($scope, noteData);
            }
        };

        $scope.newClick = function () {
            GridsterShareService.newNote($scope);
        };

        $scope.$on($rootScope.JournalEvents.AddNewNote, function (e, data) {
            console.log("AddNewNote event :" + data);

            $scope.notes.push(data);
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        });

    });
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
                    // GridsterShareService.newNote(scope); //new note
                });
            }
        };

    });



    app.directive('menuadd', function ($rootScope, $compile, NoteTemplateManagerService, GridsterShareService, NoteDataService, UtilsService, RemoteSaveService) {
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
                    var currentSelectNoteID = GridsterShareService.getCurrentNoteID();
                    var currentNoteData = NoteDataService.getNoteDataById(currentSelectNoteID);

                    //Add widget func
                    var func = function () {
                        scope.$apply(function () {
                            var element = $('<li id="{{config.id}}" save-valuechange save_interval="2"><handler>|||</handler></li>');
                            element.append(NoteTemplateManagerService.getElementsTemplate()[type]);

                            var copyScope = scope.$new(true);
                            copyScope.config = {
                                id: UtilsService.uniqueId(),
                                label: "",
                                type: type,
                                value: '',
                                position: '',
                                create_date: new Date()
                            };
                            currentNoteData.elements.push(copyScope.config);
                            currentNoteData.scope[copyScope.config.id] = copyScope;
                            $compile(element)(copyScope);
                            GridsterShareService.addNewWidget(copyScope, element);
                            RemoteSaveService.emit('newElement', copyScope.config);
                        });
                    };

                    if (templates[type] === undefined) {
                        $.ajax({
                            url: attr['url'] + type + '/edit',
                            type: 'get',
                            success: function (html) {
                                //on emet une evenement de AddElement pour tous les Controllers qui l'interesse
                                NoteTemplateManagerService.addElementTemplate(type, html);
                                func();
                            }
                        });
                    }
                    else {
                        func();
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

    app.directive('saveValuechange', function (RemoteSaveService, $timeout) {
        var saveTimeout = null;

        return {
            restrict: 'A',
            scope: {
                save_interval: '=' //for relaxe server pressure, save only after x second

            },
            link: function (scope, element, attr) {
                var scope = scope.$parent;
                if (scope.config == undefined || scope.config == null) {
                    throw "Must set 'config' attribute as watch data in scope for save-valueChanged";
                }

                var unbindWatcher = scope.$watch("config", function (newVal, oldVal) {
                    if (newVal != oldVal) {
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
                    }
                }, true);
            }
        }
    });


    app.directive('pickerDatetime', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                $(element).datetimepicker();
            }
        };
    });

    app.controller('JournalFooterCtrl', function ($scope) {


    });

})();
