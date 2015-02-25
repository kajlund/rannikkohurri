(function () {
    'use strict';

    var Parse = Parse || null;

    angular
        .module('common', []);

    angular
        .module('common')
        .constant('Parse', Parse);
}());