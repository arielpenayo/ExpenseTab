(function(){
    'use strict';

    angular
        .module('app')
        .controller('clienteFormCtrl', clienteFormCtrl)

    clienteFormCtrl.$inject = ['dataService','toastr','$state','$stateParams'];

    function clienteFormCtrl(dataService,toastr,$state,$stateParams) {
        /* jshint validthis:true */
        var vm = this;

        vm.cliente = {};
        vm.editMode = $state.current.name === 'cliente-editar' ? true : false;
        vm.subtitle = $state.current.params.subtitle;
        vm.formFields = [{
          className:'row',
          fieldGroup:[
            {
              className: 'col-md-6',
              key: 'clienteRazonSocial',
              type: 'input',
              templateOptions: {
                type: 'input',
                // label: 'Cliente Nombre',
                placeholder: 'Nombre',
                required: true
              }
            },
            {
              className: 'col-md-3',
              key: 'clienteDoc',
              type: 'input',
              templateOptions: {
                type: 'input',
                // label: 'Cliente Documento',
                placeholder: 'Documento',
                required: true
              }
            },
            {
              className: 'col-md-3',
              key: 'clienteRuc',
              type: 'input',
              templateOptions: {
                type: 'input',
                // label: 'RUC',
                placeholder: 'RUC',
                required: false
              }
            },
            {
              className: 'col-md-3',
              key: 'clienteTelefono',
              type: 'input',
              templateOptions: {
                type: 'input',
                // label: 'Teléfono',
                placeholder: 'Teléfono',
                required: false
              }
            },
            {
              className: 'col-md-6',
              key: 'clienteDireccion',
              type: 'input',
              templateOptions: {
                type: 'input',
                // label: 'Dirección',
                placeholder: 'Dirección',
                required: false
              }
            }
          ]
        }
          
          
        ];

        activate();

        function findClienteById() {
          return dataService.findByPk('cliente', $stateParams.id)
          .then(function(result) {
              return result;
          })
          .finally(function() {
              vm.dataLoading = false;
          });
        } 
        function activate() { 
          if($stateParams.id) {
            vm.dataLoading = true;
              findClienteById()
              .then(function(result) {
                  if (result.success) {
                      console.log('result.data :>> ', result.data);
                      vm.cliente = result.data;
                  } else {
                     console.log('Error en findClienteById');
                  }
              });
         }
        }

        vm.grabar = function (cliente) {
            vm.dataSaving = true;

            //console.log("Datos para creacion: ", datos);
            if ($stateParams.id) {
              dataService.update('cliente',$stateParams.id, cliente)  
              .then(function(result) {
                  if (result.success) {
                      toastr.success('Cliente actualizado con éxito', 'Aviso');
                      $state.go('app.maestros.clientes');
                  } else {
                      toastr.error(result.message, 'Aviso');
                  }
              })
              .finally(function() {
                  vm.dataSaving = false;
              });
            }else{
              dataService.create('cliente', cliente)  
                  .then(function(result) {
                      if (result.success) {
                          toastr.success('Cliente grabado con éxito', 'Aviso');
                          $state.go('app.maestros.clientes');
                      } else {
                          toastr.error(result.message, 'Aviso');
                      }
                  })
                  .finally(function() {
                      vm.dataSaving = false;
                  });
            }
              
            
        } 
    }
})();