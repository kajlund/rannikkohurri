(function () {
    'use strict';

    angular
        .module('app')
        .controller('HomeController', HomeController);

    /* @ngInject */
    HomeController.$inject = ['$log'];

    function HomeController ($log) {
        $log.info('Activating HomeController');
    }
}());