(function (angular) {
    'use strict';

    var app = angular.module('app', [
        // Angular modules
        'ngRoute',   // routing
        'ngCookies'  // cookies
    ]);

    // Configure Routes
    app.config(['$routeProvider', '$httpProvider',
        function ($routeProvider, $httpProvider) {
        $httpProvider.defaults.headers.common['X-Parse-Application-Id'] = 'HZAMesseJ6CDe1K5dFLfxbGbMYD6aV3lBaEp3Ib1';
        $httpProvider.defaults.headers.common['X-Parse-REST-API-Key'] = 'LZqwu8VIutbaphzVoPW7yf4RxkKQAMbAapwubT5L';

        $routeProvider
            .when('/', {
                redirectTo: '/home'
            }).when('/home', {
                templateUrl: 'app/home.html',
                controller: 'MainController'
            }).when('/posts', {
                templateUrl: 'app/posts/posts.html',
                controller: 'PostsController'
            }).when('/links', {
                templateUrl: 'app/links/links.html',
                controller: 'LinksController'
            }).when('/about', {
                templateUrl: 'app/about.html',
                controller: 'AboutController'
            }).when('/books', {
                templateUrl: 'app/books/books.html',
                controller: 'BooksController'
            }).when('/movies', {
                templateUrl: 'app/movies/movies.html',
                controller: 'MoviesController'
            })
            .otherwise({ redirectTo: '/home' });
    }]);

    app.run(['$rootScope', '$location',
        function($rootScope, $location) {
            console.log('App Loaded');
        }]);

    app.directive('aDisabled', function ($compile) {
        return {
            restrict: 'A',
            priority: -99999,
            link: function (scope, element, attrs) {
                scope.$watch(attrs.aDisabled, function (val, oldval) {
                    if (!!val) {
                        element.unbind('click');
                    } else if (oldval) {
                        element.bind('click', function () {
                            scope.$apply(attrs.ngClick);
                        });
                    }
                });
            }
        };
    });

}(angular));