(function () {
    'use strict';

    angular
        .module('app')
        .controller('MovieViewController', MovieViewController);

    /* @ngInject */
    MovieViewController.$inject = ['$location', '$routeParams', '$log', '$modal', 'sessionService', 'movieDataService'];

    function MovieViewController ($location, $routeParams, $log, $modal, sessionService, movieDataService) {
        var vm = this,
            movieId = $routeParams.movieId;

        vm.movie = null;
        vm.canEdit = canEdit;
        vm.delete = doDelete;
        vm.edit = edit;
        vm.session = sessionService;

        activate();

    /////////////////////////////////////////////////////////////////////////////////////

        function activate () {
            $log.info('*** Activated MovieViewController');
            init();
        }

        function canEdit () {
            return sessionService.loggedOn && movieId;
        }

        function edit () {
            $location.path('/movies/edit/' + movieId);
        }

        function doDelete () {
            var options = {
                    title: 'Delete Movie?',
                    content: 'You are about to delete Movie "' + vm.movie.otitle + '"'
                },
                modalInstance = $modal.open({
                    controller: 'VerificationController',
                    controllerAs: 'vm',
                    templateUrl: 'app/tmplVerification.html',
                    size: 'sm',
                    resolve: {
                        opts: function () {
                            return options;
                        }
                    }
            });

            modalInstance.result.then(function (response) {
                if (response === 'ok') {
                    movieDataService.deleteItem(movieId)
                        .then(function (data) {
                            $log.info('Deleted Movie %o', data);
                            toastr.success('Movie deleted');
                            $location.url('/movies');
                        }, function (err) {
                            $log.error(err);
                            toastr.error(err.error.code + ' ' + err.error.error);
                        });
                }
            }, function () {
                toastr.info('Delete cancelled by user');
            });
        }

        function init () {
            movieDataService.getItem(movieId)
                .then(function (res) {
                    vm.movie = res.data;
                    $log.debug('   movieId      => %s', movieId);
                    $log.debug('   vm.movie     => %o', vm.movie);
                }, function (err) {
                    $log.error(err);
                    toastr.error(err.error.code + ' ' + err.error.error);
                    $location.url('/movies');
                });
        }
    }
}());