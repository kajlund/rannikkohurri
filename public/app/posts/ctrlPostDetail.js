var angular = angular || null,
    marked = marked || null,
    toastr = toastr || null;

(function (angular, marked, toastr) {
    'use strict';

    angular.module('app').controller('PostDetailController', ['$scope', '$rootScope', '$stateParams', '$http', '$sce', '$log', 'PostDataService',
        function ($scope, $rootScope, $stateParams, $http, $sce, $log, PostDataService) {
            $rootScope.spinner.spin();

            function renderData(aPost) {
                $http.get('/dropbox/' + aPost.get('slug'))
                    .then(function (data) {
                        $scope.markdown = $sce.trustAsHtml(marked(data.data));
                    }, function (err) {
                        $log.error(err);
                        toastr.error(err.error.code + ' ' + err.error.error);
                    });
            }

            if ($stateParams.id) {
                PostDataService.getPost($stateParams.id)
                    .then(function (data) {
                        $scope.title = data.get('title');
                        renderData(data);
                        $rootScope.spinner.stop();
                    },  function (err) {
                        $rootScope.spinner.stop();
                        $log.error(err);
                        toastr.error(err.error.code + ' ' + err.error.error);
                    });
            }
        }]);
}(angular, marked, toastr));