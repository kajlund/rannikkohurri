var angular = angular || null,
    toastr = toastr || null;

(function (app) {
    'use strict';

    app.controller('bookListController', ['$scope', '$rootScope', '$state', '$log', '$modal', 'SessionService', 'bookDataService',
        function ($scope, $rootScope, $state, $log, $modal, SessionService, bookDataService) {
            var modalInstance = null;

            function getItems() {
                if ($scope.fetching) {
                    return;
                }
                $scope.fetching = true;
                bookDataService.getPage($scope.order, $scope.filter, $scope.currentPage)
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
            $scope.order = 'title';
            $scope.totalItems = 0;
            $scope.currentItem = null;
            $scope.items = [];
            $scope.fetching = false;

            getItems();

            $scope.onAddClick = function () {
                $state.go('bookedit', {'bookId': '_new'});
            };

            $scope.onEditClick = function (book) {
                $state.go('bookedit', {'bookId': book.objectId});
            };

            $scope.onDeleteClick = function (book) {
                $scope.currentItem = book;
                modalInstance = $modal({
                    scope: $scope,
                    template: 'app/tmplVerify.html',
                    show: true,
                    title: 'Delete Book?',
                    content: 'You are about to delete book <em>' + book.title + '</em>'
                });
            };

            $scope.dlgVerifyCancel = function () {
                modalInstance.hide();
                toastr.warning('Delete cancelled');
            };

            $scope.dlgVerifyOK = function () {
                modalInstance.hide();
                bookDataService.deleteItem($scope.currentItem)
                    .then(function (data) {
                        $log.info('Deleted Book');
                        toastr.success('Book deleted');
                        $scope.items = _.filter($scope.items, function (book) {
                            return book.objectId !== $scope.currentItem.objectId;
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