(function () {
    'use strict';

    angular.module('app', [
        // Angular modules
        'ngRoute',          // routing
        'ngAnimate',        // animate (for angular-strap)
        'infinite-scroll',
        'ngGrid',
        'angular-loading-bar',
        'LocalStorageModule',
        'ui.bootstrap'
    ]);

    angular.module('app').config(configApp);
    angular.module('app').config(configRoutes);
    angular.module('app').run(runApp);

    /* @ngInject */
    configApp.$inject = ['$httpProvider',  'localStorageServiceProvider', 'toastr', 'Parse'];

    function configApp ($httpProvider, localStorageServiceProvider, toastr, Parse) {
        Parse.initialize('HZAMesseJ6CDe1K5dFLfxbGbMYD6aV3lBaEp3Ib1', 'BxuS4AKpUCoP6Ea6pOn1O0PXlmPu5wYvvlSxLJVE');

        $httpProvider.defaults.headers.common['X-Parse-Application-Id'] = 'HZAMesseJ6CDe1K5dFLfxbGbMYD6aV3lBaEp3Ib1';
        $httpProvider.defaults.headers.common['X-Parse-REST-API-Key'] = 'LZqwu8VIutbaphzVoPW7yf4RxkKQAMbAapwubT5L';

        //$locationProvider.html5Mode(true);

        localStorageServiceProvider.setPrefix('Rannikk');

        // Configure Toastr
        toastr.options.timeOut = 4000;
        toastr.options.positionClass = 'toast-bottom-right';

    }

    /* @ngInject */
    configRoutes.$inject = ['$routeProvider'];

    function configRoutes ($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'app/home.html',
            controller: 'HomeController',
            controllerAs: 'vm'
        }).when('/books', {
            templateUrl: 'app/books/list.html',
            controller: 'BookListController',
            controllerAs: 'vm'
        }).when('/books/view/:bookId', {
            templateUrl: 'app/books/view.html',
            controller: 'BookViewController',
            controllerAs: 'vm'
        }).when('/books/edit/:bookId', {
            templateUrl: 'app/books/edit.html',
            controller: 'BookEditController',
            controllerAs: 'vm'
        }).when('/movies', {
            templateUrl: 'app/movies/list.html',
            controller: 'MovieListController',
            controllerAs: 'vm'
        }).when('/movies/view/:movieId', {
            templateUrl: 'app/movies/view.html',
            controller: 'MovieViewController',
            controllerAs: 'vm'
        }).when('/movies/edit/:movieId', {
            templateUrl: 'app/movies/edit.html',
            controller: 'MovieEditController',
            controllerAs: 'vm'
        }).when('/cheats', {
            templateUrl: 'app/cheats/list.html',
            controller: 'CheatListController',
            controllerAs: 'vm'
        }).when('/cheats/view/:cacheId', {
            templateUrl: 'app/cheats/view.html',
            controller: 'CheatViewController',
            controllerAs: 'vm'
        }).when('/cheats/edit/:cacheId', {
            templateUrl: 'app/cheats/edit.html',
            controller: 'CheatEditController',
            controllerAs: 'vm'
        }).when('/events', {
            templateUrl: 'app/events/list.html',
            controller: 'EventListController',
            controllerAs: 'vm'
        }).when('/events/:eventId', {
            templateUrl: 'app/events/edit.html',
            controller: 'EventEditController',
            controllerAs: 'vm'
        }).otherwise({ redirectTo: '/' });
    }


    /* @ngInject */
    runApp.$inject = ['$log'];

    function runApp ($log) {
        $log.info('App Loaded');
    }

    angular.module('app').directive('aDisabled', function ($compile) {
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
}());