(function (angular) {
    'use strict';

    angular.module('app').controller('MainController', ['$scope', '$rootScope', '$location', '$log',
        function ($scope, $rootScope, $location, $log) {

            $scope.getClass = function(path) {
                if ($location.path().substr(0, path.length) == path) {
                    return "active"
                } else {
                    return ""
                }
            }
        }]);
}(angular));