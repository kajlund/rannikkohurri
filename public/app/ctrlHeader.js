var angular = angular || null,
    toastr = toastr || null;

(function (angular, toastr) {
    'use strict';

    angular.module('app').controller('headerController', ['$scope', '$rootScope', '$location', '$log', '$modal', 'SessionService',
        function ($scope, $rootScope, $location, $log, $modal, SessionService) {
            var modalInstance = $modal({
                scope: $scope,
                template: 'app/signon.html',
                show: false
            });

            $scope.session = SessionService;
            $scope.user = { name: '', pwd: '' };

            $scope.getClass = function (path) {
                var className = "";

                if ($location.path().substr(0, path.length) === path) {
                    className = "active";
                }
                return className;
            };

            $scope.login = function () {
                modalInstance.hide();
                SessionService.signon($scope.user.name, $scope.user.pwd).then(function () {
                    toastr.info(SessionService.userObj.username + ' signed on');
                }, function (error) {
                    toastr.error(error.error);
                });
            };

            $scope.onSignonClick = function () {
                modalInstance.$promise.then(modalInstance.show);
            };

            $scope.onSignoffClick = function () {
                $log.info('Signing off');
                SessionService.signoff();
                toastr.warning('User signed off');
            };
        }]);
}(angular, toastr));