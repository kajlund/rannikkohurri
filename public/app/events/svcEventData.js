(function (angular, Parse) {
    'use strict';

    Parse.initialize("HZAMesseJ6CDe1K5dFLfxbGbMYD6aV3lBaEp3Ib1",
        "BxuS4AKpUCoP6Ea6pOn1O0PXlmPu5wYvvlSxLJVE");

    angular.module('app').factory('EventDataService', ['$log', '$q', '$http', 'SessionService',
        function ($log, $q, $http, SessionService) {
            var res = {};

            res.EventModel = Parse.Object.extend({className: 'Event'});

            res.getEvent = function (aId) {
                var qry = new Parse.Query(EventModel);
                return qry.get(aId);
            };

            res.getEvents = function () {
                var qry = new Parse.Query(res.EventModel);
                //qry.equalTo("published", true);
                qry.ascending("startTime");
                return qry.find();
            };

            return res;
        }]);
}(angular, Parse));