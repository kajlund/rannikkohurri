var angular = angular || null;

(function (angular) {
    'use strict';
    angular.module('app').controller('movieDeleteController', ['$scope', '$modalInstance', 'movie',
        function ($scope, $modalInstance, movie) {
            $scope.movie = movie;

            $scope.ok = function () {
                $modalInstance.close('OK');
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('Cancel');
            };
        }]);
}(angular));