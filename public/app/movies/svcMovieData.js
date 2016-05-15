(function (app) {
    'use strict';

    angular
        .module('app')
        .service('movieDataService', movieDataService);

    /* @ngInject */
    movieDataService.$inject = ['$http', '$q', 'sessionService', 'Parse' ];
    function movieDataService ($http, $q, sessionService, Parse) {
        var baseUrl = 'https://api.parse.com/1/classes/Movie',
            currentPage = 1,
            fetching = false,
            MovieObject = Parse.Object.extend('Movie'),
            pageSize = 100,
            service = {
                currentFilterField: 'Date Seen',
                currentFilterValue: '',
                filterOptions: ['Original Title', 'Secondary Title', 'Date Seen', 'IMDB Rating'],
                getItem: getItem,
                getPage: getPage,
                movieList: [],
                setFilterField: setFilterField,
                setFilterValue: setFilterValue,
                totalItems: 0,
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

        function deleteItem (objId) {
            return $http({
                headers: {
                    'X-Parse-Session-Token': sessionService.sessionToken
                },
                method: 'DELETE',
                url: baseUrl + '/' + objId
            });
        }

        function fetchNextPage () {
            var query = new Parse.Query(MovieObject),
                defer = $q.defer();

            if (fetching) {
                return defer.reject('Fetching');
            }

            fetching = true;
            currentPage++;

            query.skip((aPageNum - 1) * pageSize);

            switch (service.currentFilterField) {
                case 'Date Seen': {
                    query.descending('seenAt');
                }
            }

            if (service.currentFilterValue) {

            }

            query.find({
                success: function (results) {
                    fetching = false;
                    defer.resolve(results);
                },
                error: function (error) {
                    fetching = false;
                    defer.reject(error);
                }
            });
        }

        function resetData () {
            service.movieList = [];
            currentPage = 1;
            fetchNextPage();
        }

        function setFilterField (aFilterField) {
            if (aFilterField !== service.currentFilterField) {
                service.currentFilterField = aFilterField;
                service.currentFilterValue = '';
                resetData();
            }
        }

        function setFilterValue (aFilterValue) {
            if (aFilterValue !== service.currentFilterValue) {
                service.currentFilterValue = aFilterValue;
                resetData();
            }
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
    }
}());