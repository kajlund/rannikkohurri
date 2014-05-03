var angular = angular || null,
    toastr = toastr || null;

(function (angular) {
    'use strict';

    angular.module('app').controller('MovieListController', ['$scope', '$rootScope', '$location', '$log', '$modal', 'SessionService', 'MovieDataService',
        function ($scope, $rootScope, $location, $log, $modal, SessionService, MovieDataService) {
            function getItems() {
                $rootScope.busy(true);
                MovieDataService.getPage($scope.order, $scope.filter, $scope.currentPage)
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
            getItems();

            $scope.onAddClick = function () {
                var movie = {
                        seenAt: {"__type": "Date", "iso": new Date().toISOString()},
                        etitle: "",
                        otitle: "",
                        pic: "",
                        rating: 0,
                        url: "",
                        synopsis: "",
                        comment: ""
                    },
                    modalInstance = $modal.open({
                        templateUrl: 'app/movies/edit.html',
                        controller: 'movieEditController',
                        resolve: {
                            movie: function () {
                                return movie;
                            }
                        }
                    });

                modalInstance.result.then(function () {
                    MovieDataService.updateItem(movie)
                        .then(function (data) {
                            // data.createdAt data.objectId
                            $log.info('Added Movie %o', data);
                            toastr.success('Movie added');
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

            $scope.onEditClick = function (movie) {
                //2013-11-09T
                var modalInstance = $modal.open({
                        templateUrl: 'app/movies/edit.html',
                        controller: 'movieEditController',
                        resolve: {
                            movie: function () {
                                return movie;
                            }
                        }
                    });

                modalInstance.result.then(function () {
                    MovieDataService.updateItem(movie)
                        .then(function (data) {
                            // data.updatedAt
                            $log.info('Updated Movie %o', data);
                            toastr.success('Movie updated');
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

            $scope.onDeleteClick = function (movie) {
                var modalInstance = $modal.open({
                    templateUrl: 'app/movies/delete.html',
                    controller: 'movieDeleteController',
                    resolve: { movie: function () { return movie; } }
                });

                modalInstance.result.then(function () {
                    MovieDataService.deleteItem(movie)
                        .then(function (data) {
                            $log.info('Deleted Movie');
                            toastr.success('Movie deleted');
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

            $scope.onPageChanged = function (page) {
                $scope.currentPage = page;
                getItems();
            };

        }]);
}(angular));