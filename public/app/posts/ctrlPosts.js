(function (angular) {
    'use strict';

    angular.module('app').controller('PostsController', ['$scope', '$log', 'PostDataService',
        function ($scope, $log, PostDataService) {
            PostDataService.getPosts()
                .then(function (data) {
                    $log.info(data);
                    $scope.posts = data;
                    $scope.$apply();
                });
        }]);
}(angular));