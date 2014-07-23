var express = require('express'), //MVC
    bodyParser = require('body-parser'),//nos permitira recuperar datos de formulario por POST
    http = require('http'); //controlar eventos de express

var app = express(),            //aplicacion MVC basada en express
    port = process.env.PORT || 3000,
    server = app.listen(port);  //puerto de escucha del servidor (localhost)

    //PERSISTENCIA DE MOVIMIENTOS
var maxId = 0,
    movimientos = [],
    total = { ingresos: 0, gastos: 0 },
    maestros = {
        categoriasIngresos  :
            ['otros ingresos', 'alquiler inmueble', 'nómina', 'propiedades', 'servicios profesoinales'],
        categoriasGastos    :
            ['gastos personales', 'gastos profesionales', 'seguros', 'impuestos', 'educación', 'colegio profesional', 'alquiler', 'luz', 'agua', 'telefono', 'compras']
    },
    //AUTENTICACION
    usuarios = [],
    sesiones = [];

var newSession = function ( newEmailUser ){
    //dar de alta con el token de sesion a traves del email
    var newSessionId = (Math.random()*88888) + 11111,
        resetTimeStamp = new Date();
    
    sesiones.push({
        email: newEmailUser,
        sessionId: newSessionId,
        timeStamp: resetTimeStamp
    });
    return newSessionId;
};

var shutDown = function (){
    console.log("el servidor se ha desconectado");

    server.close(function(){
        process.exit();
    });

    //a los 5 segundos forzaremos el apagado
    setTimeout(function(){
        process.exit();
    }, 1000*5);
};

//MIDDLEWARE: parsear encabezados http y parametros de peticion GET
app.use( bodyParser() );

//MIDDLEWARE, acceso a recursos estaticos desde este servidor
app.use( express.static('../client') );

//MIDDLEWARE, validacion de sesiones
app.use( '/api/priv/', function (req, res, next){
    //APLICAMOS UNA REGLA PARA TODAS LAS URL QUE COMIENZEN POR /api/priv
    var sessionId = req.get('sessionId');
    //console.log("SESION: "+sessionId);
    var sesionEncontrada = sesiones.filter(function (sesion){
            //comparacion solo de valor: Number&&String
            return sesion.sessionId == sessionId;
        })[0];

    //ACTUALIZAR LA SESION si no han pasado 20 minutos o CADUCARLA
    if(sesionEncontrada){
        if( (new Date() - sesionEncontrada.timeStamp) > (1000*20*60) ){
            console.log('Sesion caducada @ 20 min: '+JSON.stringify(sesionEncontrada));
            res.send(419);
        }else{
            sesionEncontrada.timeStamp = new Date();
        }
    }else{
        console.log('Credencial invalida');
        res.send(401);
    }
    /*NODE: si hemos llegado aqui, continuar la ejecucion,
    debemos mantener la ejecucion de este bloque, porque hay que revisar si la sesion ha exurado despues de 20 minutos*/
    next();
});

//API REST: recuperar totales
app.get('/api/priv/total', function (req, res, next) {
    res.json(total);
});

//API REST: recuperar movimientos por parametros
app.get("/api/priv/filter_movimiento", function (req, res, next){
    //recuperamos los prametros de peticion, NO los del encabezado
    var movId = req.query.id;
    var matchMov = movimientos.filter(function (movimiento){
        return movimiento.id == movId;
    })[0];
    res.json(matchMov);
});

//API REST: recuperar y configurar movimientos
app.route('/api/priv/movimientos')
	.get(function (req, res, next) {
        res.json(movimientos);
    })
	.post(function (req, res, next) {
        
        var reqBody = req.body;//header HTTP: metadatos nuevoMovimiento
        //proteger el movimiento de sobreescritura
        if( !reqBody.id ){
            var movimiento = {
                id: maxId++,
                esIngreso: reqBody.esIngreso,
                esGasto: reqBody.esGasto,
                importe: reqBody.importe,
                fecha: reqBody.fecha,
                tipo: reqBody.tipo,
                categoria: reqBody.categoria,
                concepto: reqBody.concepto
            };
            ( !movimiento.esIngreso )   ? total.gastos   += movimiento.importe
                                        : total.ingresos += movimiento.importe;
            movimientos.push(movimiento);
        }

        res.status(200);
    });

//API REST: recuperar maestros
app.get("/api/pub/maestros", function(req, res, next){
    res.json(maestros);
});

//API REST: gestion de Usuarios: lista y redistros
app.route('/api/usuarios/')
    .get(function (req, res, next){
        res.json(usuarios);
    })
    .post(function (req, res, next){
        var reqBody = req.body;//header HTTP: metadatos nuevoUsuario
        var checkUsuario = {
            email: reqBody.email,
            password: reqBody.password
        };

        //comprobar registro o dar de alta nuevo usuario
        for (var i = 0, len = usuarios.length; i < len; i++) {
            if( usuarios[i].email === checkUsuario.email){
                console.log('Usuario con email ya registrado: '+checkUsuario.email);
                res.send(409);
                return true; //NODE!!!
            }
        }

        //si no esta registrado, crear token de sesion y devolverlo al cliente
        usuarios.push(checkUsuario);
        var sessionID = newSession(checkUsuario.email);
        res.json(sessionID);
    });

// API REST: gestion de sesiones
/*si el usuario esta registrado, comprobar si la sesionque envia el cliente esta dada de alta para ese cliente en el servidor (email)*/
app.route('/api/sesiones')
    .get(function (req, res, next){
        res.json(sesiones);
    })
    .post(function (req, res, next){
        var reqBody = req.body;//header HTTP: metadatos nuevoUsuario
        var checkUsuario = {
            email: reqBody.email,
            password: reqBody.password
        };
        //confirmar usuario o negar conexion
        for (var i = 0, len = usuarios.length; i < len; i++) {
            if( usuarios[i].email === checkUsuario.email &&
                usuarios[i].password === checkUsuario.password    ){
                var sessionID = newSession(checkUsuario.email);
                res.json(sessionID);
                return true; //NODE!!!
            }
        }
        console.log("Credencial Invalida: "+checkUsuario.email);
        res.send(401);
    });

//API REST: prueba de servidor
app.get("/test", function(req, res, next){
    res.send("<h1>Flujo de Cajas</h1><p>NodeJs y Expres funcionan!!!</p>");
});
console.log('Servidor NodeJS corriendo en http://localhost:'+port);

process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);