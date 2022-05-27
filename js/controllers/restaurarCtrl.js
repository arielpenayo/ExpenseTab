(function() {
    'use strict';

    angular
        .module('app')
        .controller('restaurarCtrl', restaurarCtrl)


        restaurarCtrl.$inject = ['dataService', 'toastr', '$uibModal', '$stateParams','$filter', '$scope','md5','$state','config'];

    function restaurarCtrl(dataService, toastr, $uibModal, $stateParams,$filter, $scope, md5, $state,config ) {

        var vm = this;
        vm.dataLoading;

        vm.mensaje = false; 

        vm.dataSaving = false;

        vm.appuserContenedor = [];
        vm.appuser = {};

        vm.loginRestablecerFields = [{
                key: 'usuarioCorreo',
                type: 'input',
                templateOptions: {
                    type: 'email',
                    label: 'Email',
                    placeholder: 'Ingrese email',
                    required: true
                }
            }
        ];

       
        vm.restablecerContrasena = function(appuser) {

            vm.dataSaving = true;

           // console.log('appuser', appuser);

            dataService.findAllByFilter("usuario-filter", appuser)
                
            .then(function(result) { 

                    if(result.success){

                        if(result.data.length === 0){

                            vm.dataSaving = false;
                            
                            toastr.warning("El email especificado no existe", 'Aviso');
                        }else{
                          
                            vm.appuserContenedor = result.data[0];
                
                            var ahora = moment().format();
                            var hash = md5.createHash(ahora);
                            
                            vm.appuserContenedor.usuarioContrasenha = hash;

                           // console.log('vm.appuserContenedor: ', vm.appuserContenedor);
                            
                            dataService.update('usuario', vm.appuserContenedor.usuarioId, vm.appuserContenedor) 
                                .then(function(result) {

                                    if (result.success) {

                                        //console.log('result.data', result.data);


                                        let datosEmailer = {
                                            emailerTo: result.data.usuarioCorreo, 
                                            emailerSubject: "Restablecer Cuenta",
                                            emailerText: `Haga click en el siguiente enlace para restablecer su contraseña: \n\n`  + `http://localhost:6060/#!/usuario-activar/${result.data.usuarioCorreo}/${result.data.usuarioContrasenha}`
                                        }

                                        dataService.create('emailer', datosEmailer)
                                            .then(function(result) {

                                                //console.log("success? ", result);

                                                if (result.success) {
                                                    $state.go('login');
                                                    
                                                    // toastr.success("Usuario restablecido con éxito", 'Aviso');
                                                } else {
                                                    toastr.warning(result.message, 'Aviso');
                                                }
                                        })
                                        
                                       

                                        vm.mensaje = true;

                                        toastr.success("Link enviado con éxito", 'Aviso');
                                    } else {
                                        toastr.warning('Email no encontrado');
                                    }
                                })
                                .catch(function() {
                                    toastr.warning('Error');
            
                                })
                        }

                    }else{
                        toastr.warning('Error de conexion');;
                    }
        
            })
            .catch(function() {
                toastr.warning('Error');

            })
          

            
            

        }


    }
})();