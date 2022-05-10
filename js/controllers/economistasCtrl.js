(function(){
    'use strict';

    angular
        .module('app')
        .controller('economistasCtrl', economistasCtrl)

    economistasCtrl.$inject = ['dataService','toastr','$scope','$uibModal','$stateParams','$auth'];

    function economistasCtrl(dataService,toastr,$scope,$uibModal,$stateParams,$auth) {
        /* jshint validthis:true */
        const vm = this;
        let dialog = {};
        vm.economistas = []
        vm.usuario = {}

        activate();

        vm.solicitar = function(usuarioId) {
            console.log(usuarioId)
			var datos = {
				asesoradorId: usuarioId,
                asesoradoId: vm.usuario.usuarioId,
                usuarioAsesoradoEstado:2
			};

			dialog = $uibModal.open({
                templateUrl: '../../views/common/modal.html',
				controller: ['entidad', activateModal2Ctrl],
				controllerAs: 'vm',
				resolve: {
					entidad: function() {
						return datos;
					},
				},
			});
        };
       
        
        function activateModal2Ctrl(datos) {
            
            var vm = this;

            console.log("aa",datos)
            console.log("bb",vm.usu)
			vm.confirmar = confirmar;
			var mensaje = 'Asesoramiento solicitado con éxito!';
			vm.titulo = 'Pedido de confirmación';

            vm.mensaje = 'Desea solicitar Asesoramiento Financiero?';
			 
			
			function confirmar() {
                vm.dataSaving = true;
                
				return dataService
					.create('usuario-asesorado', datos)
					.then(function(result) {
						if (result.success) { 

                            toastr.success(mensaje, 'Aviso');
                            vm.dataSaving = false;
							dialog.close();
                            activate()
                    
                            
						} else {
                            toastr.error(result.message, 'Aviso');
							dialog.close();
						}
					})
                   .catch(function(err){
                       console.log('err :>> ', err);
                       toastr.error(err, 'Aviso');
                        dialog.close();
                   })
			}
		}

       

        function getEconomistas() {
            vm.dataLoading = true;
            return dataService.findAllByFilter("usuario-filter",{usuarioCategoria:2})
                .then(function(result) { 

                    
                    if (result.success) {
                        vm.economistas = result.data;    
                    } else {
                        toastr.error(result.message,'Error');
                    }
                })
                .finally(function() {
                    vm.dataLoading = false;
                });
        }

        function activate() { 
            getEconomistas();

            vm.usuario = $auth.getPayload()
            vm.usu = vm.usuario
            console.log("cc",vm.usuario)
        }
    }
})();