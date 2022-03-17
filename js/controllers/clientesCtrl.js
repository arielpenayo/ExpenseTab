(function(){
    'use strict';

    angular
        .module('app')
        .controller('clientesCtrl', clientesCtrl)

    clientesCtrl.$inject = ['dataService','toastr','$scope','$uibModal'];

    function clientesCtrl(dataService,toastr,$scope,$uibModal) {
        /* jshint validthis:true */
        var vm = this;
        var dialog;


        activate();

        vm.eliminar = function(clienteId) {
			var datos = {
				clienteId: clienteId
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


			vm.confirmar = confirmar;
			var mensaje = 'Cliente eliminado con éxito!';
			vm.titulo = 'Pedido de confirmación';

            vm.mensaje = 'Deseas eliminar el Cliente?';
			
			
			function confirmar() {
                vm.dataSaving = true;
                
				return dataService
					.delete('cliente', datos.clienteId)
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

        function activate() { 
            getClientes();
        }

        function getClientes(filtro) {
            vm.dataLoading = true;
            return dataService.findAll("cliente")
                .then(function(result) { 
                    // console.log(result);
                    
                    if (result.success) {
                        vm.clientes = result.data;    
                    } else {
                        toastr.error(result.message,'Error');
                    }
                })
                .finally(function() {
                    vm.dataLoading = false;
                });
        }
    }
})();