var angular = angular || null,
    toastr = toastr || null,
    Spinner = Spinner || null,
    moment = moment || null;

(function (angular, toastr, Spinner, moment) {
    'use strict';

    // Spinner Configuration
    var spinnerOpts = {
        radius: 40,
        lines: 7,
        length: 0,
        width: 30,
        speed: 1.7,
        corners: 1,
        trail: 100,
        color: '#D00062',
        zIndex: 2e9,
        left: 'auto',
        top: '200px'
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
                    controller: 'HomeController'
                }).when('/posts', {
                    templateUrl: 'app/posts/posts.html',
                    controller: 'PostListController'
                }).when('/posts/:id', {
                    templateUrl: 'app/posts/post.html',
                    controller: 'PostDetailController'
                }).when('/links', {
                    templateUrl: 'app/links/links.html',
                    controller: 'LinksController'
                }).when('/about', {
                    templateUrl: 'app/about.html',
                    controller: 'AboutController'
                }).when('/books', {
                    templateUrl: 'app/books/list.html',
                    controller: 'BookListController'
                }).when('/movies', {
                    templateUrl: 'app/movies/movies.html',
                    controller: 'MoviesController'
                }).when('/events', {
                    templateUrl: 'app/events/list.html',
                    controller: 'EventListController'
                }).when('/cheats', {
                    templateUrl: 'app/cheats/list.html',
                    controller: 'CheatsListController'
                })
                .otherwise({ redirectTo: '/home' });
        }]);

    app.run(['$rootScope', '$location', '$log',
        function ($rootScope, $location, $log) {
            $rootScope.spinner = new Spinner(spinnerOpts).spin(window.document.documentElement);
            $rootScope.spinner.spin();
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