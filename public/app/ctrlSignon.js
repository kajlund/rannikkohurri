(function () {
    'use strict';

    angular
        .module('app')
        .controller('SignonController', SignonController);

    /* @ngInject */
    SignonController.$inject = ['$modalInstance', 'user', 'sessionService'];

    function SignonController ($modalInstance, user, sessionService) {
        var vm = this;
        vm.user = user;

        vm.login = function () {
            sessionService.signon(vm.user.name, vm.user.pwd)
                .then(function () {
                    $modalInstance.close('ok');
                }, function (error) {
                    toastr.error(error.error);
                });
        };

        vm.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
}());