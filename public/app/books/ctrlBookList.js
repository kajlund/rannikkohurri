(function (app) {
    'use strict';

    app.controller('bookListController', ['$scope', '$location', '$log', '$modal', 'SessionService', 'bookDataService', 'cfpLoadingBar',
        function ($scope, $location, $log, $modal, SessionService, bookDataService, cfpLoadingBar) {
            var modalInstance = null,
                BookObject = Parse.Object.extend('AudioBook');

            function getItems(aField, aVal) {
                var query = new Parse.Query(BookObject);

                query.startsWith(aField, aVal);
                cfpLoadingBar.start();
                query.find({
                    success: function (results) {
                        $scope.items = results;
                        $scope.$apply();
                        cfpLoadingBar.complete();
                    },
                    error: function (error) {
                        $log.error('Error fetching Book data %o', error);
                        toastr.error(error.message);
                        cfpLoadingBar.complete();
                    }
                });
            }

            $log.info('Activating bookListController');

            $scope.session = SessionService;
            $scope.searchKey = '';
            $scope.currentItem = null;
            $scope.items = [];

            $scope.searchFields = [
                { name: 'title', description: 'By Title'  },
                { name: 'subtitle', description: 'By Subtitle' },
                { name: 'authors', description: "By Authors" }
            ];
            $scope.currentSearchField = $scope.searchFields[0];

            $scope.search = function() {
                getItems($scope.currentSearchField.name, $scope.searchKey);
            };

            $scope.onAddClick = function () {
                $location.path('/books/_new');
            };

            $scope.onEditClick = function (book) {
                $location.path('/books/' + book.id);
            };

            $scope.onDeleteClick = function (book) {
                $scope.currentItem = book;
                modalInstance = $modal({
                    scope: $scope,
                    template: 'app/tmplVerify.html',
                    show: true,
                    title: 'Delete Book?',
                    content: 'You are about to delete book <em>' + book.get('title') + '</em>'
                });
            };

            $scope.dlgVerifyCancel = function () {
                modalInstance.hide();
                toastr.warning('Delete cancelled');
            };

            $scope.dlgVerifyOK = function () {
                modalInstance.hide();
                bookDataService.deleteItem($scope.currentItem.id)
                    .then(function (data) {
                        $log.info('Deleted Book %o', data);
                        toastr.success('Book deleted');
                        $scope.search();
                    }, function (err) {
                        $log.error(err);
                        toastr.error(err.error.code + ' ' + err.error.error);
                    });
            };

            if (!SessionService.loggedOn()) {
                SessionService.autoSignon()
                    .then(function (data) {
                        $log.info($scope.session);
                    }, function (err) {
                        $log.error(err);
                    });
            }

            getItems('title', '');
        }]);
}(angular.module('app')));