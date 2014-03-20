(function (angular) {
    'use strict';

    angular.module('app').controller('PostsController', ['$scope', '$rootScope', '$log', 'PostDataService',
        function ($scope, $rootScope, $log, PostDataService) {
            $rootScope.isBusy = true;

            PostDataService.getPosts()
                .then(function (data) {
                    $log.info(data);
                    $scope.posts = data;
                    $rootScope.isBusy = false;
                    $scope.$apply();
                });
        }]);
}(angular));