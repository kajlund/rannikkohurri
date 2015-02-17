(function () {
    'use strict';

    angular
        .module('app')
        .controller('BookListController', BookListController);

    /* @ngInject */
    BookListController.$inject = ['$location', '$log', 'sessionService', 'bookDataService', 'cfpLoadingBar'];

    function BookListController ($location, $log, sessionService, bookDataService, cfpLoadingBar) {
        var vm = this;

        vm.currentItem = null;
        vm.items = [];
        vm.session = sessionService;
        vm.searchKey = '';
        vm.onAddClick = onAddClick;
        vm.search = search;
        vm.searchFields = [
            { name: 'title', description: 'By Title'  },
            { name: 'subtitle', description: 'By Subtitle' },
            { name: 'authors', description: 'By Authors' }
        ];
        vm.currentSearchField = vm.searchFields[0];

        activate();

    ////////////////////////////////////////////////////////////////////////////////////

        function activate() {
            $log.info('Activating BookListController');

            // Get some default data
            getItems('title', '');
        }

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

        function search () {
            getItems(vm.currentSearchField.name, vm.searchKey);
        }

        function onAddClick () {
            $location.path('/books/edit/_new');
        }
    }
}());