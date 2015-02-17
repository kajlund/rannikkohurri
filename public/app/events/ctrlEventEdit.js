(function () {
    'use strict';

    angular
        .module('app')
        .controller('EventEditController', EventEditController);

    /* @ngInject */
    EventEditController.$inject = ['$routeParams', '$location', '$log', 'sessionService', 'eventDataService'];

    function EventEditController ($routeParams, $location, $log, sessionService, eventDataService) {
        var vm = this;

        vm.cancel = doCancel;
        vm.event = null;
        vm.eventId = $routeParams.eventId;
        vm.save = doSave;
        vm.session = sessionService;

        activate();

        function activate() {
            if (vm.eventId === '_new') {
                vm.event = {
                    starts: '',
                    eventName: '',
                    placeName: '',
                    organizer: '',
                    organizerUrl: '',
                    smartum: false
                };
            } else {
                eventDataService.getEvent(vm.eventId)
                    .then(function (res) {
                        vm.event = res.data;
                    }, function (err) {
                        $log.error(err);
                        toastr.error(err.error.code + ' ' + err.error.error);
                        $location.url('/events');
                    });
            }
        }

        function doCancel () {
            $log.info('Cancelled Edit');
            toastr.warning('Edit cancelled');
            $location.url('/events');
        }

        function doSave () {
            eventDataService.updateItem(vm.event)
                .then(function (res) {
                    // data.createdAt data.objectId
                    $log.info('Saved Event %o', res);
                    toastr.success('Event saved');
                    $location.url('/events');
                }, function (err) {
                    $log.error('Error saving Event %o', err);
                    toastr.error(err.error.code + ' ' + err.error.error);
                    $location.url('/events');
                });
        }
    }
}());