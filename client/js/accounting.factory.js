(function(w, ng){
	// constructor angular.factory(), que permite tener un grupo de propiedades de controlador con persistencia estatica en todos quellos que la reciban como parametro
	//propiedades apersistir: total, movimientos
	var AccountingFactory = function(){
		var	movimientos = [],
				total = { ingresos: 0, gastos: 0 },
				factoryAPI = {};

		factoryAPI.getMovimientos =   function ()  {
		   return movimientos;
		};
		factoryAPI.getTotal =   function ()  {
		   return total;
		};
		factoryAPI.setMovimientos = function (movimiento)  {
			( !movimiento.esIngreso )	? total.gastos += movimiento.importe
											: total.ingresos += movimiento.importe;
			movimientos.push(movimiento);
		};

		return factoryAPI;
	};

	app.factory('bankAccountingFactory', AccountingFactory);

})(window, window.angular);