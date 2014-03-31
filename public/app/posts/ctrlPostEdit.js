(function (angular) {
    'use strict';
    angular.module('app').controller('postEditController', ['$scope', '$modalInstance', 'post',
        function ($scope, $modalInstance, post) {
            $scope.post = post;

            $scope.ok = function () {
                $modalInstance.close('OK');
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('Cancel');
            };
        }]);
}(angular));