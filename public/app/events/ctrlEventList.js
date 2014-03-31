(function (angular) {
    'use strict';

    angular.module('app').controller('EventListController', ['$scope', '$rootScope', '$log', '$modal', 'EventDataService',
        function ($scope, $rootScope, $log, $modal, EventDataService) {
            $rootScope.isBusy = true;

            function getEvents() {
                EventDataService.getEvents()
                    .then(function (data) {
                        $log.info(data);
                        $scope.events = data;
                        $rootScope.isBusy = false;
                        $scope.$apply();
                    });
            }

            getEvents();

            $scope.onAddClick = function () {
                var event = {
                        startTime: undefined,
                        eventName: "",
                        placeName: "",
                        organizer: "",
                        organizerUrl: "",
                        smartum: false
                    },
                    modalInstance = $modal.open({
                        templateUrl: 'app/events/edit.html',
                        controller: 'eventEditController',
                        resolve: { event: function () { return event; } }
                    });

                modalInstance.result.then(function () {
                    EventDataService.updateEvent(event).then(function () {
                        $log.info('Added new Event');
                        getEvents();
                        //toastr.success('Audiobook added');

                    });
                }, function () {
                    $log.info('Cancelled Edit');
                    //toastr.warning('Edit cancelled');
                });
            };

            $scope.onEditClick = function (e) {
                var event = {
                        id: e.id,
                        startTime: e.get('startTime'),
                        eventName: e.get('eventName'),
                        placeName: e.get('placeName'),
                        organizer: e.get('organizer'),
                        organizerUrl: e.get('organizerUrl'),
                        smartum: e.get('smartum')
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
                    EventDataService.updateEvent(event).then(function () {
                        getEvents();
                        //toastr.success('Audiobook saved');
                    });
                }, function () {
                    $log.info('Cancel');
                    //toastr.warning('Edit cancelled');
                });

                $log.info('Editing Event %o', e);
            };

            $scope.onDeleteClick = function (e) {
                var event = e,
                    modalInstance = $modal.open({
                        templateUrl: 'app/events/delete.html',
                        controller: 'eventDeleteController',
                        resolve: {
                            event: function () {
                                return event;
                            }
                        }
                    });

                modalInstance.result.then(function () {
                    $log.info('Deleting Event %o', event);
                    EventDataService.deleteEvent(event).then(function () {
                        getEvents();
                        //toastr.success('Audiobook deleted');
                    });
                }, function () {
                    $log.info('Cancel');
                    //toastr.warning('Delete cancelled');
                });
            };
        }]);
}(angular));