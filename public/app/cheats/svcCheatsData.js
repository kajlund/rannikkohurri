var angular = angular || null;

(function (angular) {
    'use strict';

    angular.module('app').factory('CheatsDataService', ['$log', '$q', '$http', 'SessionService',
        function ($log, $q, $http, SessionService) {
            var baseUrl = 'https://api.parse.com/1/classes/Cheat',
                res = {};

            res.getItem = function (aId) {
                var config = {
                        headers: {
                            'X-Parse-Session-Token': SessionService.sessionToken
                        },
                        isArray: false,
                        method: 'GET',
                        url: baseUrl + '/' + aId
                    };
                return $http(config);
            };

            res.getItems = function () {
                var config = {
                    headers: {
                        'X-Parse-Session-Token': SessionService.sessionToken
                    },
                    isArray: false,
                    method: 'GET',
                    url: baseUrl + '?count=1&limit=1000&order=name'
                };
                return $http(config);
            };

            res.updateItem = function (obj) {
                var isNew = obj.objectId === undefined,
                    url = isNew ? baseUrl + '/' : baseUrl + '/' + obj.objectId,
                    config = {
                        headers: {
                            'X-Parse-Session-Token': SessionService.sessionToken
                        },
                        method: isNew ? 'POST' : 'PUT',
                        url: url,
                        data: obj
                    };

                return $http(config);
            };

            res.deleteItem = function (obj) {
                var url = baseUrl + '/' + obj.objectId,
                    config = {
                        headers: {
                            'X-Parse-Session-Token': SessionService.sessionToken
                        },
                        method: 'DELETE',
                        url: url
                    };

                return $http(config);
            };

            return res;
        }]);
}(angular));