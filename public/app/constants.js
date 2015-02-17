(function () {
    'use strict';
    var Parse = window.Parse || null,
        _ = window._ || null;

    angular
        .module('app')
        .constant('Parse', Parse);

    angular
        .module('app')
        .constant('_', _);

    angular
        .module('app')
        .constant('toastr', toastr);
}());