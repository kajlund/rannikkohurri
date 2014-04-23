var angular = angular || null;

(function (angular) {
    'use strict';

    angular.module('app').controller('HomeController', ['$scope', '$rootScope', '$location', '$log', '$modal', 'SessionService',
        function ($scope, $rootScope, $location, $log, $modal, SessionService) {
            $scope.session = SessionService;

            if (!SessionService.loggedOn()) {
                $rootScope.busy(true);
                $log.info('not logged on');
                SessionService.autoSignon()
                    .then(function (data) {
                        $log.info($scope.session);
                        $rootScope.busy(false);
                    }, function (err) {
                        $log.error(err);
                        $rootScope.busy(false);
                    });
            }
        }]);
}(angular));