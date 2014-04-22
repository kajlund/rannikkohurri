var angular = angular || null,
    toastr = toastr || null;

(function (angular, toastr) {
    'use strict';

    angular.module('app').controller('EventListController', ['$scope', '$rootScope', '$log', '$modal', 'SessionService', 'EventDataService',
        function ($scope, $rootScope, $log, $modal, SessionService, EventDataService) {

            function getEvents() {
                $rootScope.spinner.spin();
                EventDataService.getEvents()
                    .then(function (data) {
                        $log.info(data);
                        $scope.events = data.data.results;
                        $rootScope.spinner.stop();
                    }, function (data) {
                        $rootScope.spinner.stop();
                        $log.error(data);
                        toastr.error(data.error.code + ' ' + data.error.error);
                    });
            }

            $scope.session = SessionService;
            getEvents();

            $scope.onAddClick = function () {
                var event = {
                        starts: '',
                        eventName: '',
                        placeName: '',
                        organizer: '',
                        organizerUrl: '',
                        smartum: false
                    },
                    modalInstance = $modal.open({
                        templateUrl: 'app/events/edit.html',
                        controller: 'eventEditController',
                        resolve: {
                            event: function () {
                                return event;
                            }
                        }
                    });

                modalInstance.result.then(function () {
                    EventDataService.updateItem(event)
                        .then(function (data) {
                            // data.createdAt data.objectId
                            $log.info('Added Event %o', data);
                            toastr.success('Event added');
                            getEvents();
                        }, function (data) {
                            $log.error(data);
                            toastr.error(data.error.code + ' ' + data.error.error);
                        });
                }, function () {
                    $log.info('Cancelled New');
                    toastr.warning('New cancelled');
                });
            };

            $scope.onEditClick = function (event) {
                var modalInstance = $modal.open({
                        templateUrl: 'app/events/edit.html',
                        controller: 'eventEditController',
                        resolve: {
                            event: function () {
                                return event;
                            }
                        }
                    });

                modalInstance.result.then(function () {
                    EventDataService.updateItem(event)
                        .then(function (data) {
                            // data.updatedAt
                            $log.info('Updated Event %o', data);
                            toastr.success('Event updated');
                            getEvents();
                        }, function (data) {
                            $log.error(data);
                            toastr.error(data.error.code + ' ' + data.error.error);
                        });
                }, function () {
                    $log.info('Cancelled Edit');
                    toastr.warning('Edit cancelled');
                });
            };

            $scope.onDeleteClick = function (event) {
                var modalInstance = $modal.open({
                        templateUrl: 'app/events/delete.html',
                        controller: 'eventDeleteController',
                        resolve: { event: function () { return event; } }
                    });

                modalInstance.result.then(function () {
                    EventDataService.deleteItem(event)
                        .then(function (data) {
                            $log.info('Deleted Event');
                            toastr.success('Event deleted');
                            getEvents();
                        }, function (data) {
                            $log.error(data);
                            toastr.error(data.error.code + ' ' + data.error.error);
                        });
                }, function () {
                    $log.info('Cancel');
                    toastr.warning('Delete cancelled');
                });
            };
        }]);
}(angular, toastr));