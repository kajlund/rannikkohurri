(function (angular, Parse) {
    'use strict';

    Parse.initialize("HZAMesseJ6CDe1K5dFLfxbGbMYD6aV3lBaEp3Ib1",
        "BxuS4AKpUCoP6Ea6pOn1O0PXlmPu5wYvvlSxLJVE");

    angular.module('app').factory('EventDataService', ['$log', '$q', '$http', 'SessionService',
        function ($log, $q, $http, SessionService) {
            var baseUrl = 'https://api.parse.com/1/classes/Event',
                res = {},
                EventModel = Parse.Object.extend({
                    className: 'Event'
                });

            res.getEvent = function (aId) {
                var qry = new Parse.Query(EventModel);
                return qry.get(aId);
            };

            res.getEvents = function () {
                var qry = new Parse.Query(EventModel);
                //qry.equalTo("published", true);
                qry.descending("startTime");
                return qry.find();
            };

            res.updateEvent = function (event) {
                var isNew = event.id === undefined,
                    url = isNew ? baseUrl + '/' : baseUrl + '/' + event.id,
                    config = {
                        headers: {
                            'X-Parse-Session-Token': SessionService.sessionToken
                        },
                        method: isNew ? 'POST' : 'PUT',
                        url: url,
                        data: event
                    };

                return $http(config);
            };

            res.deleteEvent = function (event) {
                var url = baseUrl + '/' + event.id,
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
}(angular, Parse));