// recortar la propiedad 'concepto' de cada movimiento
var cutInput = function(){
	return function(inputValue, paramFilter){
		if(!paramFilter)
			paramFilter = 10;
		if(!inputValue)
			return '----';

		if(inputValue.length <= paramFilter)
			return inputValue;
		else
			return inputValue.substring(0, paramFilter)+'...';
	};
};

//texto por defecto (ausencia de contenido)
var byDefault = function(){
	return function(field, strDef){
		strDef = strDef || '----';
		return field || strDef;
	};
};

//capitalizar palabras del input
var capitalyzeAll = function(){
	return function (inputValue, separator){
		var	flag = separator || ' ',
				parseValue = inputValue.split(flag).map(function(arr, item){
					return arr.charAt(0).toUpperCase() + arr.substring(1);
				}).join(flag);
		return parseValue;
	};
};

// importe de movimiento: por cantidades pequeñas y grandes
var impInput = function(){
	 return function (movimientos, paramFilter) {
	 	//[Object]movimientos: todos los moviumientos de la lista
	 	//[Number]paramFilter: numero de movimientos a filtrar 
		 if (paramFilter && !!movimientos) { //ANGULAR
		     var filtrados = [],
		     		paramFilter = parseFloat(paramFilter);

		     for (var i = 0, len = movimientos.length; i < len; i++) {
		         var importeMov = parseFloat(movimientos[i].importe);
		         if (	(paramFilter >= 0) &&
		         		(importeMov >= paramFilter) ) {
		             filtrados.push(movimientos[i]);
		         }else if(	(paramFilter <= 0) &&
		         				(-paramFilter > importeMov) ){
		         	filtrados.push(movimientos[i]);
		         }
		     }
		     return filtrados;
		 } else {
		 		return movimientos;
		 }
	};
};

// formato del importe: €, decimales con una clse que los empequeñezca
var parseAmount = function(){
	return function (inputValue, paramFilter){
		var	quantity = inputValue.split('.')[0].replace(',', '.'),
				cents = " ,"+inputValue.split('.')[1]+" "+paramFilter;
		return quantity+cents;
	};
};

// rango de fecha del movimiento
var dateRange = function(){
  return function (conversations, start_date, end_date, checkData) {
		var result = [];
 
		// date filters
		var start_date = (start_date && !isNaN(Date.parse(start_date))) ? Date.parse(start_date) : 0;
		var end_date = (end_date && !isNaN(Date.parse(end_date))) ? Date.parse(end_date) : new Date().getTime();
		// if the conversations are loaded
		if (checkData && conversations && conversations.length > 0){
			for (var i = 0, len = conversations.length; i < len; i++) {
			    var	conversation = conversations[i],
			    		conversationDate = new Date(conversation.fecha);
				if (conversationDate >= start_date && conversationDate <= end_date){
					result.push(conversation);
				}
			};
			return result;
		}else return conversations;
	};
};

appFilters.filter('impInput', impInput);
appFilters.filter('cutInput', cutInput);
appFilters.filter('parseAmount', parseAmount);
appFilters.filter('dateRange', dateRange);
appFilters.filter('byDefault', byDefault);
appFilters.filter('capitalyzeAll', capitalyzeAll);