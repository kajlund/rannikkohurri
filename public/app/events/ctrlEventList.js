(function (app) {
    'use strict';

    app.controller('EventListController', ['$scope', '$location', '$log', '$modal', 'SessionService', 'eventDataService',
        function ($scope, $location, $log, $modal, SessionService, eventDataService) {
            var modalInstance = null;

            function getEvents() {
                eventDataService.getEvents()
                    .then(function (res) {
                        $scope.events = res.data.results;
                    }, function (err) {
                        $log.error(err);
                        toastr.error(err.error.code + ' ' + err.error.error);
                    });
            }

            $scope.session = SessionService;
            $scope.totalItems = 0;
            $scope.currentItem = null;

            getEvents();

            $scope.onAddClick = function () {
                $location.path('/events/_new');
            };

            $scope.onEditClick = function (event) {
                $location.path('/events/' + event.objectId);
            };

            $scope.onDeleteClick = function (event) {
                $scope.currentItem = event;
                modalInstance = $modal({
                    scope: $scope,
                    template: 'app/tmplVerify.html',
                    show: true,
                    title: 'Delete Event?',
                    content: 'You are about to delete event <em>' + event.eventName + '/' + event.placeName + '</em>'
                });
            };

            $scope.dlgVerifyCancel = function () {
                modalInstance.hide();
                toastr.warning('Delete cancelled');
            };

            $scope.dlgVerifyOK = function () {
                modalInstance.hide();
                eventDataService.deleteItem($scope.currentItem)
                    .then(function (data) {
                        $log.info('Deleted Event');
                        toastr.success('Event deleted');
                        $scope.events = _.filter($scope.events, function (event) {
                            return event.objectId !== $scope.currentItem.objectId;
                        });
                    }, function (err) {
                        $log.error(err);
                        toastr.error(err.error.code + ' ' + err.error.error);
                    });
            };
        }]);
}(angular.module('app')));