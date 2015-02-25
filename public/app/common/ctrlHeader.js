(function () {
    'use strict';

    angular
        .module('app')
        .controller('HeaderController', HeaderController);

    /* @ngInject */
    HeaderController.$inject = ['$log', '$location', 'sessionService', 'logonService'];

    function HeaderController($log, $location, sessionService, logonService) {
        var vm = this;

        vm.getClass = getClass;
        vm.onLogOffClick = onLogOffClick;
        vm.session = sessionService;

        activate();

        /////////////////////////////////////////////////////////////////////////////

        function activate () {
            if (!sessionService.user.loggedOn) {
                $log.info('not logged on');
            }
        }

        function getClass(path) {
            var className = '';
            if ($location.path().substr(0, path.length) === path) {
                className = 'active';
            }
            return className;
        }

        function onLogOffClick() {
            var username = sessionService.user.username;
            $log.info('Signing off %s', username);
            logonService.logOff();
            toastr.info('User ' + username + ' signed off');
            $location.url('/');
        }
    }
})();


