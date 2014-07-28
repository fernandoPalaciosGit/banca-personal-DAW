// CONTROLADOR DE DIRECTIVA FILTRO-MOVIMIENTOS
var filtroMovController = function (){
	var fechaActual = new Date().toJSON().split('T')[0];

	//RESETEAR VALORES DE FILTROS 
	this.resetValues = function (){
		//filtro personalizado
		this.valorBuscado = '';

		//filtro por valor (search)
		this.valorCorte = true; //todos los movimientos
	};

	this.resetDate = function (){
		// Switch de todos los filtro-fechas
		this.checkData = false;
		
		//fecha de inicio-fin
		this.start_date = '';
		this.end_date = fechaActual;
		
		// Switch de filtro-fechas especificos
		this.checkActualMonth = false;
		this.checkActualYear = false;
		this.checkActualWeek = false;
		this.checkToday = false;
	};


	// researlos valores predeterminados por la factoria
	//---> cambiar  valores reciuperados por la factoria, no por defecto
	this.resetValues();
	this.resetDate();

	// this.setOwnData = function (eventChange){
	// };
	
	this.setActualMonth = function(){
		if( plugin.isEmpty(this.checkActualMonth) ){
			this.checkActualYear = false;
			this.checkActualWeek = false;
			this.checkToday = false;

			var	now = new Date(),
					thisYear = now.getFullYear(),
					thisMonth = now.getMonth(),
					firstDayMonth = new Date(thisYear, thisMonth, 1),
					lastDayMonth = new Date(thisYear, thisMonth, plugin.getLastDayInMonth(now));

			this.start_date = firstDayMonth.toJSON().split('T')[0];
			this.end_date = lastDayMonth.toJSON().split('T')[0];
		}else{
			this.resetDate();
		}
	};

	this.isActualMonth = function(){
		return	!this.checkData &&
					!this.checkActualYear &&
					!this.checkActualWeek &&
					!this.checkToday;
	};

	this.setActualYear = function (){
		if( plugin.isEmpty(this.checkActualYear) ){
			this.checkActualMonth = false;
			this.checkActualWeek = false;
			this.checkToday = false;
			var	now = new Date(),
					thisYear = now.getFullYear(),
					firstDayYear = new Date(thisYear, 0, 1),
					lastDayYear = new Date(thisYear, 11, 31);

			this.start_date = firstDayYear.toJSON().split('T')[0];
			this.end_date = lastDayYear.toJSON().split('T')[0];

		}else{
			this.resetDate();
		}
	};

	this.isActualYear = function(){
		return	!this.checkData &&
					!this.checkActualMonth &&
					!this.checkActualWeek &&
					!this.checkToday;
	};

	this.setActualWeek = function (){
		if( plugin.isEmpty(this.checkActualWeek) ){
			this.checkActualMonth = false;
			this.checkActualYear = false;
			this.checkToday = false;
			var	now = new Date(),
					firstDayWeek = plugin.getFirstDayWeek(now),
					lastDayWeek = plugin.getLastDayWeek(now);

			this.start_date = firstDayWeek.toJSON().split('T')[0];
			this.end_date = lastDayWeek.toJSON().split('T')[0];

		}else{
			this.resetDate();
		}
	};

	this.isActualWeek = function (){
		return	!this.checkData &&
					!this.checkActualMonth &&
					!this.checkActualYear &&
					!this.checkToday;
	};

	this.setToday = function (){
		if( plugin.isEmpty(this.checkToday) ){
			this.checkActualMonth = false;
			this.checkActualYear = false;
			this.checkActualWeek = false;
			var	now = new Date();
			this.start_date = now.toJSON().split('T')[0];
			this.end_date = now.toJSON().split('T')[0];
		}else{
			this.resetDate();
		}
	};

	this.isToday = function (){
		return	!this.checkData &&
					!this.checkActualMonth &&
					!this.checkActualYear &&
					!this.checkActualWeek;
	};
};

// CONFIGURACION DE DIRECTIVA FILTRO-MOVIMIENTOS
var filtroMov = function(){
	return {
		restrict: 'E',
		templateUrl: 'directive/filterMov/filtrosMovimientos.html',
		controller: filtroMovController,
		controllerAs: 'filtroMovCtr'
	};
};

// DIRECTIVA DE FILTRO-MOVIMIENTOS
appDirectives.directive('filtrosMovimientos', filtroMov);
appDirectives.directive('preventDataChange', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        priority: 1, // needed for angular 1.2.x
        link: function(scope, elm, attr, ngModelCtrl) {
        	var lastDate; //variable compartida entre bindings de eventos en el mismo elemento 
        	elm.bind('click', function(){
        		lastDate = elm.val(); //lo podra utilizar 'change'
        	});
        	elm.bind('change', function(){
        		var	filtroMovCtr = scope.filtroMovCtr,
        				diffDate =  +new Date(filtroMovCtr.end_date) - +new Date(filtroMovCtr.start_date);
				
				//inhabilitar si la diferencia del rango de fechas es negativa
				if( !!filtroMovCtr.end_date && !!filtroMovCtr.start_date && diffDate < 0 ){
        			elm.val(lastDate); //'recuperamos el valor de click que es el anterior'
        			alert('rango de fechas incorrecto');
					return false;
				} else {
					//resetear los rangos de fecha especificos
					filtroMovCtr.checkActualMonth = false;
					filtroMovCtr.checkActualYear = false;
					filtroMovCtr.checkActualWeek = false;
					filtroMovCtr.checkToday = false;
				}		
        	});
        }
    };
});