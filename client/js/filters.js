// filtro recortar la propiedad 'concepto' de cada movimiento
var cutInput = function(){
	return function(inputValue, paramFilter){
		if(!paramFilter)
			paramFilter = 10;
		if(!inputValue)
			return '---';

		if(inputValue.length <= paramFilter)
			return inputValue;
		else
			return inputValue.substring(0, paramFilter)+'...';
	};
};

// filtro importe de movimiento: por cantidades pequeñas y grandes
var impInput = function(){
	 return function (inputValue, paramFilter) {
	 	//[Object]inputValue: todos los moviumientos de la lista
	 	//[Number]paramFilter: numero de movimientos a filtrar 
		 if (paramFilter) {
		     var filtrados = [],
		     		paramFilter = parseFloat(paramFilter);

		     for (var i = 0; i < inputValue.length; i++) {
		         var importeMov = parseFloat(inputValue[i].importe);
		         if (	(paramFilter >= 0) &&
		         		(importeMov >= paramFilter) ) {
		             filtrados.push(inputValue[i]);
		         }else if(	(paramFilter <= 0) &&
		         				(-paramFilter > importeMov) ){
		         	filtrados.push(inputValue[i]);
		         }
		     }
		     return filtrados;
		 } else {
		 		return inputValue;
		 }
	};
};

// filtro formato del importe: €, decimales con una clse que los empequeñezca
var parseAmount = function(){
	return function (inputValue, paramFilter){
		var	quantity = inputValue.split('.')[0].replace(',', '.'),
				cents = " ,"+inputValue.split('.')[1]+" "+paramFilter;
		return quantity+cents;
	};
};

//filtro rango de fecha del movimiento
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

var appFilters = window.angular.module('input-filters', []);
appFilters.filter('impInput', impInput);
appFilters.filter('cutInput', cutInput);
appFilters.filter('parseAmount', parseAmount);
appFilters.filter('dateRange', dateRange);