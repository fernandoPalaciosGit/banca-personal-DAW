//encabezado de vistas, adicion de mensaje personalizado
var outputImpresion = function(){
	return {
		restrict: 'E',
		templateUrl: 'directive/printOut/printOutput.html',
		controller: function (){
			this.fechaDeImpresion = new Date();
			this.tipoBalance = "";

			this.totalPrintMov = function(lengthMov, totalMov){
				if ( totalMov == 0 )
					return "Balance nulo de Movimientos";

				this.tipoBalance = ( totalMov > 0 ) ? "Positivo" : "Negativo";
				return	lengthMov +" Documentos, Balance "+this.tipoBalance+
							" de movimientos : "+Math.abs(totalMov)+" Euros";
			};

			this.IsValorBuscadoType = function(valorBuscado){
				return (valorBuscado == 'ingreso' || valorBuscado == 'gasto') ? true : false;
			};

			this.categMov = function (valorBuscado){
				return	(valorBuscado !== 'ingreso' && valorBuscado !== 'gasto' )
							? "Ingresos y Gastos" : valorBuscado;
			};

			this.fechasFiltradas = function (startDate, endDate){
				var output = ''; 
				if( !plugin.isEmpty(startDate) && !plugin.isEmpty(endDate) ){
					output = "Desde "+startDate+" ---> Hasta "+endDate;
				} else if( plugin.isEmpty(startDate) ) {
					output = "Movimientos hasta "+endDate;
				} else if( plugin.isEmpty(endDate) ) {
					output = "Movimientos a partir de "+startDate;
				}
				return output;
			};

			this.valoresFiltrados = function (valorCorte){
				var output = '';
				if( Object.prototype.toString.call(valorCorte) === '[object Boolean]' ){
					return output = (!!valorCorte) ? "Cualquier Cuantía." : "Cantidades Nulas.";
				} else if( Object.prototype.toString.call(valorCorte) === '[object Number]' ){
					return output = ( valorCorte > 0 )	?	"Cantidades superiores a "+Math.abs(valorCorte)+" Euros." :
													"Cantidades inferiores a "+Math.abs(valorCorte)+" Euros.";
				}
			};
		},
		
		controllerAs: 'outPrintCtrl'
	};
};

appDirectives.directive('outputImpresion', outputImpresion);