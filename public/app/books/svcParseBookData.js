(function (app) {
    'use strict';

app.service('parseBookDataService', ['$log', '$q', 'SessionService',
    function ($log, $q, SessionService) {
        var BookObject = Parse.Object.extend('AudioBook'),



            getItem = function(aId) {
                var query = new Parse.Query(BookObject);
                query.get(aId, {
                    success: function (object) {
                        return object;
                    },
                    error: function (object, error) {
                        return error;
                    }
                });
            },

            queryByTitle = function(aKey) {
                var query = new Parse.Query(BookObject),
                    defer = $q.defer();
                query.startsWith("title", aKey);
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


        Parse.initialize("HZAMesseJ6CDe1K5dFLfxbGbMYD6aV3lBaEp3Ib1", "BxuS4AKpUCoP6Ea6pOn1O0PXlmPu5wYvvlSxLJVE");
        return {
            getItem: getItem,
            queryByTitle: queryByTitle
        }
    }]);
}(angular.module('app')));