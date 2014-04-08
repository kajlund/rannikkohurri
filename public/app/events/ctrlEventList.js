var angular = angular || null,
    toastr = toastr || null;

(function (angular, toastr) {
    'use strict';

    angular.module('app').controller('EventListController', ['$scope', '$rootScope', '$log', '$modal', 'EventDataService',
        function ($scope, $rootScope, $log, $modal, EventDataService) {
            $rootScope.spinner.spin();

            function getEvents() {
                EventDataService.getEvents()
                    .then(function (data) {
                        $log.info(data);
                        $scope.events = data.data.results;
                        $rootScope.spinner.stop();
                    });
            }

            function parseToObj(aParseObj) {
                var obj = {
                        id: aParseObj.id,
                        startTime: aParseObj.get('startTime'),
                        eventName: aParseObj.get('eventName'),
                        placeName: aParseObj.get('placeName'),
                        organizer: aParseObj.get('organizer'),
                        organizerUrl: aParseObj.get('organizerUrl'),
                        smartum: aParseObj.get('smartum')
                    };
                return obj;
            }

            function objToParse(aObj, aParseObj) {
                aParseObj.set('startTime', aObj.startTime);
                aParseObj.set('eventName', aObj.eventName);
                aParseObj.set('placeName', aObj.placeName);
                aParseObj.set('organizer', aObj.organizer);
                aParseObj.set('organizerUrl', aObj.organizerUrl);
                aParseObj.set('smartum', aObj.smartum);
            }

            getEvents();

            $scope.onAddClick = function () {
                var parseEvent = new EventDataService.EventModel(),
                    event = parseToObj(parseEvent),
                    modalInstance = $modal.open({
                        templateUrl: 'app/events/edit.html',
                        controller: 'eventEditController',
                        resolve: { event: function () { return event; } }
                    });

                modalInstance.result.then(function () {
                    objToParse(event, parseEvent);
                    parseEvent.save(null, {
                        success: function (newPost) {
                            $log.info('Added new Event');
                            toastr.success('Event added');
                            getEvents();
                        },
                        error: function (newPost, error) {
                            $log.error(error.description);
                            toastr.error(error.description);
                        }
                    });
                }, function () {
                    $log.info('Cancelled Edit');
                    toastr.warning('New cancelled');
                });
            };

            $scope.onEditClick = function (parseEvent) {
                var event = parseToObj(parseEvent),
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
                    objToParse(event, parseEvent);
                    parseEvent.save({
                        success: function (newPost) {
                            $log.info('Updated Event');
                            toastr.success('Event updated');
                            getEvents();
                        },
                        error: function (newPost, error) {
                            $log.error(error.description);
                            toastr.error(error.description);
                        }
                    });
                }, function () {
                    $log.info('Cancel');
                    toastr.warning('Edit cancelled');
                });
            };

            $scope.onDeleteClick = function (parseEvent) {
                var event = parseToObj(parseEvent),
                    modalInstance = $modal.open({
                        templateUrl: 'app/events/delete.html',
                        controller: 'eventDeleteController',
                        resolve: { event: function () { return event; } }
                    });

                modalInstance.result.then(function () {
                    parseEvent.destroy({
                        success: function (deletedObject) {
                            toastr.success('Event deleted');
                            getEvents();
                        },
                        error: function (myObject, error) {
                            $log.error(error.description);
                            toastr.error(error.description);
                        }
                    });
                }, function () {
                    $log.info('Cancel');
                    toastr.warning('Delete cancelled');
                });
            };
        }]);
}(angular, toastr));