(function (angular) {
    'use strict';

    angular.module('app').directive('spinner', ['$window', function ($window) {
        // Description:
        //  Creates a new Spinner and sets its options
        // Usage:
        //  <div data-spinner="scope.spinnerOptions"></div>
        return {
            link: function link(scope, element, attrs) {
                scope.spinner = null;
                scope.$watch(attrs.spinner, function (options) {
                    if (scope.spinner) {
                        scope.spinner.stop();
                    }
                    scope.spinner = new $window.Spinner(options);
                    scope.spinner.spin(element[0]);
                }, true);
            },
            restrict: 'A'
        };
    }]);
}(angular));