(function () {
    'use strict';

    angular
        .module('app')
        .controller('BookListController', BookListController);

    /* @ngInject */
    BookListController.$inject = ['$log', 'sessionService', 'bookDataService', 'cfpLoadingBar'];

    function BookListController ($log, sessionService, bookDataService, cfpLoadingBar) {
        var vm = this;

        vm.currentPage = 1;
        vm.fetching = false;
        vm.filter = '';
        vm.items = [];
        vm.maxSize = 10;
        vm.order = '-createdAt';
        vm.session = sessionService;
        vm.searchKey = '';
        vm.search = search;
        vm.searchFields = [
            { name: 'title', description: 'By Title'  },
            { name: 'subtitle', description: 'By Subtitle' },
            { name: 'authors', description: 'By Authors' }
        ];
        vm.scroll = doScroll;
        vm.currentSearchField = vm.searchFields[0];
        vm.totalItems = 0;

        activate();

    ////////////////////////////////////////////////////////////////////////////////////

        function activate() {
            $log.info('Activating BookListController');

            // Get some default data
            getItems('title', '');
        }

        function doScroll () {
            if (vm.fetching) {
                return;
            }
            vm.currentPage += 1;
            vm.fetching = true;
            bookDataService.getPage(vm.currentPage)
                .then(function (data) {
                    vm.items = vm.items.concat(data);
                    vm.fetching = false;
                }, function (err) {
                    $log.error(err);
                    toastr.error(err.error.code + ' ' + err.error.error);
                    vm.fetching = false;
                });
        }

        function getItems () {
            cfpLoadingBar.start();
            bookDataService.queryData(vm.currentSearchField.name, vm.searchKey).then(function (data) {
                vm.currentPage = 1;
                vm.items = data;
            }, function (error) {
                $log.error('Error fetching Book data %o', error);
                toastr.error(error.message);
            }).then(function () {
                cfpLoadingBar.complete();
            });
        }

        function search () {
            getItems();
        }

    }
}());