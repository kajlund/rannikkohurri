(function () {
    'use strict';

    angular
        .module('common')
        .factory('tokenInterceptor', tokenInterceptor);

    angular
        .module('common')
        .config(configTokenInterceptor);

    /* @ngInject */
    tokenInterceptor.$inject = [ '$q', 'sessionService' ];
    function tokenInterceptor ($q, sessionService) {
        return {
            request: request
        };

        ////////////////////////////////////////////////////////////////////

        function request (config) {
            if (sessionService.user.loggedOn) {
                config.headers['X-Parse-Session-Token'] = sessionService.user.token;
            }
            return $q.when(config);
        }
    }

    /* @ngInject */
    configTokenInterceptor.$inject = [ '$httpProvider' ];
    function configTokenInterceptor ($httpProvider) {
        $httpProvider.interceptors.push('tokenInterceptor');
    }
}());