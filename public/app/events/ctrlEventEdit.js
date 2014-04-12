(function (angular) {
    'use strict';
    angular.module('app').controller('eventEditController', ['$scope', '$modalInstance', 'event',
        function ($scope, $modalInstance, event, eventDate) {
            $scope.event = event;

            $scope.ok = function () {
                $modalInstance.close('OK');
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('Cancel');
            };
        }]);
}(angular));