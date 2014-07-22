(function(w, ng){
	/*	CONTROLADOR bankAccountsController, inicializar propiedades del modelo de aplicacion */
	var AccountingCtrl = function(bankAccountingFactory){
		this.titulo = 'Controlar el Cash Flow con - AngularJS';

		//valores por defecto del nuevo movimiento
		this.nuevoMovimiento = {
			esIngreso: 1, esGasto: 0, importe: 0,
			fecha: new Date().toJSON().split('T')[0],
			tipo: 'ingreso',
			categoria: 'Ventas'
		};
		
		this.maestros = {
			categoriasIngresos	: ['Nomina', 'Ventas', 'Intereses depositos'],
			categoriasGastos		: ['Hipoteca', 'Compras', 'Impuestos']
		};

		//inicializamos los movimientos y totales
		this.total = bankAccountingFactory.getTotal();
		this.movimientos = bankAccountingFactory.getMovimientos();

		this.saveMovimiento = function(){
			// var newMov = this.nuevoMovimiento;
			// newMov.tipo = this.tipoMovimiento();
			var auxCopyMov = angular.copy(this.nuevoMovimiento);
         auxCopyMov.tipo = this.tipoMovimiento();

			if( auxCopyMov.importe !== 0)
				bankAccountingFactory.setMovimientos(auxCopyMov);

			this.total = bankAccountingFactory.getTotal();
			this.movimientos = bankAccountingFactory.getMovimientos();
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
	app.controller( 'bankAccountsController', ['bankAccountingFactory', AccountingCtrl] );
})(window, window.angular);