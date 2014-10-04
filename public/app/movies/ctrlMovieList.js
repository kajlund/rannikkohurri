var angular = angular || null,
    toastr = toastr || null;

(function (app) {
    'use strict';

    app.controller('movieListController', ['$scope', '$location', '$modal', '$log', 'SessionService', 'movieDataService',
        function ($scope, $location, $modal, $log, SessionService, movieDataService) {
            var modalInstance = null;

            function getItems() {
                if ($scope.fetching) {
                    return;
                }
                $scope.fetching = true;
                movieDataService.getPage($scope.order, $scope.filter, $scope.currentPage)
                    .then(function (res) {
                        $scope.items = $scope.items.concat(res.data.results);
                        $scope.totalItems = res.data.count;
                        $scope.fetching = false;
                    }, function (err) {
                        $log.error(err);
                        toastr.error(err.error.code + ' ' + err.error.error);
                        $scope.fetching = false;
                    });
            }

            $scope.session = SessionService;
            $scope.filter = '';
            $scope.currentPage = 1;
            $scope.maxSize = 10;
            $scope.order = '-seenAt';
            $scope.totalItems = 0;
            $scope.currentItem = null;
            $scope.items = [];
            $scope.fetching = false;

            getItems();

            $scope.onAddClick = function () {
                $location.path('/movies/_new');
            };

            $scope.onEditClick = function (movie) {
                $location.path('/movies/' + movie.objectId);
            };

            $scope.onDeleteClick = function (movie) {
                $scope.currentItem = movie;
                modalInstance = $modal({
                    scope: $scope,
                    template: 'app/tmplVerify.html',
                    show: true,
                    title: 'Delete Movie?',
                    content: 'You are about to delete movie <em>' + movie.etitle + '</em>'
                });
            };

            $scope.dlgVerifyCancel = function () {
                modalInstance.hide();
                toastr.warning('Delete cancelled');
            };

            $scope.dlgVerifyOK = function () {
                modalInstance.hide();
                movieDataService.deleteItem($scope.currentItem)
                    .then(function (data) {
                        $log.info('Deleted Movie');
                        toastr.success('Movie deleted');
                        $scope.items = _.filter($scope.items, function (movie) {
                            return movie.objectId !== $scope.currentItem.objectId;
                        });
                    }, function (err) {
                        $log.error(err);
                        toastr.error(err.error.code + ' ' + err.error.error);
                    });
            };

            $scope.scroll = function () {
                $scope.currentPage += 1;
                getItems();
            };
        }]);
}(angular.module('app')));