(function (app) {
    'use strict';

    angular
        .module('app')
        .service('movieDataService', movieDataService);

    /* @ngInject */
    movieDataService.$inject = ['$http', 'sessionService' ];
    function movieDataService ($http, sessionService) {
        var baseUrl = 'https://api.parse.com/1/classes/Movie',
            pageSize = 100,
            service = {
                pageSize: pageSize,
                getItem: getItem,
                getItems: getItems,
                getPage: getPage,
                updateItem: updateItem,
                deleteItem: deleteItem
            };

        return service;

    /////////////////////////////////////////////////////////

        function getItem (aId) {
            return $http({
                headers: {
                    'X-Parse-Session-Token': sessionService.sessionToken
                },
                isArray: false,
                method: 'GET',
                url: baseUrl + '/' + aId
            });
        }

        function getItems () {
            return $http({
                headers: {
                    'X-Parse-Session-Token': sessionService.sessionToken
                },
                isArray: false,
                method: 'GET',
                url: baseUrl + '?count=1&limit=1000&order=-seenAt'
            });
        }

        function getPage (aOrder, aFilter, aPageNum) {
            var where = aFilter === '' ? '' : '&where={"' + aOrder + '":{"$gte":"' + aFilter + '"}}',
                skip = (aPageNum - 1) * service.pageSize,
                params = '?count=1&limit=' + service.pageSize + '&skip=' + skip + '&order=' + aOrder + where,
                config = {
                    headers: {
                        'X-Parse-Session-Token': sessionService.sessionToken
                    },
                    isArray: false,
                    method: 'GET',
                    url: baseUrl + params
                };

            return $http(config);
        }

        function updateItem (obj) {
            var isNew = obj.objectId === undefined,
                url = isNew ? baseUrl + '/' : baseUrl + '/' + obj.objectId;

            return $http({
                headers: {
                    'X-Parse-Session-Token': sessionService.sessionToken
                },
                method: isNew ? 'POST' : 'PUT',
                url: url,
                data: obj
            });
        }

        function deleteItem (objId) {
            return $http({
                headers: {
                    'X-Parse-Session-Token': sessionService.sessionToken
                },
                method: 'DELETE',
                url: baseUrl + '/' + objId
            });
        }
    }
}());