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
			//una peticion POST es una peticion http, que suele llevar una carga de datos en el body
			return $http.post(urlBaseMov, movimiento);
		};

		factoryAPI.getTotal = function () {
			return $http.get(urlBaseTot);
		};

		return factoryAPI;
	};
	app.factory("movimientosFactory", ['$http', movimientosFactory]);
}());