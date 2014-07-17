(function(w, ng){
	/*	CONTROLADOR bankAccountsController, inicializar propiedades del modelo de aplicacion */
	var AccountingCtrl = function(maestrosFactory, movimientosFactory){
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

		this.saveMovimiento = function(){
			// var newMov = this.nuevoMovimiento;
			// newMov.tipo = this.tipoMovimiento();
			var auxCopyMov = angular.copy(this.nuevoMovimiento);
         auxCopyMov.tipo = this.tipoMovimiento();

			if( auxCopyMov.importe !== 0)
				movimientosFactory.setMovimientos(auxCopyMov);

			this.total = movimientosFactory.getTotal();
			this.movimientos = movimientosFactory.getMovimientos();
			this.nuevoMovimiento.importe = 0;
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
	app.controller( 'bankAccountsController', ['maestrosFactory', 'movimientosFactory', AccountingCtrl] );
})(window, window.angular);