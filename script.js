var cv = document.getElementById("GFG");
var $points = $("#points");
var $details = $("#details")
var ctx = null;

var curves = [];
var latestCurve = null;
var lines = [];     
var X = 10;
var t = 40; // control the width of X.

$(document).ready(()=>{
     ctx = cv.getContext("2d");
    $points.droppable({
        accept:".point",
    })
})
class Curve {
    constructor(ctx,color = "#000000"){
        this.points = [];
        this.color = color;
        this.ctx = ctx;
    }
    addPoint(x,y){
        let newPoint = new Point(x,y)
        if(this.points.length){
            this.points[this.points.length-1].setNext(newPoint)
        }
        this.points.push(newPoint);
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
                var domPoint = $(`<div class="point" draggable></div>`);
                domPoint.css({
                    transform:`translate(${point.x}px,${point.y}px)`,
                    position:"absolute",
                    backgroundColor:this.color
                })
                domPoint.draggable({
                    cursor: 'move',
                    start:(e, ui)=>{
                        domPoint.css({transform:"none"})
                        point.updateDOM({color:"lime"});
                        redrawCurves();
                    },
                    drag:(e, ui)=>{
                        let dx = ui.position.left;
                        let dy = ui.position.top;
                        $details.text(`x : ${Math.floor(dx)}, y : ${Math.floor(dy)}`)
                    point.x = dx;
                    point.y = dy;
                        redrawCurves();
                    },
                    stop:(e, ui)=>{
                        domPoint.css({left:"-2px",top:"-2px",transform:`translate(${ui.position.left}px, ${ui.position.top}px)`})
                        point.x = ui.position.left
                        point.y = ui.position.top
                        point.updateDOM({color:this.color});
                        redrawCurves();
                    }
                },)

                $points.append(domPoint)
                point.setDOMElement(domPoint);
            }
        });
    }

    drawCurve(f,t){
        ctx.lineWidth = 1;
        this.drawArc(f,t)
    }
    drawLine(f,t){
        // console.log("starting point of curve",this.a())
        // console.log("ending point of curve",this.b())
        this.points.forEach((point)=>{
            if(point.next){
                ctx.beginPath();
                ctx.strokeStyle = this.color;
                ctx.moveTo(point.x, point.y);
                ctx.lineTo(point.next.x, point.next.y);
                ctx.stroke();
            }
        })
    }
    drawArc(f,t){
        // console.log("starting point of curve",this.a())
        // console.log("ending point of curve",this.b())
        this.points.forEach((point)=>{
            if(point.next){
                ctx.strokeStyle = this.color;
                ctx.beginPath();
                ctx.moveTo(point.x, point.y);
                
                let p0 = point
                let p2 = point.next
                
                
                let mid = this.getMidPoint(p0, p2);
                let r = this.optimalRadius(p0, p2, mid)

                ctx.moveTo(p0.x, p0.sy);
                ctx.arcTo(mid.x, mid.y, p2.x, p2.y, r);
                ctx.lineTo(p2.x, p2.y);
                
                ctx.stroke();
            }
        })
    }
    optimalRadius(p1, p2, mid){
        let dx = Math.abs(mid.x-p1.x)
        let dy = Math.abs(p2.y-mid.y)
        let r = dx>dy?dy:dx;
        return r;

        /*
            let m = dy/dx
            let c = Math.sqrt(Math.pow(dx, 2)+Math.pow(dy, 2))
            // console.log("gradient", m)
            // console.log("distance", c)
            
            let r = c/(Math.sqrt(Math.pow(m,2)+1));
        */
    }
    getMidPoint(p1, p2){
       return new Point(p2.x,p1.y)
    }
    drawQuadraticCurve(f, t) {
        if (typeof(f) == 'undefined') f = fSlider.value/10;
        if (typeof(t) == 'undefined') t = tSlider.value/10;
        this.ctx.moveTo(this.a().x, this.a().y);
        this.ctx.beginPath();
        this.points.forEach((point,index)=>{
            let currentPoint = point;
            let nextPoint = point.next;
            if(nextPoint){   
                var x_mid = (currentPoint.x + nextPoint.x) / 2;
                var y_mid = (currentPoint.y + nextPoint.y) / 2;
                var cp_x1 = (x_mid + currentPoint.x) / 2;
                var cp_x2 = (x_mid + nextPoint.x) / 2;
                ctx.quadraticCurveTo(cp_x1,currentPoint.y ,x_mid, y_mid);
                // ctx.quadraticCurveTo(cp_x2,nextPoint.y ,nextPoint.x,nextPoint.y);
            }
        })
        this.ctx.stroke();

    }
    drawBezierCurve(f, t){
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
            this.points.forEach((point,index)=>{
    
                let currentPoint = this.points[index];
                let nextPoint = this.points[index + 1];
                if (nextPoint) {
                    m = gradient(previousP, nextPoint);
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
        this.next = null;
    }
    setDOMElement(domPoint){
        this.domElement = domPoint;
    }
    getDOMElement(){
        return this.domElement;
    }
    setX(x){
        if(typeof(x) =="number"){
            this.x = x;
        }
    }
    setY(y){
        if(typeof(y) =="number"){
            this.y = y;
        }
    }
    setPos(x, y){
        this.domElement.css({
            transform:`translate(${x}px, ${y}px)`
        })
    }
    setColor(color){
        this.domElement.css({
            backgroundColor: color
        })
    }
    updateDOM(options){
        console.log(options)
        if(options.x !== null && options.y !== null){
            this.setPos(options.x, options.y)
        }
        if(options.color){
            this.setColor(options.color)
        }
    }
    setNext(point){
        this.next = point;
    }
}

function gradient(a, b) {
    return (b.y-a.y)/(b.x-a.x);
}

// function bezierCurve(points, f, t) {
//     if (typeof(f) == 'undefined') f = 0.3;
//     if (typeof(t) == 'undefined') t = 0.6;
//     ctx.beginPath();
//     ctx.moveTo(points[0].x, points[0].y);
  
//     var m = 0;
//     var dx1 = 0;
//     var dy1 = 0;

//     var preP = points[0];
    
//     for (var i = 1; i < points.length; i++) {
//         var curP = points[i];
//         nexP = points[i + 1];
//         if (nexP) {
//             m = gradient(preP, nexP);
//             dx2 = (nexP.x - curP.x) * -f;
//             dy2 = dx2 * m * t;
//         } else {
//             dx2 = 0;
//             dy2 = 0;
//         }
          
//         ctx.bezierCurveTo(
//             preP.x - dx1, preP.y - dy1,
//             curP.x + dx2, curP.y + dy2,
//             curP.x, curP.y
//         );
      
//         dx1 = dx2;
//         dy1 = dy2;
//         preP = curP;
//     }
//     ctx.stroke();
// }

function redrawCurves(){
    ctx.clearRect(0, 0, cv.width, cv.height);
    ctx.setLineDash([0]);
    curves.forEach(curve=>{
        curve.drawCurve();
    })
}
let colors = [
    "#000000", //black
    "#ff0000", //red
    "#00ff00", //green
    "#0000ff", //blue
    "#ffff00", //yellow
    "#00ffff", //cyan
    "#ff00ff", //magenta
]
function randomNumber(min, max){
    let r = Math.floor(Math.random()*(max-min))+min
    return r;
}
function draw(e) {
    console.log("mouse click", e.offsetX, e.offsetY)
    if([...e.target.classList].includes("point"))
        return;
    var pos = {x:e.offsetX, y:e.offsetY}
    posx = pos.x;
    posy = pos.y;
    let currentCurve = latestCurve;
    if(!currentCurve || currentCurve.c()){
        currentCurve = new Curve(ctx, colors[randomNumber(0, colors.length)]);
        latestCurve = currentCurve;
        curves.push(latestCurve)
    }
    currentCurve.addPoint(posx, posy);
    // console.log(currentCurve);
    currentCurve.drawPoints();
    redrawCurves();
}

function addPoint(point){
    lines.push(point);
}
$points.on("mousedown", draw)

