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

}(angular));