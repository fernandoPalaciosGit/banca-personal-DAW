(function(w, ng, ngApp){
	var filtroMovCtrl = function($routeParams, movimientosFactory){
		window.scrollTo(0,0); //reset plugin fixed table footer
		var scope = this;
		//1 - cargo en la vista la URL con el parametro :movId
		//2 - recuperar parametros de URL a travesde la dependencia $routeParams del controlador
		//3 - recupero los datos de un movimiento especifico y los asigno al modelo de este controlador , paar por¡der usar lo en su vista 
		this.movId = $routeParams.movId;
		this.filtroMov = {};
		this.msg = "";
		this.isSetFiltro = function(){
			return this.msg === ""; 
		};

		//servicio de consulta REST
		movimientosFactory.getMovFilter(this.movId)
								.success(function (data){
									scope.filtroMov = data;
									scope.msg = (!data) ? "no existe este movimiento" : "" ;
								});
	};

	ngApp.controller('filtroMovimientoController', ['$routeParams', 'movimientosFactory', filtroMovCtrl]);
}(window, window.angular, app));