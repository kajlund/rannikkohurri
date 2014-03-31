(function (angular) {
    'use strict';
    angular.module('app').controller('eventDeleteController', ['$scope', '$modalInstance', 'event',
        function ($scope, $modalInstance, event) {
            $scope.event = event;

            $scope.ok = function () {
                $modalInstance.close('OK');
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('Cancel');
            };
        }]);
}(angular));