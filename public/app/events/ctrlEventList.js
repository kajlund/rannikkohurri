(function (app) {
    'use strict';

    angular
        .module('app')
        .controller('EventListController', EventListController);

    /* @ngInject */
    EventListController.$inject = ['$location', '$log', '$modal',
        'sessionService', 'eventDataService', '_'];

    function EventListController ($location, $log, $modal,
                                  sessionService, eventDataService, _) {
        var vm = this,
            modalInstance = null;

        vm.currentItem = null;
        vm.dlgVerifyCancel = dlgVerifyCancel;
        vm.dlgVerifyOK = dlgVerifyOK;
        vm.events = [];
        vm.onAddClick = onAddClick;
        vm.onDeleteClick = onDeleteClick;
        vm.onEditClick = onEditClick;
        vm.session = sessionService;
        vm.totalItems = 0;

        activate();

    //////////////////////////////////////////////////////////////////////////

        function activate() {
            getEvents();
        }

        function dlgVerifyCancel () {
            modalInstance.hide();
            toastr.warning('Delete cancelled');
        }

        function dlgVerifyOK () {
            modalInstance.hide();
            eventDataService.deleteItem(vm.currentItem)
                .then(function (data) {
                    $log.info('Deleted Event');
                    toastr.success('Event deleted');
                    vm.events = _.filter(vm.events, function (event) {
                        return event.objectId !== vm.currentItem.objectId;
                    });
                }, function (err) {
                    $log.error(err);
                    toastr.error(err.error.code + ' ' + err.error.error);
                });
        }

        function getEvents() {
            eventDataService.getEvents()
                .then(function (res) {
                    vm.events = res.data.results;
                }, function (err) {
                    $log.error(err);
                    toastr.error(err.error.code + ' ' + err.error.error);
                });
        }

        function onAddClick () {
            $location.path('/events/_new');
        }

        function onDeleteClick (event) {
            vm.currentItem = event;
            modalInstance = $modal({
                scope: vm,
                template: 'app/tmplVerify.html',
                show: true,
                title: 'Delete Event?',
                content: 'You are about to delete event <em>' + event.eventName + '/' + event.placeName + '</em>'
            });
        }

        function onEditClick (event) {
            $location.path('/events/' + event.objectId);
        }
    }
}());