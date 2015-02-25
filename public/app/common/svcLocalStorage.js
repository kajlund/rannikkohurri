(function () {
    'use strict';

    angular
        .module('common')
        .factory('localStorageService', localStorageService);

    /* @ngInject */
    localStorageService.$inject = ['$window'];

    function localStorageService ($window) {
        var store = $window.localStorage;

        return {
            set: set,
            get: get,
            remove: remove
        };

        ////////////////////////////////////////////////////////////////////

        function set (key, value) {
            store.setItem(key, angular.toJson(value));
        }

        function get (key) {
            var value = store.getItem(key);
            if (value) {
                value = angular.fromJson(value);
            }
            return value;
        }

        function remove (key) {
            store.removeItem(key);
        }
    }
}());