(function () {
    'use strict';

    angular
        .module('app')
        .controller('HeaderController', HeaderController);

    /* @ngInject */
    HeaderController.$inject = ['$log', '$location', '$modal', 'sessionService'];

    function HeaderController($log, $location, $modal, sessionService) {
        var vm = this;

        vm.getClass = getClass;
        vm.onSignoffClick = onSignoffClick;
        vm.onSignonClick = onSignonClick;
        vm.session = sessionService;
        vm.user = {name: '', pwd: ''};

        activate();

        /////////////////////////////////////////////////////////////////////////////

        function activate () {
            if (!sessionService.loggedOn) {
                $log.info('not logged on');
                sessionService.autoSignon()
                    .then(function (data) {
                        $log.info(vm.session);
                    }, function (err) {
                        $log.error(err);
                    });
            }
        }

        function getClass(path) {
            var className = '';
            if ($location.path().substr(0, path.length) === path) {
                className = 'active';
            }
            return className;
        }

        function onSignoffClick() {
            $log.info('Signing off');
            sessionService.signoff();
            toastr.info('User signed off');
        }

        function onSignonClick() {
            var modalInstance = $modal.open({
                controller: 'SignonController',
                controllerAs: 'vm',
                templateUrl: 'app/tmplSignon.html',
                size: 'lg',
                resolve: {
                    user: function () {
                        return vm.user;
                    }
                }
            });

            modalInstance.result.then(function (response) {
                if (response === 'ok') {
                    toastr.info(sessionService.userObj.username + ' signed on');
                }
            }, function () {
                toastr.info('Signon cancelled by user');
            });
        }
    }
})();


