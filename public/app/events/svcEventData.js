(function (angular, Parse) {
    'use strict';

    Parse.initialize("HZAMesseJ6CDe1K5dFLfxbGbMYD6aV3lBaEp3Ib1",
        "BxuS4AKpUCoP6Ea6pOn1O0PXlmPu5wYvvlSxLJVE");

    angular.module('app').factory('OrDataService', ['$log', '$q',
        function ($log, $q) {
            var res = {},
                OrModel = Parse.Object.extend({
                    className: 'Event'
                });

            res.getEvent = function (aId) {
                var qry = new Parse.Query(OrModel);
                return qry.get(aId);
            };

            res.getEvents = function () {
                var qry = new Parse.Query(OrModel);
                //qry.equalTo("published", true);
                qry.descending("startDate");
                return qry.find();
            };

            return res;
        }]);
}(angular, Parse));