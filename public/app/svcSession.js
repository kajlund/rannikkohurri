(function (angular) {
    'use strict';

    angular.module('app').factory('SessionService', function ($rootScope, $http, $cookieStore, $log, $q) {
        var res = {};
        res.sessionToken = '';
        res.userObj = null;

        function setSession(data) {
            res.userObj = data;
            res.sessionToken = data.sessionToken;
            $cookieStore.put('ParseUser', data);

        }
        function clearSession() {
            res.userObj = null;
            res.sessionToken = '';
            $cookieStore.remove('ParseUser');
        }

        res.autoSignon = function () {
            var user = $cookieStore.get('ParseUser'),
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
                    .success(function(data, status, headers, config) {
                        $log.info('autoSignon success, data = %o', data);
                        setSession(data);
                        d.resolve(data);
                    })
                    .error(function(data, status, headers, config) {
                        d.reject(data.error);
                    });
            } else {
                d.reject('Invalid Cookie');
            }
            return d.promise;
        };

        res.loggedOn = function () {
            return res.userObj !== null;
        };

        res.signon = function (aUsr, aPwd) {
            var params = '?username=' + aUsr + '&password=' + aPwd,
                config = {
                    method: 'GET',
                    url: ' https://api.parse.com/1/login' + params
                },
                d = $q.defer();

            $http(config)
                .success(function (data, status, headers, config) {
                    setSession(data);
                    d.resolve(data);
                }).error(function (data, status, headers, config) {
                    clearSession();
                    d.reject(data.error);
                });
            return d.promise();
        };

        return res;
    });
}(angular));