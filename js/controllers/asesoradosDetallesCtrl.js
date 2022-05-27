(function(){
    'use strict';

    angular
        .module('app')
        .controller('asesoradosDetallesCtrl', asesoradosDetallesCtrl)

    asesoradosDetallesCtrl.$inject = ['dataService','toastr','$scope','$uibModal','$auth','$stateParams'];

    function asesoradosDetallesCtrl(dataService,toastr,$scope,$uibModal,$auth,$stateParams) {
        /* jshint validthis:true */
        const vm = this;
        let dialog = {};
        vm.transacciones = []

        activate();

         
        function activate() { 
            vm.usuario = $auth.getPayload()
            getTransacciones();
        }

        function formatNumber(num, fixed) {
            var decimalPart;

            var array = Math.floor(num).toString().split('');
            var index = -3;
            while (array.length + index > 0) {
                array.splice(index, 0, '.');
                index -= 4;
            }

            if (fixed > 0) {
                decimalPart = num.toFixed(fixed).split(".")[1];
                return array.join('') + "," + decimalPart;
            }
            return array.join('');
        };
        vm.sumarTotal = function () {
            let {montoTotal} = vm.transacciones.reduce((acc,item)=> {
        
               
                acc.montoTotal += + (item.transaccionMonto ? parseFloat(item.transaccionMonto) : 0)
        
                return acc
            },{montoTotal:0})
            return {montoTotal}
        }
        vm.imprimir = function (listado,usuario) {
            let listadoAgrupado = listado.reduce((acc, d) => {
                var found = acc.find(a => a.categoriaId === d.categoriaId);
                if (!found) {
                    // encabezado

                    acc.push({
                        categoriaId: d.categoriaId,
                        categoriaDenominacion: d.categoriaDenominacion,

                        detalles: [
                            d
                        ]
                    })
                } else {
                    let indexFound = acc.findIndex(item => item.categoriaId == d.categoriaId);
                    acc[indexFound].detalles.push({
                        categoriaId: d.categoriaId,
                        checklistItemDescripcion: d.checklistItemDescripcion, 
                        transaccionFecha: d.transaccionFecha, 
                        transaccionMonto: d.transaccionMonto,
                        categoriaDenominacion: d.categoriaDenominacion,
                        transaccionObservacion: d.transaccionObservacion,
                    })
                }
                return acc;
            }, []); 
                
             

            console.log('listadoAgrupado', listadoAgrupado)
            printAnalisisCheckList(listadoAgrupado,usuario,   vm.sumarTotal().montoTotal)
        }
        function printAnalisisCheckList(listado,usuario,totalSumatoria) {
            console.log(`listado`, listado)
            console.log('totalSumatoria', totalSumatoria)
         
            let detalles2 = [];
            for (let index = 0; index < listado.length; index++) {                
                let row = [];
                let checkListItems = [];
                let checkListsDet = [];
                let rowDet = [];
                let rowObs = [];
                if (index == 0) {
                    row = [
                        { text: listado[index].categoriaDenominacion, fontSize: 10, margin: [0, 5, 0, 5], border: [false, false, false, false], alignment: 'left' ,bold:true},
                        {
                            stack: [

                                { text: `Observación`, margin: [-150, 0, 0, 0] , bold: true, fontSize: 10 },
                                {text:'Monto',fontSize: 10, margin: [15, -10, 0, 5], border: [false, false, false, false], alignment: 'center' ,bold:true},

                            ], border: [false, false, false, false]
                        },
                        
                    ]
                    detalles2.push(row);
                    checkListItems = listado[index].detalles;
                    checkListItems.map((item, index2) => {
                        rowDet = [
                            { text: moment(item.transaccionFecha).format('DD/MM/yyyy') , fontSize: 8, margin: [0, 5, 0, 5], border: [false,false,false,false], alignment: 'left' },
                            { text: item.transaccionObservacion, fontSize: 8, margin: [0, 5, 0, 5], border: [false,false,false,false], alignment: 'left' },
                            { text: formatNumber(Math.round(item.transaccionMonto)),  fontSize: 8, margin: [0, 5, 0, 5], border: [false,false,false,false], alignment: 'center' },
                           
                        ]
                        checkListsDet.push(rowDet);

                         
                    })
                    row = [
                        {
                            border: [false, false, false, false],
                            colSpan: 2,
                            margin: [-5, -3, -3, -3],
                            fontSize: 6,
                            table: {
                                widths: [300,100, 95],
                                body: checkListsDet
                            },
                            layout: {
                                defaultBorder: false,
                                hLineWidth: function (i, node) {
                                    return 0.1;
                                },
                                vLineWidth: function (i, node) {
                                    return 0.1;
                                },
                                hLineColor: function (i, node) {
                                    return 'gray';
                                },
                                vLineColor: function (i, node) {
                                    return 'gray';
                                },
                            }
                        },
                        { text: '', border: [false, false, false, false] },
                        
                    ]

                    detalles2.push(row);
                } else {
                    row = [
                        { text: listado[index].categoriaDenominacion,fontSize: 10, margin: [0, 5, 0, 5], border: [false, false, false, false], alignment: 'left' ,bold:true},
                        {},                    
                    ]
                    detalles2.push(row);
                    checkListItems = listado[index].detalles;
                    checkListItems.map((item, index2) => {
                        rowDet = [
                            { text: moment(item.transaccionFecha).format('DD/MM/yyyy'), fontSize: 8, margin: [0, 5, 0, 5], border: [false,false,false,false], alignment: 'left' },
                            { text: item.transaccionObservacion, fontSize: 8, margin: [0, 5, 0, 5], border: [false,false,false,false], alignment: 'left' },                                                       
                            { text: formatNumber(Math.round(item.transaccionMonto)), fontSize: 8, margin: [0, 5, 0, 5], border: [false,false,false,false], alignment: 'center' },                                                       
                        ]
                        checkListsDet.push(rowDet);
                        
                    })
                    row = [
                        {
                            border: [false, false, false, false],
                            colSpan: 2,
                            margin: [-5, -3, -3, -3],
                            fontSize: 6,
                            table: {
                                widths: [300,100, 95],
                                body: checkListsDet
                            },
                            layout: {
                                defaultBorder: false,
                               
                            }
                        },

                        { text: '', border: [false, false, false, false] },
                    ]

                    detalles2.push(row);
                }
            }
           
            var dd = {
                pageOrientation: 'portrait',
                pageSize: 'A4',
                pageMargins: [75, 30, 0, 15],
            
                footer: function (currentPage, pageCount) { return { text: currentPage.toString() + ' / ' + pageCount, margin: [15, 0, 20, 0], alignment: 'right', fontSize: 8 }; },
                content: [
                    {
                        table: {
                            widths: [450],
                            body: [
                                [
                                    {
                                        image: 'data:image/png;base64,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', border: [false, false, false, false],
                                        
                                        width: 250,
                                        alignment: 'center'
                                    },
                                ],
                            ]
                        }
                    },
                    {
                        table: {
                            widths: [440],
                            body: [
                                [
                                    {
                                        stack: [

                                            { text: `Informe de ${usuario}`, margin: [15, 5, 0, 0], color: 'green', bold: true, fontSize: 14, alignment: 'center' },
                                            { text: 'Fecha :' +moment( ).format('DD/MM/yyyy'), color: 'green',bold: true, margin: [15, 5, 0, 0], fontSize: 10, alignment: 'center' }, 
                                        ], border: [false, false, false, false]
                                    },
                                ]
                            ]
                        }
                    }, 
 
               
                    {
                        table: {
                            widths: [420, 50],
                            body: detalles2
                        },
                       layout:{
                           defaultBorder: false
                       }
                    },  
                        
                    
                    {
                        // margin: [0, 0, 0, 0],
                       
                        stack: [ 
                            { text: 'Total:\n\n', fontSize: 10,  margin: [5, 5, 0, 5],border: [true, true, true, true],  bold: true,  alignment: 'left' },
                            
                            { text: formatNumber(Math.round(totalSumatoria)),  border: [true, true, true, true],fontSize: 10, margin: [445, -20, 0, 4], bold: true, alignment: 'left' },
                         
                        
                        ]
                    },

                ],
                defaultStyle: {
                    // alignment: 'justify'
                }
            }
            pdfMake.createPdf(dd).open();
        }

        function getTransacciones() {
            vm.dataLoading = true;
            return dataService.findAllByFilter("transaccion-ext-filter",{usuarioId:$stateParams.id})
                .then(function(result) { 
                    if (result.success) {
                        result.data.map(e=>{
                            e.fecha = moment(e.transaccionFecha).format('DD/MM/YYYY').toString()
                        })
                        vm.transacciones = result.data;    
                        console.log(vm.transacciones)
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