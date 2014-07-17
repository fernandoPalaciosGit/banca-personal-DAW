(function(){
	var maestrosFactory = function($http){
		var	urlREST = "http://localhost:3000/api/pub/maestros",
				maestros = {};
				factoryAPI = {};
		
		factoryAPI.getMaestros = function(){
			return $http.get(urlREST);
		};

		return factoryAPI;
	};
	app.factory('maestrosFactory', ['$http', maestrosFactory]);
}());