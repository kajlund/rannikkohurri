var angular = angular || null;

(function (angular) {
    'use strict';

    angular.module('app').controller('HomeController', ['$scope', '$log', 'SessionService',
        function ($scope, $log, SessionService) {
            $scope.session = SessionService;
            $log.info('Activating HomeController');

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