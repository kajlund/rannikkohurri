(function (angular, marked) {
    'use strict';

    angular.module('app').controller('PostController', ['$scope', '$routeParams', '$http', '$sce', '$log', 'PostDataService',
        function ($scope, $routeParams, $http, $sce, $log, PostDataService) {
            function renderData(aPost) {
                $http.get('/dropbox/' + aPost.get('slug'))
                    .then(function (data) {
                        $log.info(data);
                        $scope.markdown = $sce.trustAsHtml(marked(data.data));
                    });
            }

            if ($routeParams.id) {
                PostDataService.getPost($routeParams.id)
                    .then(function (data) {
                        $log.info(data);
                        renderData(data);
                    });
            }
        }]);
}(angular, marked));