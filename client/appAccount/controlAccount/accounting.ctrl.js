(function(w, ng, appAng){
	/*	CONTROLADOR bankAccountsController, inicializar propiedades del modelo de aplicacion */
	var AccountingCtrl = function($scope, $rootScope, $cookieStore, maestrosFactory, movimientosFactory){
		var scope = this; //referncia al scope del controlador, para los callback de las peticiones REST
		this.titulo = 'Controlar el Balance de tus movimientos';
		this.fechaActual = new Date().toJSON().split('T')[0];

		//valores por defecto del nuevo movimiento
		this.nuevoMovimiento = {
			esIngreso: 1, esGasto: 0, importe: 0,
			fecha: this.fechaActual
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

		//FILTROS POR FECHA : DE LISTA DE MOVIMIENTOS 
		$rootScope.start_date = '';
		$rootScope.end_date = this.fechaActual;

		$scope.getTotal = function(){
			if( !!$scope.filteredMov ){
				var total = 0, product, importe;
				for(var i = 0, len = $scope.filteredMov.length; i < len; i++){
					product = $scope.filteredMov[i];
					importe = product.importe;
					importe = (!product.esGasto) ? importe : importe*=-1 ;
					total += importe;
				}
				return total;
			}
		}

		this.saveMovimiento = function(){
			var auxCopyMov = ng.copy(this.nuevoMovimiento);
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
				scope.resetMovimiento();
			}
		};

		this.resetMovimiento = function(){
			//mantengo el tipo de movimiento anterior
			this.checkTipoMovimiento();
			this.nuevoMovimiento.categoria = '';
			this.nuevoMovimiento.importe = 0;
			this.nuevoMovimiento.concepto = '';
			this.nuevoMovimiento.fecha = this.fechaActual;
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
})(window, window.angular, app);