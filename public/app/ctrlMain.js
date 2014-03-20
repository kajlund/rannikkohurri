(function (angular, toastr) {
    'use strict';

    angular.module('app').controller('MainController', ['$scope', '$rootScope', '$location', '$log', '$modal', 'SessionService',
        function ($scope, $rootScope, $location, $log, $modal, SessionService) {

            $rootScope.spinnerOptions = {
                radius: 40,
                lines: 7,
                length: 0,
                width: 30,
                speed: 1.7,
                corners: 1,
                trail: 100,
                color: '#000',
                left: 'auto',
                top: 'auto'
            };
            $rootScope.isBusy = true;
            $scope.session = SessionService;
            $log.info(SessionService);

            if (!SessionService.loggedOn()) {
                $log.info('not logged on');
                SessionService.autoSignon()
                    .then(function (data) {
                        $log.info($scope.session);
                    }, function (err) {
                        $log.error(err);
                    });
            }
            $rootScope.isBusy = false;

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