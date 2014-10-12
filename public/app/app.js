(function (angular) {
    'use strict';

    var app = angular.module('app', [
            // Angular modules
            'ngRoute',          // routing
            'ngAnimate',        // animate (for angular-strap)
            'infinite-scroll',
            'mgcrea.ngStrap',   // angular-strap library
            'ngGrid',
            'angular-loading-bar',
            'LocalStorageModule'
        ]);

    // Configure Routes
    app.config(['$routeProvider', '$locationProvider', '$httpProvider', '$modalProvider',
        function ($routeProvider, $locationProvider, $httpProvider, $modalProvider) {
            Parse.initialize("HZAMesseJ6CDe1K5dFLfxbGbMYD6aV3lBaEp3Ib1", "BxuS4AKpUCoP6Ea6pOn1O0PXlmPu5wYvvlSxLJVE");
            //$locationProvider.html5Mode(true);
            $httpProvider.defaults.headers.common['X-Parse-Application-Id'] = 'HZAMesseJ6CDe1K5dFLfxbGbMYD6aV3lBaEp3Ib1';
            $httpProvider.defaults.headers.common['X-Parse-REST-API-Key'] = 'LZqwu8VIutbaphzVoPW7yf4RxkKQAMbAapwubT5L';
            angular.extend($modalProvider.defaults, {
                animation: 'am-fade-and-scale',
                placement: 'center',
                html: true
            });

            $routeProvider.when('/', {
                templateUrl: 'app/home.html',
                controller: 'HomeController'
            }).when('/books', {
                templateUrl: 'app/books/list.html',
                controller: 'bookListController'
            }).when('/books/:bookId', {
                templateUrl: 'app/books/edit.html',
                controller: 'bookEditController'
            }).when('/movies', {
                templateUrl: 'app/movies/list.html',
                controller: 'movieListController'
            }).when('/movies/:movieId', {
                templateUrl: 'app/movies/edit.html',
                controller: 'movieEditController'
            }).when('/events', {
                templateUrl: 'app/events/list.html',
                controller: 'EventListController'
            }).when('/events/:eventId', {
                templateUrl: 'app/events/edit.html',
                controller: 'eventEditController'
            }).when('/cheats', {
                templateUrl: 'app/cheats/list.html',
                controller: 'cheatsListController'
            }).when('/cheats/:cacheId', {
                templateUrl: 'app/cheats/edit.html',
                controller: 'cheatsEditController'
            }).otherwise({ redirectTo: '/' });
        }]);

    app.run(['$log', '$window',
        function ($log, $window) {
            // Configure Toastr library
            $window.toastr.options.timeOut = 2000;
            $window.toastr.options.positionClass = 'toast-bottom-right';
            // Configure moment library
            //$window.moment.lang('sv');
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

}(angular));