(function (app) {
    'use strict';

    angular
        .module('app')
        .controller('MovieListController', MovieListController);

    /* @ngInject */
    MovieListController.$inject = ['$location', '$modal', '$log',
        'sessionService', 'movieDataService', 'toastr', '_'];

    function MovieListController ($location, $modal, $log,
                                  sessionService, movieDataService, toastr, _) {
        var vm = this,
            modalInstance = null;

        vm.session = sessionService;
        vm.filter = '';
        vm.currentPage = 1;
        vm.dlgVerifyCancel = dlgVerifyCancel;
        vm.dlgVerifyOK = dlgVerifyOK;
        vm.maxSize = 10;
        vm.onDeleteClick = onDeleteClick;
        vm.order = '-seenAt';
        vm.scroll = doScroll;
        vm.totalItems = 0;
        vm.currentItem = null;
        vm.items = [];
        vm.fetching = false;

        activate();

    ////////////////////////////////////////////////////////////////////////////

        function activate () {
            getItems();
        }

        function dlgVerifyCancel () {
            modalInstance.hide();
            toastr.warning('Delete cancelled');
        }

        function dlgVerifyOK () {
            modalInstance.hide();
            movieDataService.deleteItem(vm.currentItem)
                .then(function (data) {
                    $log.info('Deleted Movie');
                    toastr.success('Movie deleted');
                    vm.items = _.filter(vm.items, function (movie) {
                        return movie.objectId !== vm.currentItem.objectId;
                    });
                }, function (err) {
                    $log.error(err);
                    toastr.error(err.error.code + ' ' + err.error.error);
                });
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

        function onDeleteClick (movie) {
            vm.currentItem = movie;
            modalInstance = $modal({
                scope: vm,
                template: 'app/tmplVerify.html',
                show: true,
                title: 'Delete Movie?',
                content: 'You are about to delete movie <em>' + movie.etitle + '</em>'
            });
        }
    }
}());