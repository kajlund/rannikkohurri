(function () {
    'use strict';

    angular
        .module('common')
        .factory('sessionService', sessionService);

    /* @ngInject */
    sessionService.$inject = [ '$log', 'Parse', 'localStorageService' ];

    function sessionService ($log, Parse, localStorageService) {
        var USERKEY = 'ParseUser',
            initialUser = initialize(),
            service = {
                setSession: setSession,
                clearSession: clearSession,
                user: initialUser
            };

        return service;

        ////////////////////////////////////////////////////////////////////

        function initialize () {
            var localUser,
                user = {
                    objectId: '',
                    email: '',
                    token: '',
                    username: '',
                    get loggedOn() {
                        return this.token;
                    }
                };
            localUser = localStorageService.get(USERKEY);
            if (localUser) {
                user.objectId = localUser.objectId;
                user.email = localUser.email;
                user.token = localUser.token;
                user.username = localUser.username;
            }
            return user;
        }

        function setSession (userObj) {
            service.user.objectId = userObj.objectId;
            service.user.email = userObj.email;
            service.user.token = userObj.sessionToken;
            service.user.username = userObj.username;
            localStorageService.set(USERKEY, service.user);
            Parse.User.become(service.user.token).then(function (user) {
                // The current user is now set to user.
                $log.info('*** Parse user set to %o', user);
            }, function (error) {
                $log.error('The Parse user could not be set %o', error);
            });
        }

        function clearSession () {
            localStorageService.remove(USERKEY);
            service.user.objectId = '';
            service.user.email = '';
            service.user.token = '';
            service.user.username = '';
            Parse.User.logOut();
        }
    }
}());