var angular = angular || null,
    toastr = toastr || null;

(function (app) {
    'use strict';

    app.controller('EventListController', ['$scope', '$rootScope', '$state', '$log', '$modal', 'SessionService', 'eventDataService',
        function ($scope, $rootScope, $state, $log, $modal, SessionService, eventDataService) {
            var modalInstance = null;

            function getEvents() {
                $rootScope.busy(true);
                eventDataService.getEvents()
                    .then(function (res) {
                        $scope.events = res.data.results;
                        $rootScope.busy(false);
                    }, function (err) {
                        $rootScope.busy(false);
                        $log.error(err);
                        toastr.error(err.error.code + ' ' + err.error.error);
                    });
            }

            $scope.session = SessionService;
            $scope.totalItems = 0;
            $scope.currentItem = null;

            getEvents();

            $scope.onAddClick = function () {
                $state.go('eventedit', {'eventId': '_new'});
            };

            $scope.onEditClick = function (event) {
                $state.go('eventedit', {'eventId': event.objectId});
            };

            $scope.onDeleteClick = function (event) {
                $scope.currentItem = event;
                modalInstance = $modal({
                    scope: $scope,
                    template: 'app/tmplVerify.html',
                    show: true,
                    title: 'Delete Event?',
                    content: 'You are about to delete event <em>' + event.eventname + '/' + event.placeName + '</em>'
                });
            };

            $scope.dlgVerifyCancel = function () {
                modalInstance.hide();
                toastr.warning('Delete cancelled');
            };

            $scope.dlgVerifyOK = function () {
                modalInstance.hide();
                $rootScope.busy(true);
                eventDataService.deleteItem($scope.currentItem)
                    .then(function (data) {
                        $log.info('Deleted Event');
                        toastr.success('Event deleted');
                        $scope.items = _.filter($scope.items, function (event) {
                            return event.objectId !== $scope.currentItem.objectId;
                        });
                        $rootScope.busy(false);
                    }, function (err) {
                        $rootScope.busy(false);
                        $log.error(err);
                        toastr.error(err.error.code + ' ' + err.error.error);

                    });
            };
        }]);
}(angular.module('app')));