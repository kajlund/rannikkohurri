var angular = angular || null,
    toastr = toastr || null,
    Spinner = Spinner || null,
    moment = moment || null;

(function (angular, toastr, Spinner, moment) {
    'use strict';

    // Spinner Configuration
    var opts = {
        radius: 40,
        lines: 7,
        length: 0,
        width: 30,
        speed: 1.7,
        corners: 1,
        trail: 100,
        top: 250
    };

    moment.lang('sv');

    // Configure Toastr
    toastr.options.timeOut = 2000;
    toastr.options.positionClass = 'toast-bottom-right';


    var app = angular.module('app', [
        // Angular modules
        'ngRoute',      // routing
        'ngCookies',    // cookies
        'ui.bootstrap', // ui-bootstrap library
        'hc.marked'     // markdown directive
    ]);

    // Configure Routes
    app.config(['$routeProvider', '$httpProvider', 'marked',
        function ($routeProvider, $httpProvider, marked) {
            $httpProvider.defaults.headers.common['X-Parse-Application-Id'] = 'HZAMesseJ6CDe1K5dFLfxbGbMYD6aV3lBaEp3Ib1';
            $httpProvider.defaults.headers.common['X-Parse-REST-API-Key'] = 'LZqwu8VIutbaphzVoPW7yf4RxkKQAMbAapwubT5L';
            marked.setOptions({gfm: true});

            $routeProvider
                .when('/', {
                    redirectTo: '/home'
                }).when('/home', {
                    templateUrl: 'app/home.html',
                    controller: 'MainController'
                }).when('/posts', {
                    templateUrl: 'app/posts/posts.html',
                    controller: 'PostsController'
                }).when('/posts/:id', {
                    templateUrl: 'app/posts/post.html',
                    controller: 'PostController'
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
                }).when('/events', {
                    templateUrl: 'app/events/list.html',
                    controller: 'EventListController'
                })
                .otherwise({ redirectTo: '/home' });
        }]);

    app.run(['$rootScope', '$location', '$log',
        function ($rootScope, $location, $log) {
            $rootScope.spinner = new Spinner(opts).spin(window.document.documentElement);;
            $log.info('App Loaded');
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

}(angular, toastr, Spinner, moment));