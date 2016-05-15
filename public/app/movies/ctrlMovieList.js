(function (app) {
    'use strict';

    angular
        .module('app')
        .controller('MovieListController', MovieListController);

    /* @ngInject */
    MovieListController.$inject = ['$log', 'sessionService', 'movieDataService', 'toastr' ];

    function MovieListController ($log, sessionService, movieDataService, toastr) {
        var vm = this;

        vm.data = movieDataService;
        vm.session = sessionService;
        vm.fetching = false;
        vm.filter = '';
        vm.currentPage = 1;
        vm.items = [];
        vm.maxSize = 10;
        vm.order = '-seenAt';
        vm.scroll = doScroll;
        vm.setFilterField = setFilterField;
        vm.setFilterValue = setFilterValue;
        vm.totalItems = 0;

        activate();

    ////////////////////////////////////////////////////////////////////////////

        function activate () {
            getItems();
        }

        function doScroll () {
            vm.currentPage += 1;
            getItems();
        }

        function getItems () {
            if (vm.fetching) {
                return;
            }
            vm.fetching = true;
            movieDataService.getPage(vm.order, vm.filter, vm.currentPage)
                .then(function (res) {
                    vm.items = vm.items.concat(res.data.results);
                    vm.totalItems = res.data.count;
                    vm.fetching = false;
                }, function (err) {
                    $log.error(err);
                    toastr.error(err.error.code + ' ' + err.error.error);
                    vm.fetching = false;
                });
        }

        function setFilterField (aFilterField) {
            movieDataService.setFilterField(aFilterField);
        }

        function setFilterValue () {
            movieDataService.setFilterValue(vm.filter);
        }
    }
}());