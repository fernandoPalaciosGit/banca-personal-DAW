(function(w, ng, appAng, plugin){
	/*	CONTROLADOR bankAccountsController, inicializar propiedades del modelo de aplicacion */
	var AccountingCtrl = function($scope, $rootScope, $cookieStore, maestrosFactory, movimientosFactory){
		var	scope = this, //referncia al scope del controlador, para los callback de las peticiones REST
				fechaActual = new Date().toJSON().split('T')[0];

		//encabezados de directivas <mensaje>
		this.titulo = {
			totMovTpl: 'Controlar el Balance de tus movimientos.',
			newMovTpl: 'Introduce los datos de un nuevo movimiento.',
			listMovTpl: 'Lista de movimientos actuales.'
		};
		
		//valores por defecto del nuevo movimiento
		this.nuevoMovimiento = {
			esIngreso: 1, esGasto: 0, importe: 0,
			fecha: fechaActual
		};


		this.total = { ingresos: 0, gastos: 0 };

		maestrosFactory.getMaestros() //peticion ajax: angular.get(REST)
							.success(function (data){
								scope.maestros = data;
							});

		movimientosFactory.getMovimientos() //peticion ajax: angular.get(REST)
								.success(function (data){
								scope.movimientos = data;
							});

		movimientosFactory.getTotal() //peticion ajax: angular.get(REST)
								.success(function (data){
									scope.total = data;
								});

		//RECONOCIMIENTO DEL USUARIO
		$rootScope.nombre = ( $cookieStore.get('sessionId') ) ?
			$cookieStore.get('sessionName') :
			'primero debes Acceder a sistema';

		this.saveMovimiento = function(){
			var auxCopyMov = ng.copy(this.nuevoMovimiento);
			if( auxCopyMov.importe !== 0 ){

				/*almacenar datos en el server y recuperar nuevos movimentos y totales*/
				movimientosFactory.setMovimientos(auxCopyMov)
										.success(function(data, status, headers, config) {
						//asegurar el update de nuevo movimiento
						if(status == 200){
							movimientosFactory.getTotal().success(function(data){
								scope.total = data;
							});
							movimientosFactory.getMovimientos().success(function(data){
								scope.movimientos = data;
							});
						}
				});

				/*actualizar vista*/
				scope.resetMovimiento();
			}
		};

		this.resetMovimiento = function(){
			//mantengo el tipo de movimiento anterior
			this.checkTipoMovimiento();
			this.nuevoMovimiento.categoria = '';
			this.nuevoMovimiento.importe = 0;
			this.nuevoMovimiento.concepto = '';
			this.nuevoMovimiento.fecha = fechaActual;
		};

		this.checkTipoMovimiento = function(){
			this.nuevoMovimiento.tipo = (!this.nuevoMovimiento.esIngreso) ? 'gasto' : 'ingreso';
		};

		this.checkTipoMovimiento();

		this.balance = function(){
			return this.total.ingresos - this.total.gastos;
		};
	};

	//CONTROLADORES DE APLICACION y dependencia de controlador $location
	appAng.controller(	'bankAccountsController',
								['$scope', '$rootScope', '$cookieStore', 'maestrosFactory', 'movimientosFactory', AccountingCtrl] );
})(window, window.angular, app, plugin);