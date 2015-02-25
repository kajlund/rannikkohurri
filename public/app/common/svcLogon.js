(function () {
    'use strict';

    angular
        .module('app')
        .factory('logonService', logonService);

    /* @ngInject */
    logonService.$inject = [ '$http', '$q', 'sessionService' ];

    function logonService ($http, $q, sessionService) {
        return {
                    logOn: logOn,
                    logOff: logOff
                };

        ////////////////////////////////////////////////////////////////////


        function logOn (aUsr, aPwd) {
            var params = '?username=' + aUsr + '&password=' + aPwd,
                config = {
                    method: 'GET',
                    url: ' https://api.parse.com/1/login' + params
                };

            return $http(config)
                .then(function (response) {
                    if (typeof response.data === 'object') {
                        sessionService.setSession(response.data);
                        return response.data;
                    } else {
                        sessionService.clearSession();
                        return $q.reject(response.data);
                    }
                }, function (response) {
                    // something went wrong
                    sessionService.clearSession();
                    return $q.reject(response.data);
                });
        }

        function logOff () {
            sessionService.clearSession();
        }
    }
}());