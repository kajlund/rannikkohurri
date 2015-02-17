(function (app) {
    'use strict';

    angular
        .module('app')
        .factory('eventDataService', eventDataService);

    /* @ngInject */
    eventDataService.$inject = ['$log', '$q', '$http', 'sessionService'];

    function eventDataService ($log, $q, $http, sessionService) {
        var baseUrl = 'https://api.parse.com/1/classes/Event',
            service = {
                deleteItem: deleteItem,
                getEvent: getEvent,
                getEvents: getEvents,
                updateItem: updateItem

            };

        return service;

    ///////////////////////////////////////////////////////////////////////////

        function deleteItem (obj) {
            var url = baseUrl + '/' + obj.objectId,
                config = {
                    headers: {
                        'X-Parse-Session-Token': sessionService.sessionToken
                    },
                    method: 'DELETE',
                    url: url
                };

            return $http(config);
        }

        function getEvent (aId) {
            var config = {
                    isArray: false,
                    method: 'GET',
                    url: baseUrl + '/' + aId
                };
            return $http(config);
        }

        function getEvents () {
            var config = {
                isArray: false,
                method: 'GET',
                url: baseUrl + '?count=1&limit=1000&order=starts'
            };
            return $http(config);
        }

        function updateItem (obj) {
            var isNew = obj.objectId === undefined,
                url = isNew ? baseUrl + '/' : baseUrl + '/' + obj.objectId,
                config = {
                    headers: {
                        'X-Parse-Session-Token': sessionService.sessionToken
                    },
                    method: isNew ? 'POST' : 'PUT',
                    url: url,
                    data: obj
                };

            return $http(config);
        }
    }
}());