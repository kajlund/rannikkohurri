var angular = angular || null;

(function (angular) {
    'use strict';

    angular.module('app').controller('movieEditController', ['$scope', '$modalInstance', 'movie',
        function ($scope, $modalInstance, movie) {
            $scope.movie = movie;
            //$scope.dateStr = movie.seenAt.iso.substr(0, 10);
            $scope.dt = new Date();
            $scope.dateOptions = {
                formatYear: 'yy',
                startingDay: 1
            };

            $scope.open = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();

                $scope.opened = true;
            };

            $scope.ok = function () {
                //var tmpDate = new Date($scope.dateStr);
                //$scope.movie.seenAt.iso = tmpDate.toISOString();
                $modalInstance.close('OK');
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('Cancel');
            };
        }]);
}(angular));