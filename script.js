var cv = document.getElementById("GFG");
var ctx = cv.getContext("2d");
class Curve {
    constructor(ctx,color = "#000000"){
        this.points = [];
        this.color = color;
        this.ctx = ctx;
        // this.a = a;
        // this.b = b;
        // this.c = c;
    }
    addPoint(x,y){
        this.points.push(new Point(x,y));
    }
    getPoints(){
        return this.points;
    }
    a(){
        return this.points[0];
    }
    b(){
        return this.points[1];
    }
    c(){
        return this.points[2];
    }
    drawPoints(){
        this.ctx.fillStyle = this.color;
        this.points.forEach((point,index) => {
            if(!point.getDOMElement()){
                var board = document.getElementById("board");
                var domPoint = document.createElement("div");
                domPoint.className ="point";
                domPoint.draggable = "true";
                domPoint.style.top = `${point.y}px`;
                domPoint.style.left = `${point.x}px`;
                // console.log(domPoint)
                domPoint.addEventListener("dragstart",(e)=>{
                    let dx = e.offsetX;
                    let dy = e.offsetY;
                    point.updateDOM({color:"lime"});
                    redrawCurves();
                })
                domPoint.addEventListener("drag",(e)=>{
                    let dx = e.offsetX;
                    let dy = e.offsetY;
                    point.updateDOM({x:point.x+dx,y:point.y+dy});
                    redrawCurves();
                })
                domPoint.addEventListener("dragend",(e)=>{
                    let dx = e.offsetX;
                    let dy = e.offsetY;
                    point.updateDOM({x:point.x+dx,y:point.y+dy,color:"black"});
                    redrawCurves();
                })
                board.appendChild(domPoint)
                point.setDOMElement(domPoint);
            }
            // ctx.beginPath();
            // ctx.arc(point.x, point.y, 5, 0, 2*Math.PI);
            // ctx.fill();
            // console.log(index,point)
        });
    }

    drawCurve(f, t) {
        let fSlider = document.getElementById("fSlider");
        let tSlider = document.getElementById("tSlider");
        console.log(tSlider.value);
        if (typeof(f) == 'undefined') f = fSlider.value/10;
        if (typeof(t) == 'undefined') t = tSlider.value/10;
        this.ctx.moveTo(this.a().x, this.a().y);
        this.ctx.beginPath();
    
        var m = 0;
        var dx1 = 0;
        var dy1 = 0;
        var dx2 = 0;
        var dy2 = 0;
        var previousP = this.a();
        
        // for (var i = 1; i < this.points.length; i++) {
            this.points.forEach((point,index)=>{

                let currentPoint = this.points[index];
                let nextPoint = this.points[index + 1];
                if (nextPoint) {
                    m = gradient(previousP, nextPoint);
                    console.log("gradient",m)
                    dx2 = (nextPoint.x - currentPoint.x) * -f;
                    dy2 = dx2 * m * t;
                }
                else {
                    dx2 = 0;
                    dy2 = 0;
                }
                ctx.bezierCurveTo(
                    previousP.x-dx1, previousP.y-dy1,
                    currentPoint.x+dx2, currentPoint.y+dy2,
                    currentPoint.x, currentPoint.y
                );
        
            dx1 = dx2;
            dy1 = dy2;
            previousP = currentPoint;
        // }
        })
        ctx.stroke();
    }
}
class anchorPoints{
    constructor(ctx){
        this.end = null;
        this.ctx = ctx;
    }
    
}
class Point{
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.domElement = null;
    }
    // drawLineToAnchorPoint(){
    //     this.ctx.moveTo(this.origin.x, this.origin.y);
    //     // if (end) {
    //         // m = gradient(previousP, nextPoint);
    //         // console.log("gradient",m)
    //         // dx2 = (nextPoint.x - currentPoint.x) * -f;
    //         // dy2 = dx2 * m * t;
    //     // }
    //     ctx.bezierCurveTo(
    //                 previousP.x-dx1, previousP.y-dy1,
    //                 currentPoint.x , currentPoint.y,
    //                 currentPoint.x, currentPoint.y
    //     );
    // }
    setDOMElement(domPoint){
        this.domElement = domPoint;
    }
    getDOMElement(){
        return this.domElement;
    }
    setX(x){
        if(typeof(x) =="number"){
            this.x = x;
            this.domElement.style.left = `${x}px`;
        }
    }
    setY(y){
        if(typeof(y) =="number"){
            this.y = y;
            this.domElement.style.top = `${y}px`;
        }
    }
    updateDOM(options){
        console.log(options)
        this.setX(options.x);
        this.setY(options.y);
        // this.domElement.style.top = `${options.y}px`;
        // this.domElement.style.left = `${options.x}px`;
        this.domElement.style.backgroundColor = options.color;
        // console.log(this.domElement)
    }
}

function gradient(a, b) {
    return (b.y-a.y)/(b.x-a.x);
}

function bezierCurve(points, f, t) {
    if (typeof(f) == 'undefined') f = 0.3;
    if (typeof(t) == 'undefined') t = 0.6;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
  
    var m = 0;
    var dx1 = 0;
    var dy1 = 0;

    var preP = points[0];
    
    for (var i = 1; i < points.length; i++) {
        var curP = points[i];
        nexP = points[i + 1];
        if (nexP) {
            m = gradient(preP, nexP);
            dx2 = (nexP.x - curP.x) * -f;
            dy2 = dx2 * m * t;
        } else {
            dx2 = 0;
            dy2 = 0;
        }
          
        ctx.bezierCurveTo(
            preP.x - dx1, preP.y - dy1,
            curP.x + dx2, curP.y + dy2,
            curP.x, curP.y
        );
      
        dx1 = dx2;
        dy1 = dy2;
        preP = curP;
    }
    ctx.stroke();
}
function drawPoints(){
    ctx.fillStyle = "#000000";
    // console.log(lines);
    curves.forEach((curve)=>{

        curve.points.forEach(point => {
            // var cv = document.getElementById("GFG");
            // var pointDOM = document.createElement("point");
            // cv.appendChild(domPoint)
            // for(var j = 0;j< curves[i].points;j++){
                ctx.beginPath();
                ctx.arc(point.x, point.y, 5, 0, 2*Math.PI);
                ctx.fill();
            });
            // }
    }) 
}
function redrawCurves(){
    console.log("redrawC")
    ctx.clearRect(0, 0, cv.width, cv.height);
    ctx.setLineDash([0]);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "green";
    curves.forEach(curve=>{
        curve.drawCurve();
    })
}
function draw(e) {
    console.log("mouse click")
    var pos = getMousePos(cv, e);
    posx = pos.x;
    posy = pos.y;
    
    // //ctx.beginPath();
    // //ctx.arc(posx, posy, 5, 0, 2*Math.PI);
    // //ctx.fill();
    // ctx.clearRect(0, 0, cv.width, cv.height);
    let currentCurve = latestCurve;
    if(!currentCurve || currentCurve.c()){
        currentCurve = new Curve(ctx);
        latestCurve = currentCurve;
        curves.push(latestCurve)
    }
    currentCurve.addPoint(posx, posy);
    console.log(curves,currentCurve);
    // addPoint({x:posx,y:posy});
    currentCurve.drawPoints();
    redrawCurves();
    // ctx.setLineDash([0]);
    // ctx.lineWidth = 2;
    // ctx.strokeStyle = "green";
    // curves.forEach(curve=>{
    //     curve.drawCurve(0.3,1);
    // })
    // currentCurve.drawCurve(0.3,1);
    // bezierCurve(lines,0.3,1);
}

function getMousePos(cv, evt) {
    var rect = cv.getBoundingClientRect();
    return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
    };
}
function addPoint(point){
    lines.push(point);
}

// Generate random data 
var curves = [];
var latestCurve = null;
var lines = [];     
var X = 10;
var t = 40; // control the width of X.
// addPoint({x:10,y:50});
// addPoint({x:50,y:50});
// addPoint({x:90,y:50});
// addPoint({x:130,y:50});
// for (var i = 0; i < 100; i++ ) {
//     Y = Math.floor((Math.random() * 300) + 50);
//     p = { x: X, y: Y };
//     lines.push(p);
//     X = X + t;
// }

// Draw smooth line 

// bzCurve(lines, 0.3, 1);

// Create a class for the element

// Define the new element
// customElements.define('point', pointDOM, { extends: 'div' });