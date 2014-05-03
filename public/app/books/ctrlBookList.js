var angular = angular || null,
    toastr = toastr || null;

(function (angular, toastr) {
    'use strict';

    angular.module('app').controller('BookListController', ['$scope', '$rootScope', '$location', '$log', '$modal', 'SessionService', 'BookDataService',
        function ($scope, $rootScope, $location, $log, $modal, SessionService, BookDataService) {

            function getItems() {
                $rootScope.busy(true);
                BookDataService.getPage($scope.order, $scope.filter, $scope.currentPage)
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
            $scope.order = 'title';
            $scope.totalItems = 0;
            getItems();

            $scope.onAddClick = function () {
                var book = {
                        authors: "",
                        genre: "",
                        image: "",
                        lang: "",
                        subtitle: "",
                        title: ""
                    },
                    modalInstance = $modal.open({
                        templateUrl: 'app/books/edit.html',
                        controller: 'bookEditController',
                        resolve: {
                            book: function () {
                                return book;
                            }
                        }
                    });

                modalInstance.result.then(function () {
                    BookDataService.updateItem(book)
                        .then(function (data) {
                            // data.createdAt data.objectId
                            $log.info('Added Audiobook %o', data);
                            toastr.success('Audiobook added');
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

            $scope.onEditClick = function (book) {
                var modalInstance = $modal.open({
                    templateUrl: 'app/books/edit.html',
                    controller: 'bookEditController',
                    resolve: {
                        book: function () {
                            return book;
                        }
                    }
                });

                modalInstance.result.then(function () {
                    BookDataService.updateItem(book)
                        .then(function (data) {
                            // data.updatedAt
                            $log.info('Updated Audiobook %o', data);
                            toastr.success('Audiobook updated');
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

            $scope.onDeleteClick = function (book) {
                var modalInstance = $modal.open({
                    templateUrl: 'app/books/delete.html',
                    controller: 'bookDeleteController',
                    resolve: { book: function () { return book; } }
                });

                modalInstance.result.then(function () {
                    BookDataService.deleteItem(book)
                        .then(function (data) {
                            $log.info('Deleted Audiobook');
                            toastr.success('Audiobook deleted');
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

            $scope.search = function (frm) {
                $scope.filter = frm.filter;
                $scope.currentPage = 1;
                getItems();
            };
        }]);
}(angular, toastr));