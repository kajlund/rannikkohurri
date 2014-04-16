var angular = angular || null,
    toastr = toastr || null;

(function (angular, toastr) {
    'use strict';

    angular.module('app').controller('CheatsListController', ['$scope', '$rootScope', '$log', '$modal', 'CheatsDataService',
        function ($scope, $rootScope, $log, $modal, CheatsDataService) {

            function getItems() {
                $rootScope.spinner.spin();
                CheatsDataService.getItems()
                    .then(function (data) {
                        $log.info(data);
                        $scope.items = data.data.results;
                        $rootScope.spinner.stop();
                    }, function (data) {
                        $rootScope.spinner.stop();
                        $log.error(data);
                        toastr.error(data.error.code + ' ' + data.error.error);
                    });
            }

            getItems();

            $scope.onAddClick = function () {
                var cache = {
                        cacheId: '',
                        cacheType: '',
                        name: '',
                        coords: '',
                        url: '',
                        logged: false
                    },
                    modalInstance = $modal.open({
                        templateUrl: 'app/cheats/edit.html',
                        controller: 'cheatsEditController',
                        resolve: {
                            cache: function () {
                                return cache;
                            }
                        }
                    });

                modalInstance.result.then(function () {
                    CheatsDataService.updateItem(cache)
                        .then(function (data) {
                            // data.createdAt data.objectId
                            $log.info('Added Cache %o', data);
                            toastr.success('Cache added');
                            getItems();
                        }, function (data) {
                            $log.error(data);
                            toastr.error(data.error.code + ' ' + data.error.error);
                        });
                }, function () {
                    $log.info('Cancelled New');
                    toastr.warning('New cancelled');
                });
            };

            $scope.onEditClick = function (cache) {
                var modalInstance = $modal.open({
                        templateUrl: 'app/cheats/edit.html',
                        controller: 'cheatsEditController',
                        resolve: {
                            cache: function () {
                                return cache;
                            }
                        }
                    });

                modalInstance.result.then(function () {
                    CheatsDataService.updateItem(cache)
                        .then(function (data) {
                            // data.updatedAt
                            $log.info('Updated Cache %o', data);
                            toastr.success('Cache updated');
                            getItems();
                        }, function (data) {
                            $log.error(data);
                            toastr.error(data.error.code + ' ' + data.error.error);
                        });
                }, function () {
                    $log.info('Cancelled Edit');
                    toastr.warning('Edit cancelled');
                });
            };

            $scope.onDeleteClick = function (event) {
                var modalInstance = $modal.open({
                        templateUrl: 'app/cheats/delete.html',
                        controller: 'cheatsDeleteController',
                        resolve: { cache: function () { return cache; } }
                    });

                modalInstance.result.then(function () {
                    EventDataService.deleteItem(cache)
                        .then(function (data) {
                            $log.info('Deleted Cache');
                            toastr.success('Cache deleted');
                            getItems();
                        }, function (data) {
                            $log.error(data);
                            toastr.error(data.error.code + ' ' + data.error.error);
                        });
                }, function () {
                    $log.info('Cancel');
                    toastr.warning('Delete cancelled');
                });
            };
        }]);
}(angular, toastr));