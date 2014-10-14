(function () {
    'use strict';

    function BookListController ($scope, $location, $log, $modal, SessionService, bookDataService, cfpLoadingBar) {
        var vm = this,
            modalInstance;

        function getItems(aField, aVal) {
            cfpLoadingBar.start();
            bookDataService.queryData(aField, aVal).then(function (data) {
                vm.items = data;
            }, function (error) {
                $log.error('Error fetching Book data %o', error);
                toastr.error(error.message);
            }).then(function () {
                cfpLoadingBar.complete();
            });
        }

        vm.searchFields = [
            { name: 'title', description: 'By Title'  },
            { name: 'subtitle', description: 'By Subtitle' },
            { name: 'authors', description: "By Authors" }
        ];

        vm.currentSearchField = vm.searchFields[0];

        vm.search = function() {
            getItems(vm.currentSearchField.name, vm.searchKey);
        };

        vm.onAddClick = function () {
            $location.path('/books/_new');
        };

        vm.onEditClick = function (book) {
            $location.path('/books/' + book.id);
        };

        vm.onDeleteClick = function (book) {
            vm.currentItem = book;
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
            bookDataService.deleteItem(vm.currentItem.id)
                .then(function (data) {
                    $log.info('Deleted Book %o', data);
                    toastr.success('Book deleted');
                    vm.search();
                }, function (err) {
                    $log.error(err);
                    toastr.error(err.error.code + ' ' + err.error.error);
                });
        };

        // Initialize Controller
        vm.session = SessionService;
        vm.searchKey = '';
        vm.currentItem = null;
        vm.items = [];
        $log.info('Activating bookListController');


        if (!SessionService.loggedOn()) {
            SessionService.autoSignon()
                .then(function (data) {
                    toastr.success(data.username + ' signed on');
                    $log.debug('[ctrlBookList.autoSignon] success %o', data);
                }, function (err) {
                    $log.debug('[ctrlBookList.autoSignon] error %o', err);
                });
        }

        // Get some default data
        getItems('title', '');
    }

    BookListController.$inject = ['$scope', '$location', '$log', '$modal', 'SessionService', 'bookDataService', 'cfpLoadingBar'];
    angular.module('app').controller('BookListController', BookListController);
}());