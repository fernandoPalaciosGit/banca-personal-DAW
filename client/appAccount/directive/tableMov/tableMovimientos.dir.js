var tablaMovController = function (){
	this.filteredMov = [];
	this.sentido = false;
	this.campo = '';
	
	this.checkCampoSentido = function (isCampo){
			this.sentido = (this.campo === isCampo) ? !this.sentido : this.sentido;
			this.campo = isCampo;
	};

	this.getTotal = function(){
		if( !!this.filteredMov ){ //???ANGULAR
			var total = 0, product, importe;
			for(var i = 0, len = this.filteredMov.length; i < len; i++){
				product = this.filteredMov[i];
				importe = product.importe;
				importe = (!product.esGasto) ? importe : importe*=-1 ;
				total += importe;
			}
			return total;
		}
	};

};

var tablaMov = function(){
	return {
		restrict: 'E',
		templateUrl: 'directive/tableMov/tableMovimientos.html',
		controller: tablaMovController,
		controllerAs: 'tablaMovCtr'
	};
};

appDirectives.directive('tablaMovimientos', tablaMov);