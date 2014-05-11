var angular = angular || null,
    toastr = toastr || null;

(function (angular) {
    'use strict';

    angular.module('app').controller('MovieListController', ['$scope', '$rootScope', '$modal', '$log', '$state', 'SessionService', 'movieDataService',
        function ($scope, $rootScope, $modal, $log, $state, SessionService, movieDataService) {
            var modalInstance = null;

            function getItems() {
                $rootScope.busy(true);
                movieDataService.getPage($scope.order, $scope.filter, $scope.currentPage)
                    .then(function (res) {
                        $rootScope.busy(false);
                        $scope.items = res.data.results;
                        $scope.totalItems = res.data.count;
                    }, function (err) {
                        $rootScope.busy(false);
                        $log.error(err);
                        toastr.error(err.error.code + ' ' + err.error.error);
                    });
            }

            $scope.session = SessionService;
            $scope.filter = '';
            $scope.currentPage = 1;
            $scope.maxSize = 10;
            $scope.order = '-seenAt';
            $scope.totalItems = 0;
            $scope.currentItem = null;

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
        }]);
}(angular));