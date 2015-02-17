(function () {
    'use strict';

    angular
        .module('app')
        .factory('cheatDataService', cheatDataService);

    /* @ngInject */
    cheatDataService.$inject = ['$log', '$q', '$http', 'sessionService'];

    function cheatDataService($log, $q, $http, sessionService) {
        var baseUrl = 'https://api.parse.com/1/classes/Cheat',
            service = {
                deleteItem: deleteItem,
                getItem: getItem,
                getItems: getItems,
                municipalities: [],
                updateItem: updateItem
            };

        return service;

    //////////////////////////////////////////////////////////////////////////

        function deleteItem (aId) {
            var url = baseUrl + '/' + aId,
                config = {
                    headers: {
                        'X-Parse-Session-Token': sessionService.sessionToken
                    },
                    method: 'DELETE',
                    url: url
                };

            return $http(config);
        }

        function getItem (aId) {
            var config = {
                    headers: {
                        'X-Parse-Session-Token': sessionService.sessionToken
                    },
                    isArray: false,
                    method: 'GET',
                    url: baseUrl + '/' + aId
                };
            return $http(config);
        }

        function getItems () {
            var config = {
                headers: {
                    'X-Parse-Session-Token': sessionService.sessionToken
                },
                isArray: false,
                method: 'GET',
                url: baseUrl + '?count=1&limit=1000&order=-updatedAt'
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