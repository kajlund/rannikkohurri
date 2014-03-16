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
(function (angular) {
    'use strict';

    angular.module('app').controller('AboutController', ['$scope', '$rootScope', '$location', '$log',
        function ($scope, $rootScope, $location, $log) {

        }]);
}(angular));
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