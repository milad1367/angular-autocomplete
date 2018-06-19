/**
 * Angucomplete
 * Autocomplete directive for AngularJS
 * By Daryl Rowland
 */

angular.module('autocomplete',[]).directive('autocomplete', ["$parse", "$http", "$sce", "$timeout",function ($parse, $http, $sce, $timeout) {
    return {
        restrict: 'E',
        controller: function(){
          var vm = this;
          vm.noResults = function (searching,results) {
            if( !searching && ( !results || results.length == 0)) {
              return true
            }
            return false
          }

        },
        controllerAs: 'autocompleteDVM',
        bindToController:{
            "id": "@id",
            "placeholder": "@placeholder",
            "selectedObject": "=selectedobject",
            "url": "@url",
            "dataField": "@datafield",
            "titleField": "@titlefield",
            "descriptionField": "@descriptionfield",
            "imageField": "@imagefield",
            "imageUri": "@imageuri",
            "inputClass": "@inputclass",
            "userPause": "@pause",
            "localData": "=localdata",
            "searchFields": "@searchfields",
            "minLengthUser": "@minlength",
            "matchClass": "@matchclass",
            "onBlur": "&"
          },
        templateUrl: "./directives/autocomplete/autocomplete.html",
        link: function(scope, elem, attrs, controller) {
            var vm = controller;
            vm.lastSearchTerm = null;
            vm.currentIndex = null;
            vm.justChanged = false;
            vm.searchTimer = null;
            vm.hideTimer = null;
            vm.searching = false;
            vm.pause = 500;
            vm.minLength = 3;
            vm.searchStr = null;

            if (vm.minLengthUser && vm.minLengthUser != "") {
                vm.minLength = vm.minLengthUser;
            }

            if (vm.userPause) {
                vm.pause = vm.userPause;
            }

            isNewSearchNeeded = function(newTerm, oldTerm) {
                return newTerm.length >= vm.minLength && newTerm != oldTerm
            }

            vm.processResults = function(responseData, str) {
                if (responseData && responseData.length > 0) {
                    vm.results = [];

                    var titleFields = [];
                    if (vm.titleField && vm.titleField != "") {
                        titleFields = vm.titleField.split(",");
                    }

                    for (var i = 0; i < responseData.length; i++) {
                        // Get title variables
                        var titleCode = [];

                        for (var t = 0; t < titleFields.length; t++) {
                            titleCode.push(responseData[i][titleFields[t]]);
                        }

                        var description = "";
                        if (vm.descriptionField) {
                            description = responseData[i][vm.descriptionField];
                        }

                        var imageUri = "";
                        if (vm.imageUri) {
                            imageUri = vm.imageUri;
                        }

                        var image = "";
                        if (vm.imageField) {
                            image = imageUri + responseData[i][vm.imageField];
                        }

                        var text = titleCode.join(' ');
                        if (vm.matchClass) {
                            var re = new RegExp(str, 'i');
                            var strPart = text.match(re)[0];
                            text = $sce.trustAsHtml(text.replace(re, '<span class="'+ vm.matchClass +'">'+ strPart +'</span>'));
                        }

                        var resultRow = {
                            title: text,
                            description: description,
                            image: image,
                            originalObject: responseData[i]
                        }

                        vm.results[vm.results.length] = resultRow;
                    }


                } else {
                    vm.results = [];
                }
            }

            vm.searchTimerComplete = function(str) {
                // Begin the search
                if (str.length >= vm.minLength) {
                    if (vm.localData) {
                        var searchFields = vm.searchFields.split(",");

                        var matches = [];

                        for (var i = 0; i < vm.localData.length; i++) {
                            var match = false;

                            for (var s = 0; s < searchFields.length; s++) {
                                match = match || (typeof vm.localData[i][searchFields[s]] === 'string' && typeof str === 'string' && vm.localData[i][searchFields[s]].toLowerCase().indexOf(str.toLowerCase()) >= 0);

                            }

                            if (match) {
                                matches[matches.length] = vm.localData[i];

                            }
                        }

                        vm.searching = false;
                        vm.processResults(matches, str);

                    } else {
                        $http.get(vm.url + str, {}).
                            success(function(responseData, status, headers, config) {
                                vm.searching = false;
                                vm.processResults(((vm.dataField) ? responseData[vm.dataField] : responseData ), str);
                            }).
                            error(function(data, status, headers, config) {
                                console.log("error");
                            });
                    }
                }
            }

            vm.hideResults = function() {
              
                vm.hideTimer = $timeout(function() {
                    vm.showDropdown = false;
                }, vm.pause);
            };

            vm.resetHideResults = function() {
                if(vm.hideTimer) {
                    $timeout.cancel(vm.hideTimer);
                };
            };

            vm.hoverRow = function(index) {
                vm.currentIndex = index;
            }

            vm.keyPressed = function(event) {
                if (!(event.which == 38 || event.which == 40 || event.which == 13)) {
                    if (!vm.searchStr || vm.searchStr == "") {
                        vm.showDropdown = false;
                        vm.lastSearchTerm = null
                    } else if (isNewSearchNeeded(vm.searchStr, vm.lastSearchTerm)) {
                        vm.lastSearchTerm = vm.searchStr
                        vm.showDropdown = true;
                        vm.currentIndex = -1;
                        vm.results = [];

                        if (vm.searchTimer) {
                            $timeout.cancel(vm.searchTimer);
                        }

                        vm.searching = true;

                        vm.searchTimer = $timeout(function() {
                            vm.searchTimerComplete(vm.searchStr);
                        }, vm.pause);
                    }
                } else {
                    event.preventDefault();
                }
            }

            vm.selectResult = function(result) {
                if (vm.matchClass) {
                    result.title = result.title.toString().replace(/(<([^>]+)>)/ig, '');
                }
                vm.searchStr = vm.lastSearchTerm = result.title;
                vm.selectedObject = result;
               // vm.selectedObject = result.originalObject;
                  vm.onBlur({user:result.originalObject});
                  vm.searchStr = "";
                  vm.showDropdown = false;
                  vm.results = [];
                //$scope.$apply();
            }

            var inputField = elem.find('input');

            inputField.on('keyup', vm.keyPressed);

            elem.on("keyup", function (event) {
                if(event.which === 40) {
                    if (vm.results && (vm.currentIndex + 1) < vm.results.length) {
                        vm.currentIndex ++;
                        scope.$apply();
                        event.preventDefault;
                        event.stopPropagation();
                    }

                    scope.$apply();
                } else if(event.which == 38) {
                    if (vm.currentIndex >= 1) {
                        vm.currentIndex --;
                        scope.$apply();
                        event.preventDefault;
                        event.stopPropagation();
                    }

                } else if (event.which == 13) {
                    if (vm.results && vm.currentIndex >= 0 && vm.currentIndex < vm.results.length) {
                        vm.selectResult(vm.results[vm.currentIndex]);
                        scope.$apply();
                        event.preventDefault;
                        event.stopPropagation();
                    } else {
                        vm.results = [];
                        scope.$apply();
                        event.preventDefault;
                        event.stopPropagation();
                    }

                } else if (event.which == 27) {
                    vm.results = [];
                    vm.showDropdown = false;
                    scope.$apply();
                } else if (event.which == 8) {
                    vm.selectedObject = null;
                    scope.$apply();
                }
            });

        }
    };
}]);