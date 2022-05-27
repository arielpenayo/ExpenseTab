(function() {
    'use strict';

    angular
        .module('app')
        .controller('activarCtrl', activarCtrl)
    

    activarCtrl.$inject = ['dataService', '$state', '$stateParams', 'toastr', '$scope', '$filter', 'md5'];

    function activarCtrl(dataService, $state, $stateParams, toastr, $scope, $filter, md5) {

        var vm = this;
       
        vm.appuser = {};
        vm.appuserEmail = $stateParams.appuserEmail;
        vm.appuserHash = $stateParams.appuserHash;

        vm.habilitado = false;
        vm.restablecer = false;
        vm.sinAcceso = false;
        vm.dataSaving = false;

        vm.appuserHashValidez;
    
        vm.fechaActual = new Date().toJSON().slice(0, 19).replace('T', ' ')
       
        vm.appuserFields = [{
            className: 'row',
            fieldGroup: [
                {
                    className: 'col-md-4',
                    key: 'usuarioContrasenha',
                    type: 'input',
                    templateOptions: {
                        type: 'password',
                        label: 'Contraseña',
                        placeholder: 'Contraseña',
                        required: true,
                        minlength: 4
                    }
                },
                {
                    className: 'col-md-4',
                    key: 'usuarioContrasenha2',
                    type: 'input',
                    templateOptions: {
                        type: 'password',
                        label: 'Confirmar Contraseña',
                        placeholder: 'Confirmar Contraseña',
                        required: true,
                        minlength: 4
                    }
                }
            ]
        }];


        
       
        let datos = {
            usuarioContrasenha: vm.appuserHash

        }

        // console.log('datos: ', datos);

        // Valida hash (URL)
        dataService.findAllByFilter("usuario-filter", datos)
            .then(function(result) {

                //console.log(result);

                if(result.data.length){

                    //console.log(result.data);

                    vm.habilitado = true;
                    vm.appuser = result.data[0];


                    vm.restablecer = true;


                   //console.log('este vm.appuser: ', vm.appuser);
                    
                }else{
                    console.log("No hay datos");
                }
            })

            vm.verificarContrasena = function(appuser){
            
                if(appuser.usuarioContrasenha == appuser.usuarioContrasenha2){
                    return true;
                }else{
                    return false;
                }

            }
       
            // Actualiza usuario con nueva contraseña
            vm.guardarDatos = function(appuser){

                vm.dataSaving = true;

                let datos = angular.copy(appuser);

                    if(datos.usuarioContrasenha2 != null){
                        delete datos.usuarioContrasenha2;
                    }
    
                    
                    var hash = md5.createHash(appuser.usuarioContrasenha);
                    datos.usuarioContrasenha = hash;

                    var enviarDatos = {
                        usuarioContrasenha: datos.usuarioContrasenha
                    }
                    
                   // console.log("activar -> enviarDatos: ", enviarDatos);
                    
                    dataService.update('usuario', datos.usuarioId, enviarDatos)
                        .then(function(result) {
                           // console.log("result **** ", result);
                            if (result.success) {
                                $state.go('appSimple.login');
                                toastr.success("Usuario actualizado con éxito", 'Aviso');
                            } else {
                                toastr.warning(result.message, 'Aviso');
                            }
                        })
                        .finally(function() {
                            vm.dataSaving = false;
    
                        });

        }

    }
})();

