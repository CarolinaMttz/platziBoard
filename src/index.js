import { fromEvent, merge } from "rxjs";
import { map, mergeAll, takeUntil } from "rxjs/operators";

const canvas         = document.getElementById("reactive-canvas");
const cursorPosition = { x: 0, y: 0 };
const updateCursorPosition = (event) => {
    cursorPosition.x = event.clientX -  canvas.offsetLeft;
    cursorPosition.y = event.clientY -  canvas.offsetTop;
};
const restartButton  = document.getElementById("restart-button");


const onMouseDown$ = fromEvent(canvas, "mousedown");
onMouseDown$.subscribe(updateCursorPosition);
const onMouseUp$   = fromEvent(canvas, "mouseup");
const onMouseMove$ = fromEvent(canvas, "mousemove").pipe(
    takeUntil(onMouseUp$)
);

onMouseDown$.subscribe();
const canvasContext       = canvas.getContext("2d");
canvasContext.lineWidth   = 8; //Ancho de la línea
canvasContext.lineJoin    = "round";
canvasContext.lineCap     = "round";
canvasContext.strokeStyle = "white";// Color de la linea


const paintStroke = (event) => {
    canvasContext.beginPath(); //Iniciar un trazo
    canvasContext.moveTo(cursorPosition.x, cursorPosition.y); //Metodo que permite trazar desde una distancia inicial
    updateCursorPosition(event);
    canvasContext.lineTo(cursorPosition.x, cursorPosition.y); //Metodo que permite trazar desde una distancia final
    canvasContext.stroke(); //Es una línea
    canvasContext.closePath(); //Cerrar el trazo
}

const startPaint$ = onMouseDown$.pipe(
    map( () => onMouseMove$ ),
    mergeAll()
);

let startPaintSubscription = startPaint$.subscribe(paintStroke);

const onLoadWindow$      = fromEvent(window, "load");
const onRestartClick$    = fromEvent(restartButton, "click");
const restartWhiteBoard$ = merge( onLoadWindow$, onRestartClick$);
restartWhiteBoard$.subscribe( () => {
    startPaintSubscription.unsubscribe();
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    startPaintSubscription = startPaint$.subscribe(paintStroke);
});
