(function () {
    'use strict';

    angular
        .module('app')
        .controller('MovieEditController', MovieEditController);

    /* @ngInject */
    MovieEditController.$inject = ['$routeParams', '$location', '$log',
        'sessionService', 'movieDataService', 'toastr'];

    function MovieEditController ($routeParams, $location, $log, sessionService,
                                  movieDataService, toastr) {
        var vm = this;

        vm.dateOptions = { formatYear: 'yy', startingDay: 1 };
        vm.doCancel = doCancel;
        vm.doSave   = doSave;
        vm.movieId  = $routeParams.movieId;
        vm.open     = doOpen;
        vm.opened   = false;
        vm.session = sessionService;

        activate();

    /////////////////////////////////////////////////////////////////////////

        function activate () {
            if (vm.movieId === '_new') {
                vm.movie = {
                    seenAt: {'__type': 'Date', 'iso': new Date().toISOString()},
                    etitle: '',
                    otitle: '',
                    pic: '',
                    rating: 0,
                    url: '',
                    synopsis: '',
                    comment: ''
                };
            } else {
                movieDataService.getItem(vm.movieId)
                    .then(function (res) {
                        vm.movie = res.data;
                        $log.debug('vm.movie -> %o', vm.movie);
                    }, function (err) {
                        $log.error(err);
                        toastr.error(err.error.code + ' ' + err.error.error);
                        $location.url('/movies');
                    });
            }
        }

        function doCancel () {
            $log.info('Cancelled Edit');
            toastr.warning('Edit cancelled');
            $location.url('/movies');
        }

        function doSave () {
            movieDataService.updateItem(vm.movie)
                .then(function (res) {
                    // data.createdAt data.objectId
                    $log.info('Saved Movie %o', res);
                    toastr.success('Movie saved');
                    $location.url('/movies');
                }, function (err) {
                    $log.error('Error saving Movie %o', err);
                    toastr.error(err.error.code + ' ' + err.error.error);
                    $location.url('/movies');
                });
        }

        function doOpen ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            vm.opened = true;
        }
    }
}());