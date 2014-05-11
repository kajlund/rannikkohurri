var angular = angular || null,
    toastr = toastr || null;

(function (angular) {
    'use strict';

    angular.module('app').controller('eventEditController', ['$scope', '$rootScope', '$state', '$log', 'SessionService', 'eventDataService',
        function ($scope, $rootScope, $state, $log, SessionService, eventDataService) {
            $scope.session = SessionService;
            $scope.eventId = $rootScope.$stateParams.eventId;

            if ($scope.eventId === '_new') {
                $scope.event = {
                    starts: '',
                    eventName: '',
                    placeName: '',
                    organizer: '',
                    organizerUrl: '',
                    smartum: false
                };
            } else {
                eventDataService.getEvent($scope.eventId)
                    .then(function (res) {
                        $scope.event = res.data;
                    }, function (err) {
                        $log.error(err);
                        toastr.error(err.error.code + ' ' + err.error.error);
                        $state.go('events');
                    });
            }

            $scope.save = function () {
                eventDataService.updateItem($scope.event)
                    .then(function (res) {
                        // data.createdAt data.objectId
                        $log.info('Saved Event %o', res);
                        toastr.success('Event saved');
                        $state.go('events');
                    }, function (err) {
                        $log.error('Error saving Event %o', err);
                        toastr.error(err.error.code + ' ' + err.error.error);
                        $state.go('events');
                    });
            };

            $scope.cancel = function () {
                $log.info('Cancelled Edit');
                toastr.warning('Edit cancelled');
                $state.go('events');
            };
        }]);
}(angular));