(function (app) {
    'use strict';

    function BookEditController($routeParams, $location, $log, SessionService, bookDataService) {
        var vm = this;
        vm.session = SessionService;
        vm.bookId = $routeParams.bookId;
        vm.languages = ['swe', 'eng', 'fin' ];
        vm.genres = [ 'Biography', 'History', 'Kids', 'Misc', 'Novel', 'Science', 'Technology' ];

        vm.getReturnUrl = function() {
            return (vm.bookId === '_new') ?  '/books' : '/books/view/' + vm.bookId;
        };

        vm.save = function () {
            bookDataService.updateItem(vm.book)
                .then(function (res) {
                    // data.createdAt data.objectId
                    $log.info('Saved Book %o', res);
                    toastr.success('Book saved');
                    $location.url(vm.getReturnUrl());
                }, function (err) {
                    $log.error('Error saving Book %o', err);
                    toastr.error(err.error.code + ' ' + err.error.error);
                });
        };

        vm.cancel = function () {
            $log.info('Cancelled Edit');
            toastr.warning('Edit cancelled');
            $location.url(vm.getReturnUrl());
        };

        if (vm.bookId === '_new') {
            vm.book = {
                authors: "",
                genre: "",
                image: "",
                lang: "",
                subtitle: "",
                title: ""
            };
        } else {
            bookDataService.getItem(vm.bookId)
                .then(function (res) {
                    vm.book = res.data;
                }, function (err) {
                    $log.error(err);
                    toastr.error(err.error.code + ' ' + err.error.error);
                    $location.url(vm.getReturnUrl());
                });
        }
    }
    BookEditController.$inject = ['$routeParams', '$location', '$log', 'SessionService', 'bookDataService'];
    angular.module('app').controller('bookEditController', BookEditController);
}());