(function (angular) {
    'use strict';
    angular.module('app').controller('bookDeleteController', ['$scope', '$modalInstance', 'book',
        function ($scope, $modalInstance, book) {
            $scope.book = book;

            $scope.ok = function () {
                $modalInstance.close('OK');
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('Cancel');
            };
        }]);
}(angular));