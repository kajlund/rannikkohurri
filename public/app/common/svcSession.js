(function () {
    'use strict';

    angular
        .module('app')
        .factory('sessionService', sessionService);

    /* @ngInject */
    sessionService.$inject = ['$http', '$log', '$q', 'Parse', 'localStorageService'];

    function sessionService ($http, $log, $q, Parse, localStorageService) {
        var service = {
            autoSignon: autoSignon,
            loggedOn: false,
            sessionToken: '',
            signoff: signoff,
            signon: signon,
            userObj: null
        };

        return service;

        ////////////////////////////////////////////////////////////////////

        function setSession(data) {
            service.userObj = data;
            service.loggedOn = true;
            service.sessionToken = data.sessionToken;
            localStorageService.set('ParseUser', data);
            Parse.User.become(data.sessionToken).then(function (user) {
                // The current user is now set to user.
                $log.info('*** Parse user set to %o', user);
            }, function (error) {
                $log.error('The Parse user could not be set');
            });
        }

        function clearSession() {
            service.loggedOn = false;
            service.userObj = null;
            service.sessionToken = '';
            localStorageService.remove('ParseUser');
            Parse.User.logOut();
        }

        function autoSignon() {
            var user = localStorageService.get('ParseUser'),
                config = {
                    headers: {
                        'X-Parse-Application-Id': 'HZAMesseJ6CDe1K5dFLfxbGbMYD6aV3lBaEp3Ib1',
                        'X-Parse-REST-API-Key': 'LZqwu8VIutbaphzVoPW7yf4RxkKQAMbAapwubT5L',
                        'X-Parse-Session-Token': user ? user.sessionToken : ''
                    },
                    method: 'GET',
                    url: 'https://api.parse.com/1/users/me'
                },
                d = $q.defer();

            if (user && user.sessionToken.length > 10) {
                $http(config)
                    .success(function (data, status, headers, config) {
                        $log.info('autoSignon success, data = %o', data);
                        setSession(data);
                        d.resolve(data);
                    })
                    .error(function (data, status, headers, config) {
                        d.reject(data.error);
                    });
            } else {
                d.reject('Invalid Cookie');
            }
            return d.promise;
        }

        function signoff() {
            clearSession();
        }

        function signon(aUsr, aPwd) {
            var params = '?username=' + aUsr + '&password=' + aPwd,
                config = {
                    method: 'GET',
                    url: ' https://api.parse.com/1/login' + params
                };

            return $http(config)
                .then(function (response) {
                    if (typeof response.data === 'object') {
                        setSession(response.data);
                        return response.data;
                    } else {
                        clearSession();
                        return $q.reject(response.data);
                    }
                }, function (response) {
                    // something went wrong
                    clearSession();
                    return $q.reject(response.data);
                });
        }
    }
}());