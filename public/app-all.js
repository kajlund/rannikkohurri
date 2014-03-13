(function (angular) {
    'use strict';

    var app = angular.module('app', [
        // Angular modules
        'ngRoute'   // routing
    ]);

    // Configure Routes
    app.config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'app/home.html',
                controller: 'MainController'
            }).otherwise({ redirectTo: '/' });
    }]);

    app.run(['$rootScope', '$location',
        function($rootScope, $location) {
            console.log('App Loaded');
        }]);

}(angular));
(function (angular) {
    'use strict';

    angular.module('app').controller('MainController', ['$scope', '$rootScope', '$location', '$log',
        function ($scope, $rootScope, $location, $log) {

        }]);
}(angular));