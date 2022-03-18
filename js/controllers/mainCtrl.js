(function () {
    'use strict';

    angular
        .module('app')
        .controller('mainCtrl', mainCtrl)

    mainCtrl.$inject = ['$location', '$scope', '$timeout', 'dataService', 'toastr', '$uibModal','$auth'];

    function mainCtrl($location, $scope, $timeout, dataService, toastr, $uibModal,$auth) {
        var vm = this;
        var dialog;
        $scope.events = []

      var data = {
        datasets: [{
            data: [
                550.000,
                800.000,
                350.000,
                200.000,
                500.000
            ],
            backgroundColor: [
                'rgb(255, 99, 132,0.5)',
                'rgb(75, 192, 192,0.5)',
                'rgb(255, 205, 86,0.5)',
                'rgb(201, 203, 207,0.5)',
                'rgb(54, 162, 235,0.5)'
              ],
              borderColor: "rgba(0, 0, 0, 0.5)",
            label: 'My dataset', // for legend
        }],
        labels: [
            "Salud",
            "Transporte",
            "Restaurantes",
            "Regalos",
            "Tiempo Libre"
        ],
    };
    var ctx = $("#myChart");
    new Chart(ctx, {
        data: data,
        type: 'polarArea',
        options: {
            responsive: true,
         
          layout: {
            padding: 10,
          },    
          scale: {
            display: true,
            // ticks: {
            //     stepSize: 50
            // }
          },
          legend: {
            labels: {
                usePointStyle: true
             },
             
            display: true,
            position:'bottom',
            // fullSize:true,
            align:'center'
          },
          
          
        }
    });
    
        activate()
        async function activate() {
            vm.dataLoading = false
            vm.esAdmin = true 
        }
    }
})();