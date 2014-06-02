var angular = angular || null,
    marked = marked || null,
    toastr = toastr || null;

(function (angular, marked, toastr) {
    'use strict';

    angular.module('app').controller('PostDetailController', ['$scope', '$rootScope', '$stateParams', '$http', '$sce', '$log', 'PostDataService',
        function ($scope, $rootScope, $stateParams, $http, $sce, $log, PostDataService) {
            $scope.currentPost = null;
            $rootScope.busy(true);

            function renderData(aPost) {
                $log.info('slug = ' + aPost.slug);
                $http.get('/dropbox/' + aPost.slug)
                    .then(function (res) {
                        $scope.markdown = $sce.trustAsHtml(marked(res.data));
                    }, function (err) {
                        $log.error(err);
                        toastr.error(err.error.code + ' ' + err.error.error);
                    });
            }

            if ($stateParams.slug) {
                $log.info('post = ' + $stateParams.slug);
                PostDataService.getPost($stateParams.slug)
                    .then(function (res) {
                        $log.info('res = %o', res);
                        $scope.currentPost = res.data.results[0];
                        $scope.title = $scope.currentPost.title;
                        renderData($scope.currentPost);
                        $rootScope.busy(false);
                    },  function (err) {
                        $rootScope.busy(false);
                        $scope.currentPost = null;
                        $log.error(err);
                        toastr.error(err.error.code + ' ' + err.error.error);
                    });
            }
        }]);
}(angular, marked, toastr));