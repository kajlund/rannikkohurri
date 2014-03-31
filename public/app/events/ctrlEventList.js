(function (angular) {
    'use strict';

    angular.module('app').controller('EventListController', ['$scope', '$rootScope', '$log', 'OrDataService',
        function ($scope, $rootScope, $log, OrDataService) {
            $rootScope.isBusy = true;

            OrDataService.getEvents()
                .then(function (data) {
                    $log.info(data);
                    $scope.events = data;
                    $rootScope.isBusy = false;
                    $scope.$apply();
                });

            $scope.onAddClick = function () {
                $log.info('Adding new Event');
            };

            $scope.onEditClick = function (p) {
                $log.info('Editing Event %o', p);
            };

            $scope.onDeleteClick = function (p) {
                $log.info('Deleting Event %o', p);
            };
        }]);
}(angular));