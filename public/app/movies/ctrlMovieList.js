var angular = angular || null,
    toastr = toastr || null;

(function (angular) {
    'use strict';

    angular.module('app').controller('MovieListController', ['$scope', '$rootScope', '$modal', '$log', '$state', 'SessionService', 'movieDataService',
        function ($scope, $rootScope, $modal, $log, $state, SessionService, movieDataService) {
            var modalInstance = null;

            function getItems() {
                if ($scope.fetching)
                    return;
                $scope.fetching = true;
                $rootScope.busy(true);
                movieDataService.getPage($scope.order, $scope.filter, $scope.currentPage)
                    .then(function (res) {
                        $scope.items = $scope.items.concat(res.data.results);
                        $scope.totalItems = $scope.items.length;
                        $rootScope.busy(false);
                        $scope.fetching = false;
                    }, function (err) {
                        $rootScope.busy(false);
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
                $state.go('movieedit', {'movieId': '_new'});
            };

            $scope.onEditClick = function (movie) {
                $state.go('movieedit', {'movieId': movie.objectId});
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

            $scope.onPageChanged = function (page) {
                $scope.currentPage = page;
                getItems();
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
                        getItems();
                    }, function (err) {
                        $log.error(err);
                        toastr.error(err.error.code + ' ' + err.error.error);
                    });
            };

            $scope.scroll = function () {
                $log.info('Scrolling');
                $scope.currentPage += 1;
                getItems();
            };
        }]);
}(angular));