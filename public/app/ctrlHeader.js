var angular = angular || null,
    toastr = toastr || null;

(function (angular, toastr) {
    'use strict';

    angular.module('app').controller('HeaderController', ['$scope', '$rootScope', '$location', '$log', '$modal', 'SessionService',
        function ($scope, $rootScope, $location, $log, $modal, SessionService) {
            $scope.session = SessionService;

            $scope.getClass = function (path) {
                var className = "";

                if ($location.path().substr(0, path.length) === path) {
                    className = "active";
                }
                return className;
            };

            $scope.onSignonClick = function () {
                var user = { name: '', pwd: '' },
                    modalInstance = $modal.open({
                        templateUrl: 'app/signon.html',
                        controller: 'SignonController',
                        resolve: {
                            user: function () {
                                return user;
                            }
                        }
                    });

                modalInstance.result.then(function () {
                    SessionService.signon(user.name, user.pwd)
                        .then(function (result) {
                            toastr.info(SessionService.userObj.username + ' signed on');
                        }, function (error) {
                            toastr.error(error.error);
                        });
                }, function () {
                    toastr.info('Signon cancelled');
                });
            };

            $scope.onSignoffClick = function () {
                $log.info('Signing off');
                SessionService.signoff();
                toastr.warning('User signed off');
            };
        }]);
}(angular, toastr));