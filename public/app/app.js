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
                redirectTo: '/home'
            }).when('/home', {
                templateUrl: 'app/home.html',
                controller: 'MainController'
            }).when('/about', {
                templateUrl: 'app/about.html',
                controller: 'AboutController'
            })
            .otherwise({ redirectTo: '/home' });
    }]);

    app.run(['$rootScope', '$location',
        function($rootScope, $location) {
            console.log('App Loaded');
        }]);

}(angular));