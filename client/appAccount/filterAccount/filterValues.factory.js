(function(w, ng, ngApp){
	var movimientosFiltrados = function($http){
		var	fechaActual = new Date().toJSON().split('T')[0],
				factoryAPI = {
					valorBuscado : '',
					valorCorte : true,
					checkData : false,
					start_date : '',
					end_date : fechaActual,
					checkToday : false,
					checkActualMonth : false,
					checkActualYear : false,
					checkActualWeek : false
				};
				
		return factoryAPI;
	};
	ngApp.factory("movimientosFiltrados", ['$http', movimientosFiltrados]);
}(window, window.angular, app));