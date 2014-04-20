var angular = angular || null;

(function (angular) {
    'use strict';

    angular.module('app').controller('HomeController', ['$scope', '$rootScope', '$location', '$log', '$modal', 'SessionService',
        function ($scope, $rootScope, $location, $log, $modal, SessionService) {
            $scope.session = SessionService;

            if (!SessionService.loggedOn()) {
                $log.info('not logged on');
                SessionService.autoSignon()
                    .then(function (data) {
                        $log.info($scope.session);
                    }, function (err) {
                        $log.error(err);
                    });
            }
        }]);
}(angular));