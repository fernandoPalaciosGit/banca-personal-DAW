(function(w, ng, appAng){
	/*	CONTROLADOR bankAccountsController, inicializar propiedades del modelo de aplicacion */
	var AccountingCtrl = function($rootScope, $cookieStore, maestrosFactory, movimientosFactory){
		var scope = this; //referncia al scope del controlador, para los callback de las peticiones REST
		this.titulo = 'Controlar el Cash Flow con - AngularJS';

		//valores por defecto del nuevo movimiento
		this.nuevoMovimiento = {
			esIngreso: 1, esGasto: 0, importe: 0,
			fecha: new Date().toJSON().split('T')[0],
			tipo: 'ingreso',
			categoria: 'Ventas'
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
			'Hola '+$cookieStore.get('sessionName') :
			'primero debes Acceder a sistema';

		this.saveMovimiento = function(){
			var auxCopyMov = ng.copy(this.nuevoMovimiento);
         auxCopyMov.tipo = this.tipoMovimiento();

			if( auxCopyMov.importe !== 0 ){				
				/*almacenar datos en el server*/
				movimientosFactory.setMovimientos(auxCopyMov);

				/*recuperar datos del server*/
				movimientosFactory.getTotal().success(function(data){
					scope.total = data;
				});
				movimientosFactory.getMovimientos().success(function(data){
					scope.movimientos = data;
				});

				/*actualizar vista*/
				scope.nuevoMovimiento.importe = 0;
			}
		};

		this.tipoMovimiento = function(){
			var tipoMov = (!this.nuevoMovimiento.esIngreso) ? 'gasto' : 'ingreso';
			return tipoMov;
		};

		this.balance = function(){
			return this.total.ingresos - this.total.gastos;
		};
	};

	//CONTROLADORES DE APLICACION y dependencia de controlador $location
	appAng.controller(	'bankAccountsController',
								['$rootScope', '$cookieStore', 'maestrosFactory', 'movimientosFactory', AccountingCtrl] );
})(window, window.angular, app);