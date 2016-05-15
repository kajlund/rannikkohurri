(function () {
    'use strict';

    angular
        .module('app')
        .factory('bookDataService', bookDataService);

    /* @ngInject */
    bookDataService.$inject = ['$http', '$q', 'sessionService', 'Parse'];

    function bookDataService($http, $q, sessionService, Parse) {
        var bookDataservice = {},
            baseUrl = 'https://api.parse.com/1/classes/AudioBook',
            BookObject = Parse.Object.extend('AudioBook'),
            pageSize = 100;

        bookDataservice.getItem = function (aId) {
            var config = {
                headers: {
                    'X-Parse-Session-Token': sessionService.sessionToken
                },
                isArray: false,
                method: 'GET',
                url: baseUrl + '/' + aId
            };
            return $http(config);
        };

        bookDataservice.getItems = function () {
            var config = {
                headers: {
                    'X-Parse-Session-Token': sessionService.sessionToken
                },
                isArray: false,
                method: 'GET',
                url: baseUrl + '?count=1&limit=1000&order=title'
            };
            return $http(config);
        };

        bookDataservice.getPage = function (aPageNum) {
            var query = new Parse.Query(BookObject),
                defer = $q.defer();
            query.descending('createdAt');
            query.skip((aPageNum - 1) * pageSize);

            query.find({
                success: function (results) {
                    defer.resolve(results);
                },
                error: function (error) {
                    defer.reject(error);
                }
            });

            return defer.promise;
        };

        bookDataservice.queryData = function (aQueryField, aQueryValue) {
            var query = new Parse.Query(BookObject),
                defer = $q.defer();

            query.startsWith(aQueryField, aQueryValue);
            query.descending('createdAt');

            query.find({
                success: function (results) {
                    defer.resolve(results);
                },
                error: function (error) {
                    defer.reject(error);
                }
            });
            return defer.promise;
        };

        bookDataservice.updateItem = function (obj) {
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
        };

        bookDataservice.deleteItem = function (objId) {
            var url = baseUrl + '/' + objId,
                config = {
                    headers: {
                        'X-Parse-Session-Token': sessionService.sessionToken
                    },
                    method: 'DELETE',
                    url: url
                };
            return $http(config);
        };

        return bookDataservice;
    }
}());