var init = function(){
	//JAVASCRIPT CODE
};

(function(w, ng){
	/*	CONTRUCTOR para el controlador bankAccountsController
		- inicializar propiedades del modelo de aplicacion */
	var accountsCtrl = function($scope, $filter){
		this.titulo = 'Controlar el Cash Flow con - AngularJS';
		
		this.nuevoMovimiento = {
			esIngreso: 1, esGasto: 0, importe: 0,
			//$scope.nuevoMovimiento.fecha = $filter("date")(Date.now(), 'yyyy-MM-dd');
			fecha: new Date().toJSON().split('T')[0]
		};
		
		this.total = { ingresos: 0, gastos: 0 };
		
		this.movimientos = [];
		
		this.maestros = {
			categoriasIngresos	: ['Nomina', 'Ventas', 'Intereses depositos'],
			categoriasGastos		: ['Hipoteca', 'Compras', 'Impuestos']
		};

		this.saveMovimiento = function(){
			var newMov = this.nuevoMovimiento; //reutilizamos codigo

			// this.total.ingresos += newMov.esIngreso * newMov.importe;
			// this.total.gastos += newMov.esGasto * newMov.importe;
			( !newMov.esIngreso )	? this.total.gastos += newMov.importe
											: this.total.ingresos += newMov.importe;

			this.movimientos.push({
				fecha: newMov.fecha,
				tipo: this.tipoMovimiento(),
				categoria: newMov.categoria,
				importe: newMov.importe
			});
			newMov.importe = 0;
		};

		this.tipoMovimiento = function(){
			var tipoMov = (!this.nuevoMovimiento.esIngreso) ? 'gasto' : 'ingreso';
			return tipoMov;
		};

		this.balance = function(){
			return this.total.ingresos - this.total.gastos;
		};
	};

	/*	CONTRUCTOR para el controlador navigationMenuController
		- navegacion a traves del menu principal*/
	var menuCtrl = function($location){
		this.isActive = function(hash){
			//recuperomaos el hash que esta mapeado en la url y lo comparamos con el de este metodo
			return hash === $location.path();
		};
	};

	//CONTROLADORES DE APLICACION
	var app = ng.module('accountsApp', []);
	app.controller('bankAccountsController', accountsCtrl);

	// INJECCION DE DEPENDECCIAS: $location: informacion sobre la ruta
	app.controller('navigationMenuController', ['$location', menuCtrl]);

})(window, window.angular);

window.addEventListener("load", init, false);