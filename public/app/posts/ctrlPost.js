(function (angular, marked) {
    'use strict';

    angular.module('app').controller('PostController', ['$scope', '$rootScope', '$routeParams', '$http', '$sce', '$log', 'PostDataService',
        function ($scope, $rootScope, $routeParams, $http, $sce, $log, PostDataService) {
            $rootScope.spinner.spin();

            function renderData(aPost) {
                $http.get('/dropbox/' + aPost.get('slug'))
                    .then(function (data) {
                        $scope.markdown = $sce.trustAsHtml(marked(data.data));
                        $rootScope.spinner.stop();
                    });
            }

            if ($routeParams.id) {
                PostDataService.getPost($routeParams.id)
                    .then(function (data) {
                        $scope.title = data.get('title');
                        renderData(data);
                    });
            }
        }]);
}(angular, marked));