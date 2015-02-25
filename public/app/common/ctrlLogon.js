(function () {
    'use strict';

    angular
        .module('app')
        .controller('LogonController', LogonController);

    /* @ngInject */
    LogonController.$inject = ['$log', 'loginRedirectInterceptor', 'sessionService', 'logonService'];

    function LogonController($log, loginRedirectInterceptor, sessionService, logonService) {
        var vm = this;
        vm.logon = logon;
        vm.username = '';
        vm.password = '';
        vm.user = sessionService.user;

        activate();

        /////////////////////////////////////////////////////////////////////////////

        function activate () {

        }

        function logon (frm) {
            if (frm.$valid) {
                logonService.logOn(vm.username, vm.password)
                    .then(function() {
                        loginRedirectInterceptor.redirectPostLogin();
                    })
                    .catch('Could not log on');
                vm.username = vm.password = '';
                frm.$setUntouched();
            }
        }
    }
})();


