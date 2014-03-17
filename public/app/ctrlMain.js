(function (angular) {
    'use strict';

    angular.module('app').controller('MainController', ['$scope', '$rootScope', '$location', '$log', 'SessionService',
        function ($scope, $rootScope, $location, $log, SessionService) {

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

            $scope.getClass = function (path) {
                var className = "";

                if ($location.path().substr(0, path.length) === path) {
                    className = "active";
                }
                return className;
            };

            $scope.onSignonClick = function () {
                $log.info('Signing on');
            };

            $scope.onSignoffClick = function () {
                $log.info('Signing off');
            };
        }]);
}(angular));