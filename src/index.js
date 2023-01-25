import { fromEvent } from "rxjs";
import { map } from "rxjs/operators";

const canvas       = document.getElementById("reactive-canvas");
const cursorPosition = { x: 0, y: 0 };


const onMouseDown$ = fromEvent(canvas, "mousedown").pipe(
    map( event => {
        //console.log(event);
        cursorPosition.x = event.clientX -  canvas.offsetLeft;
        cursorPosition.y = event.clientY -  canvas.offsetTop;
        console.log(cursorPosition);
    })
);
const onMouseMove$ = fromEvent(canvas, "mousemove");
const onMouseUp$   = fromEvent(canvas, "mouseup");

onMouseDown$.subscribe();
const canvasContext       = canvas.getContext("2d");
canvasContext.lineWidth   = 8; //Ancho de la línea
canvasContext.strokeStyle = "white";// Color de la linea
canvasContext.beginPath(); //Iniciar un trazo
canvasContext.moveTo(0,0); //Metodo que permite trazar desde una distancia inicial
canvasContext.lineTo(100,100); //Metodo que permite trazar desde una distancia final
canvasContext.stroke(); //Es una línea
canvasContext.closePath(); //Cerrar el trazo