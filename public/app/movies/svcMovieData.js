(function (app) {
    'use strict';

    app.service('movieDataService', ['$log', '$q', '$http', 'SessionService',
        function ($log, $q, $http, SessionService) {
            var baseUrl = 'https://api.parse.com/1/classes/Movie',

            pageSize = 100,
            getItem = function (aId) {
                var config = {
                    headers: {
                        'X-Parse-Session-Token': SessionService.sessionToken
                    },
                    isArray: false,
                    method: 'GET',
                    url: baseUrl + '/' + aId
                };
                return $http(config);
            },

            getItems = function () {
                var config = {
                    headers: {
                        'X-Parse-Session-Token': SessionService.sessionToken
                    },
                    isArray: false,
                    method: 'GET',
                    url: baseUrl + '?count=1&limit=1000&order=-seenAt'
                };
                return $http(config);
            },

            getPage = function (aOrder, aFilter, aPageNum) {
                var where = aFilter === '' ? '' : '&where={"' + aOrder + '":{"$gte":"' + aFilter + '"}}',
                    skip = (aPageNum - 1) * this.pageSize,
                    params = '?count=1&limit=' + this.pageSize + '&skip=' + skip + '&order=' + aOrder + where,
                    config = {
                        headers: {
                            'X-Parse-Session-Token': SessionService.sessionToken
                        },
                        isArray: false,
                        method: 'GET',
                        url: baseUrl + params
                    };

                return $http(config);
            },

            updateItem = function (obj) {
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
            },

            deleteItem = function (obj) {
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

            return {
                pageSize: pageSize,
                getItem: getItem,
                getItems: getItems,
                getPage: getPage,
                updateItem: updateItem,
                deleteItem: deleteItem
            };
        }]);
}(angular.module('app')));