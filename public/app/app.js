var angular = angular || null;

(function (angular) {
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
            color: '#333',
            zIndex: 2e9,
            left: 'auto',
            top: '200px'
        },
        app = angular.module('app', [
            // Angular modules
            'ui.router',     // state-based UI routing
            'ngAnimate',     // animate (for angular-strap)
            'ngCookies',     // cookies
            'infinite-scroll',
            'mgcrea.ngStrap' // angular-strap library
        ]);

    // Configure Routes
    app.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', '$modalProvider',
        function ($stateProvider, $urlRouterProvider, $httpProvider, $modalProvider) {
            $httpProvider.defaults.headers.common['X-Parse-Application-Id'] = 'HZAMesseJ6CDe1K5dFLfxbGbMYD6aV3lBaEp3Ib1';
            $httpProvider.defaults.headers.common['X-Parse-REST-API-Key'] = 'LZqwu8VIutbaphzVoPW7yf4RxkKQAMbAapwubT5L';
            angular.extend($modalProvider.defaults, {
                animation: 'am-fade-and-scale',
                placement: 'center',
                html: true
            });

            $urlRouterProvider.when("/posts", "/posts/list");
            $urlRouterProvider.otherwise('home');

            $stateProvider
                .state('home', {
                    url: '/home',
                    templateUrl: 'app/home.html',
                    controller: 'HomeController'
                }).state('posts', {
                    abstract: true,
                    url: '/posts',
                    templateUrl: 'app/posts/posts.html'
                }).state('posts.list', {
                    url: '/list',
                    templateUrl: 'app/posts/list.html',
                    controller: 'postListController'
                }).state('posts.detail', {
                    url: '/:id',
                    templateUrl: 'app/posts/detail.html',
                    controller: 'PostDetailController'
                }).state('links', {
                    url: '/links',
                    templateUrl: 'app/links/links.html',
                    controller: 'LinksController'
                }).state('about', {
                    url: '/about',
                    templateUrl: 'app/about.html',
                    controller: 'AboutController'
                }).state('books', {
                    url: '/books',
                    templateUrl: 'app/books/list.html',
                    controller: 'bookListController'
                }).state('bookedit', {
                    url: '/books:bookId',
                    templateUrl: 'app/books/edit.html',
                    controller: 'bookEditController'
                }).state('movies', {
                    url: '/movies',
                    templateUrl: 'app/movies/list.html',
                    controller: 'movieListController'
                }).state('movieedit', {
                    url: '/movies:movieId',
                    templateUrl: 'app/movies/edit.html',
                    controller: 'movieEditController'
                }).state('events', {
                    url: '/events',
                    templateUrl: 'app/events/list.html',
                    controller: 'EventListController'
                }).state('eventedit', {
                    url: '/events:eventId',
                    templateUrl: 'app/events/edit.html',
                    controller: 'eventEditController'
                }).state('cheats', {
                    url: '/cheats',
                    templateUrl: 'app/cheats/list.html',
                    controller: 'cheatsListController'
                }).state('cheatsedit', {
                    url: '/cheats/:cacheId',
                    templateUrl: 'app/cheats/edit.html',
                    controller: 'cheatsEditController'
                });
        }]);

    app.run(['$rootScope', '$state', '$stateParams', '$log', '$window',
        function ($rootScope, $state, $stateParams, $log, $window) {

            $rootScope.busy = function (isBusy) {
                if (isBusy) {
                    if (!$rootScope.spinner) {
                        $rootScope.spinner = new $window.Spinner(spinnerOpts);
                    }
                    $rootScope.spinner.spin($window.document.documentElement);
                } else {
                    if ($rootScope.spinner) {
                        $rootScope.spinner.stop();
                    }
                }
            };
            // Configure Toastr library
            $window.toastr.options.timeOut = 2000;
            $window.toastr.options.positionClass = 'toast-bottom-right';
            // Configure marked library
            $window.marked.setOptions({gfm: true});
            // Configure moment library
            //$window.moment.lang('sv');
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
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