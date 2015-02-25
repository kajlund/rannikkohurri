(function () {
    'use strict';

    angular
        .module('common')
        .factory('loginRedirectInterceptor', loginRedirectInterceptor);

    angular
        .module('common')
        .config(configLoginRedirect);

    /* @ngInject */
    loginRedirectInterceptor.$inject = [ '$q', '$location' ];

    function loginRedirectInterceptor ($q, $location) {
        var lastPath = '/';

        return {
            responseError: responseError,
            redirectPostLogin: redirectPostLogin
        };

        ////////////////////////////////////////////////////////////////////

        function responseError (response) {
            if (response.status === 403) {
                lastPath = $location.path();
                $location.path('/logon');
            }
            return $q.reject(response);
        }

        function redirectPostLogin () {
            $location.path(lastPath);
            lastPath = '/';
        }
    }

    /* @ngInject */
    configLoginRedirect.$inject = [ '$httpProvider' ];
    function configLoginRedirect ($httpProvider) {
        $httpProvider.interceptors.push('loginRedirectInterceptor');
    }
}());