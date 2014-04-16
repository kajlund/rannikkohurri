(function (angular) {
    'use strict';
    angular.module('app').controller('cheatsEditController', ['$scope', '$modalInstance', 'cache',
        function ($scope, $modalInstance, cache) {
            $scope.cache = cache;
            $scope.cacheTypes = [
                'Tradi',
                'Mystery',
                'Multi',
                'Earth',
                'Letterbox',
                'Event',
                'Lab',
                'Virtual'
            ];

            $scope.currentType = cache.cacheType;

            $scope.ok = function () {
                $modalInstance.close('OK');
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('Cancel');
            };
        }]);
}(angular));