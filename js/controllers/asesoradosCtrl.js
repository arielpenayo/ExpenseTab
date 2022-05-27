(function(){
    'use strict';

    angular
        .module('app')
        .controller('asesoradosCtrl', asesoradosCtrl)

    asesoradosCtrl.$inject = ['dataService','toastr','$scope','$uibModal','$stateParams','$auth'];

    function asesoradosCtrl(dataService,toastr,$scope,$uibModal,$stateParams,$auth) {
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

        vm.verDetalles = function(usuarioId){
            let usuario = vm.usuario
            // let cuentasAcobrar = $localStorage.cuentasAcobrar.reduce((acc, d) => {
            //     let found = acc.find(a => a.clienteId == d.clienteId);
            //     if (!found) {
            //         acc.push({
            //             clienteId: d.clienteId,
            //             clienteDocNro: d.clienteDocNro,
            //             clienteRazonSocial: d.clienteRazonSocial,
            //             monedaCod: d.monedaCod,
            //             cuentaClienteAcobrarEstadoSaldo: parseFloat(d.cuentaClienteEstadoMontoSaldo),
            
            //         })
            //     }
            //     else {
            //         found.cuentaClienteAcobrarEstadoSaldo = parseFloat(found.cuentaClienteAcobrarEstadoSaldo) + parseFloat(d.cuentaClienteEstadoMontoSaldo)
            //     }
            //     return acc;
            // }, []);
            
        }

        vm.cambiarEstado = function(id, operacion) {
            var datos = {
                id: id,
                operacion: operacion
            }
            dialog = $uibModal.open({
                templateUrl: '../../views/common/modal.html',
				controller: ['entidad', activateModalCtrl],
				controllerAs: 'vm',
				resolve: {
					entidad: function() {
						return datos;
					},
				},
			});
        }

        function activateModalCtrl(datos) {
            var vm = this;
            var mensaje = datos.operacion === "desactivar" ? "Solicitud rechazada" : "Solicitud aceptada con éxito!";
            vm.confirmar = confirmar;
            var actualizacion;

            vm.titulo = 'Pedido de confirmación';

            if (datos.operacion === "desactivar") {
                vm.mensaje = 'Deseas rechazar esta solicitud?';
                actualizacion = { usuarioAsesoradoEstado: 0 }
            } else if (datos.operacion === "activar") {
                vm.mensaje = 'Deseas aceptar esta solicitud?';
                actualizacion = { usuarioAsesoradoEstado: 1 }
            }


            function confirmar() {
                return dataService.update('usuario-asesorado', datos.id, actualizacion)
                    .then(function(result) {
                        if (result.success) {
                            activate();
                            dialog.close();
                            toastr.success(mensaje, 'Aviso');
                        } else {
                            toastr.error(result.message);
                        }

                    });
            }
        }
       

        function getEconomistas() {
            vm.dataLoading = true;
            return dataService.findAllByFilter("usuario-asesorado-ext-filter",{asesoradorId:vm.usuario.usuarioId,usuarioAsesoradoEstado:{$ne:0}})
                .then(function(result) { 


                    
                    if (result.success) {
                   
                        result.data.forEach(element => {
                            dataService.findAllByFilter('transaccion-ext-filter',{usuarioId:element.asesoradoId})
                                .then(function(result) {
                                    if (result.success) {
                                        element.transacciones = result.data;
                                    } else {
                                        toastr.error(result.message, 'Aviso');
                                    }
                                })
                                .catch(function(err){
                                    console.log('err :>> ', err);
                                    toastr.error(err, 'Aviso');
                                })


                        });

                        vm.asesorados = result.data;    
                        console.log('vm.asesorados', vm.asesorados)
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
        }
    }
})();