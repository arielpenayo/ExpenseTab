(function(){
    'use strict';

    angular
        .module('app')
        .controller('registerCtrl', registerCtrl)

    registerCtrl.$inject = ['$location','$auth','$rootScope','$state','toastr'];

    function registerCtrl($location, $auth, $rootScope,$state,toastr) {
        
        var vm = this;
        vm.userFields = [
            {
                key: 'login',
                type: 'input',
                templateOptions: {
                    label: '',
                    placeholder: 'Usuario',
                    required: true
                }
            },
            {
                key: 'email',
                type: 'input',
                templateOptions: {
                    type: 'email',
                    label: '',
                    placeholder: 'Correo',
                    required: true
                }
            },
            {
                key: 'password',
                type: 'input',
                templateOptions: {
                    type: 'password',
                    label: '',
                    placeholder: 'Contraseña',
                    required: true
                }
            },
            {
                key: 'password2',
                type: 'input',
                templateOptions: {
                    type: 'password',
                    label: '',
                    placeholder: 'Contraseña',
                    required: true
                }
            }

        ];

        activate()
        // vm.esAdmin = false;
        function activate () {
            vm.esAdmin = true;
            return false
            if ($auth.getPayload()?.appuserNivel == undefined) {
                vm.esAdmin = false
            }
             vm.esAdmin = ($auth.getPayload().appuserNivel == 1 ? true : false)
        }
    }
})();