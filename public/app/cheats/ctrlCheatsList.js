var angular = angular || null,
    toastr = toastr || null;

(function (app) {
    'use strict';

    app.controller('cheatsListController', ['$scope', '$rootScope', '$state', '$log', '$modal', 'SessionService', 'cheatsDataService',
        function ($scope, $rootScope, $state, $log, $modal, SessionService, cheatsDataService) {
            var modalInstance = null;

            function getItems() {
                $rootScope.busy(true);
                cheatsDataService.getItems()
                    .then(function (res) {
                        $log.info(res);
                        $scope.items = res.data.results;
                        $rootScope.busy(false);
                    }, function (err) {
                        $rootScope.busy(false);
                        $log.error(err);
                        toastr.error(err.error.code + ' ' + err.error.error);
                    });
            }

            $scope.session = SessionService;
            $scope.totalItems = 0;
            $scope.currentItem = null;

            getItems();

            $scope.onAddClick = function () {
                $state.go('cheatsedit', {'eventId': '_new'});
            };

            $scope.onEditClick = function (cache) {
                $state.go('cheatsedit', {'cacheId': cache.objectId});
            };

            $scope.onDeleteClick = function (cache) {
                $scope.currentItem = cache;
                modalInstance = $modal({
                    scope: $scope,
                    template: 'app/tmplVerify.html',
                    show: true,
                    title: 'Delete Cache?',
                    content: 'You are about to delete cache <strong>' + cache.name + '</strong>'
                });
            };

            $scope.dlgVerifyCancel = function () {
                modalInstance.hide();
                toastr.warning('Delete cancelled');
            };

            $scope.dlgVerifyOK = function () {
                modalInstance.hide();
                $rootScope.busy(true);
                cheatsDataService.deleteItem($scope.currentItem)
                    .then(function (data) {
                        $log.info('Deleted Cache');
                        toastr.success('Cache deleted');
                        $scope.items = _.filter($scope.items, function (cache) {
                            return cache.objectId !== $scope.currentItem.objectId;
                        });
                        $rootScope.busy(false);
                    }, function (err) {
                        $rootScope.busy(false);
                        $log.error(err);
                        toastr.error(err.error.code + ' ' + err.error.error);

                    });
            };
        }]);
}(angular.module('app')));