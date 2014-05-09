var angular = angular || null;

(function (app) {
    'use strict';

    app.factory('PostDataService', ['$log', '$q', '$http', 'SessionService',
        function ($log, $q, $http, SessionService) {
            var baseUrl = 'https://api.parse.com/1/classes/Post',
                res = {};

            res.getPost = function (aId) {
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

            res.getPosts = function () {
                var config = {
                    headers: {
                        'X-Parse-Session-Token': SessionService.sessionToken
                    },
                    isArray: false,
                    method: 'GET',
                    url: baseUrl + '?where={"published":true}&count=1&limit=1000&order=-publishDate'
                };
                return $http(config);
            };

            res.deletePost = function (post) {
                var config = {
                        headers: {
                            'X-Parse-Session-Token': SessionService.sessionToken
                        },
                        method: 'DELETE',
                        url: baseUrl + '/' + post.objectId
                    };
                return $http(config);
            };

            return res;
        }]);
}(angular.module('app')));