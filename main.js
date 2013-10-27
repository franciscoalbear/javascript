// objetos importantes del canvas
var canvas = document.getElementById('juego');
var ctx = canvas.getContext('2d');
//definir el objeto nave
var nave = {
    x:100,
	y: canvas.height-100,
	width:50,
	height:50
}
var teclado = {};

var disparos = [];
var disparosEnemigos = [];
var enemigos = [];
// definir la variable para las imagenes
var fondo;
var juego = {
  estado: 'iniciando'  
};
// definicion de las funciones
function loadMedia(){
    fondo = new Image();
	fondo.src = 'Estrellas.jpg';
	fondo.onload = function(){
	    var intervalo = window.setInterval(frameLoop,1000/55);
	}	
}
function dibujarEnemigos(){
    for(var i in enemigos){
	    var enemigo = enemigos[i];
		ctx.save();
		if(enemigo.estado == 'vivo') ctx.fillStyle = 'red';
		if(enemigo.estado == 'muerto') ctx.fillStyle = 'black';
		ctx.fillRect(enemigo.x, enemigo.y, enemigo.width, enemigo.height);
	}
}
function drawBackground(){
    ctx.drawImage(fondo,0,0);
}
function dibujarNave(){
    ctx.save();
	ctx.fillStyle = 'white';
	ctx.fillRect(nave.x, nave.y, nave.width, nave.height);
	ctx.restore();
}
function agregarEventosTeclado(){
    agregarEvento(document,"keydown",function(e){
	    teclado[e.keyCode] = true;
		
	});
	agregarEvento(document,"keyup",function(e){
	    teclado[e.keyCode] = false;
	});
    function agregarEvento(elemento,nombreEvento,funcion){
	    if(elemento.addEventListener){
		    elemento.addEventListener(nombreEvento,funcion,false);
		}
		else if(elemento.attachEvent){
		    elemento.attachEvent(nombreEvento,funcion)
		}
	}
}
function moverNave(){
    if(teclado[37]){
	    nave.x -= 10;
		if (nave.x < 0) nave.x = 0;
	}
	if(teclado[39]){
	    var limite = canvas.width-nave.width;
	    nave.x += 10;
		if (nave.x > limite) nave.x = limite;
	}
	 if(teclado[32]){
	    if(!teclado.fire){
		    fire();
			teclado.fire = true;
		}
		
	}
	else teclado.fire = false;
}
function dibujarDisparosEnemigos(){
    for(var i in disparosEnemigos){
	    var disparo = disparosEnemigos[i];
		ctx.save();
		ctx.fillStyle = 'yellow';
		ctx.fillRect(disparo.x, disparo.y, disparo.width, disparo.height);
		ctx.restore();
		
	}
}
function moverDisparosEnemigos(){
    for(var i in disparosEnemigos){
	    var disparo = disparosEnemigos[i];
		disparo.y += 3;
	}	
	disparosEnemigos = disparosEnemigos.filter(function(disparos){
	    return disparo.y < canvas.height;
	});
}
function actualizaEnemigos(){
    function agregarDisparosEnemigos(enemigo){
	    return {
		    x: enemigo.x,
			y: enemigo.y,
			width: 10,
			height: 33,
			contador: 0
			
		}
	}
    if(juego.estado == 'iniciando'){
	    for(var i = 0;i<10;i++){
		    enemigos.push({
			    x: 10 + (i*50),
				y: 10,
				height: 40,
				width: 40,
				estado: 'vivo',
				contador: 0
			});
		}
		juego.estado = 'jugando';
		
	}
	for(var i in enemigos){
		    var enemigo = enemigos[i];
			if(!enemigo) continue;
			if(enemigo && enemigo.estado == 'vivo'){
			    enemigo.contador++;
				enemigo.x += Math.sin(enemigo.contador * Math.PI / 90) * 5;
				if(aleatorio(0, enemigo.length * 10) == 4){
				    disparosEnemigos.push(agregarDisparosEnemigos(enemigo));
				}
			}
			if(enemigo && enemigo.estado == 'golpeado'){
			    enemigo.contador++;
				if(enemigo.contador >= 20){
				    enemigo.estado = 'muerto';
					enemigo.contador = 0;
				}
			}
		}
		enemigos = enemigos.filter(function(enemigo){
		    if(enemigo && enemigo.estado != 'muerto') return true;
			return false;
		});
}
function moverDisparos(){
    for(var i in disparos){
	    var disparo = disparos[i];
		disparo.y -= 6;
	}
	//disparos = disparos.filter(function disparo(){
	    //return disparo.y > 0;
	//});
}
function fire(){
    disparos.push({
	    x: nave.x + 20,
		y: nave.y - 10,
		width: 10,
		height: 30
	});
}
function dibujarDisparos(){
    ctx.save();
	ctx.fillStyle = 'white';
	for(var i in disparos){
	    var disparo = disparos[i];
		ctx.fillRect(disparo.x, disparo.y, disparo.width, disparo.height);
	}
	ctx.restore();
}
function coalision(a,b){
    var coalision = false;
	if(b.x + b.width >= a.x && b.x < a.x + a.width){
	   if(b.y + b.height >= a.y && b.y < a.y + a.width){
            coalision = true;	   
	   }
	}
	if(b.x <= a.x && b.x + b.width >= a.x + a.width){
	    if(b.y <= a.y && b.y +b.height >= a.y + a.height){
		    coalision = true;
		}
	   
	}
	if(a.x <= b.x && a.x + a.width >= b.x + b.width){
	    if(a.y <= b.y && a.y +a.height >= b.y + b.height){
		    coalision = true;
		}
	   
	}
	return coalision;
}
function detectarCoalision(){
    for(var i in disparos){
	        var disparo = disparos[i];
		for(var j in enemigos){
		    var enemigo = enemigos[j];
		    if(coalision(disparo, enemigo)){
			    enemigo.estado = 'golpeado';
				enemigo.contador = 0;
		    }
		}
	}
}
function aleatorio(inferior, superior){
     var probabilidad = superior - inferior;
	 var al = Math.random() * probabilidad;
	 al = Math.floor(al);
	 return parseInt(inferior) + al;
}
function frameLoop(){
    moverNave();
	moverDisparos();
	moverDisparosEnemigos();
    drawBackground();
	detectarCoalision();
	actualizaEnemigos();
	dibujarEnemigos();
	dibujarDisparosEnemigos();
	dibujarDisparos();
	dibujarNave();
}
// ejecucion de las funciones
loadMedia();
agregarEventosTeclado();
