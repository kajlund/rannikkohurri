(function (app) {
    'use strict';

    angular
        .module('app')
        .controller('BookEditController', BookEditController);

    /* @ngInject */
    BookEditController.$inject = ['$routeParams', '$location', '$log', 'sessionService', 'bookDataService', 'toastr'];

    function BookEditController($routeParams, $location, $log, sessionService, bookDataService, toastr) {
        var vm = this;

        vm.cancel = cancel;
        vm.session = sessionService;
        vm.bookId = $routeParams.bookId;
        vm.languages = ['swe', 'eng', 'fin' ];
        vm.genres = [ 'Biography', 'History', 'Kids', 'Misc', 'Novel', 'Science', 'Technology' ];
        vm.getReturnUrl = getReturnUrl;
        vm.save = save;

        activate();

    ///////////////////////////////////////////////////////////////////////////////////

        function activate () {
            if (vm.bookId === '_new') {
                vm.book = {
                    authors: '',
                    genre: '',
                    image: '',
                    lang: '',
                    subtitle: '',
                    title: ''
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

        function getReturnUrl () {
            return (vm.bookId === '_new') ?  '/books' : '/books/view/' + vm.bookId;
        }

        function save () {
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
        }

        function cancel () {
            $log.info('Cancelled Edit');
            toastr.warning('Edit cancelled');
            $location.url(vm.getReturnUrl());
        }
    }
}());