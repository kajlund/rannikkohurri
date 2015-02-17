(function () {
    'use strict';

    angular
        .module('app')
        .controller('CheatViewController', CheatViewController);

    /* @ngInject */
    CheatViewController.$inject = ['$location', '$routeParams', '$log', '$modal', 'sessionService', 'cheatDataService'];

    function CheatViewController ($location, $routeParams, $log, $modal, sessionService, cheatDataService) {
        var vm = this,
            cacheId = $routeParams.cacheId;

        vm.cache = null;
        vm.doDelete = doDelete;
        vm.session = sessionService;

        activate();

    /////////////////////////////////////////////////////////////////////////////////////

        function activate () {
            $log.info('*** Activated CheatViewController');
            $log.debug('   cacheId      => %s', cacheId);
            init();
        }

        function doDelete () {
            var options = {
                    title: 'Delete Cache?',
                    content: 'You are about to delete cache "' + vm.cache.name + '"'
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
                    cheatDataService.deleteItem(cacheId)
                        .then(function (data) {
                            $log.info('Deleted Cache %o', data);
                            toastr.success('Cache Deleted');
                            $location.url('/cheats');
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
            cheatDataService.getItem(cacheId)
                .then(function (res) {
                    vm.cache = res.data;
                    $log.debug('   vm.cache     => %o', vm.cache);
                }, function (err) {
                    $log.error(err);
                    toastr.error(err.error.code + ' ' + err.error.error);
                    $location.url('/cheats');
                });
        }
    }
}());