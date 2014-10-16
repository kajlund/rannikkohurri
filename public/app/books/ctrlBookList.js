(function () {
    'use strict';

    function BookListController ($location, $log, SessionService, bookDataService, cfpLoadingBar) {
        var vm = this;

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
            $location.path('/books/edit/_new');
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

    BookListController.$inject = ['$location', '$log', 'SessionService', 'bookDataService', 'cfpLoadingBar'];
    angular.module('app').controller('BookListController', BookListController);
}());