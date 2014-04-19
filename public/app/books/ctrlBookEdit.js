(function (angular) {
    'use strict';
    angular.module('app').controller('bookEditController', ['$scope', '$modalInstance', 'book',
        function ($scope, $modalInstance, book) {
            $scope.book = book;
            $scope.languages = [
                'swe',
                'eng',
                'fin'
            ];
            $scope.genres = [
                'Biography',
                'History',
                'Kids',
                'Misc',
                'Novel',
                'Science',
                'Technology'
            ];

            $scope.ok = function () {
                $modalInstance.close('OK');
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('Cancel');
            };
        }]);
}(angular));