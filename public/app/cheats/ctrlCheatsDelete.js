(function (angular) {
    'use strict';
    angular.module('app').controller('cheatsDeleteController', ['$scope', '$modalInstance', 'cache',
        function ($scope, $modalInstance, cache) {
            $scope.cache = cache;

            $scope.ok = function () {
                $modalInstance.close('OK');
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('Cancel');
            };
        }]);
}(angular));