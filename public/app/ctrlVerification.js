(function () {
    'use strict';

    angular
        .module('app')
        .controller('VerificationController', VerificationController);

    VerificationController.$inject = ['$modalInstance', 'opts'];

        function VerificationController ($modalInstance, opts) {
            var vm = this;

            vm.opts = opts;

            vm.ok = function () {
                $modalInstance.close('ok');
            };

            vm.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        }
}());