(function(){
	var movimientosFactory = function($http){
		var	factoryAPI = {},
				urlBaseMov = "/api/priv/movimientos",
				urlBaseTot = "/api/priv/total";

		factoryAPI.getMovimientos = function () {
			return $http.get(urlBaseMov);
		};

		factoryAPI.setMovimientos = function (movimiento) {
			//los objetos que acumulamos es en el backend
			return $http.post(urlBaseMov, movimiento);
		};

		factoryAPI.getTotal = function () {
			return $http.get(urlBaseTot);
		};

		return factoryAPI;
	};
	app.factory("movimientosFactory", ['$http', movimientosFactory]);
}());