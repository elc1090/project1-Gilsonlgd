var canvas = document.getElementById("myCanvas");
var canvasWidth = canvas.width;
var canvasHeight = canvas.height;
var ctx = canvas.getContext("2d");
var canvasData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);

var points = [];
var drag = false;
var p;

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let raio;
  for (i = 0; i < points.length; i++) {
    if (i % 3 != 0) {
      ctx.fillStyle = '#e36646';
      raio = points[i].radius-2;
    } else {
      ctx.fillStyle = '#000000';
      raio = points[i].radius;
    }
    ctx.beginPath();
    ctx.arc(points[i].x, points[i].y, raio, 0, 2 * Math.PI);
    ctx.fill();
  }
  drawBezier();
}

function drawBezier() {
  if (points.length % 3 == 1) {
    ctx.fillStyle = '#b3198f';
    var point1TempX, point1TempY;
    var point2TempX, point2TempY;
    var i=0;
    var t=0;

    for (i = 0; i < points.length-1; i += 3) {
      for (t = 0; t < 1; t+=0.01) {
        part1 = {
          x: Math.pow((1-t),3)*points[i].x,
          y: Math.pow((1-t),3)*points[i].y
        }
        part2 = {
          x: 3*Math.pow((1-t),2)*t*points[i+1].x,
          y: 3*Math.pow((1-t),2)*t*points[i+1].y
        }
        part3 = {
          x: 3*(1-t)*Math.pow(t,2)*points[i+2].x,
          y: 3*(1-t)*Math.pow(t,2)*points[i+2].y
        }
        part4 = {
          x: Math.pow(t,3)*points[i+3].x,
          y: Math.pow(t,3)*points[i+3].y
        }
        point1TempX = part1.x + part2.x + part3.x + part4.x;
        point1TempY = part1.y + part2.y + part3.y + part4.y;

        tt = t+0.01

        part1 = {
          x: Math.pow((1-tt),3)*points[i].x,
          y: Math.pow((1-tt),3)*points[i].y
        }
        part2 = {
          x: 3*Math.pow((1-tt),2)*tt*points[i+1].x,
          y: 3*Math.pow((1-tt),2)*tt*points[i+1].y
        }
        part3 = {
          x: 3*(1-tt)*Math.pow(tt,2)*points[i+2].x,
          y: 3*(1-tt)*Math.pow(tt,2)*points[i+2].y
        }
        part4 = {
          x: Math.pow(tt,3)*points[i+3].x,
          y: Math.pow(tt,3)*points[i+3].y
        }
        point2TempX = part1.x + part2.x + part3.x + part4.x;
        point2TempY = part1.y + part2.y + part3.y + part4.y;


        ctx.beginPath();
        ctx.moveTo(point1TempX, point1TempY);
        ctx.lineTo(point2TempX, point2TempY);
        ctx.stroke();
        ctx.closePath();

        point1TempX = point2TempX;
        point1TempY = point2TempY;
      }
    }
  }
}

function init() {
  ctx.canvas.addEventListener("mousedown", function(e) {
    for (i = 0; i < points.length; i++) {
      if (points[i].colides(e.offsetX, e.offsetY)) {
        p = i;
        drag = true;
        return;
      }
    }
    points.push(new Point(e.offsetX, e.offsetY, 7))
    drag = true;
    p = points.length-1;
    console.log(points.length)
    draw();
  });

  ctx.canvas.addEventListener("mousemove", function(e) {
    if (drag) {
      points[p].movePoint(e.offsetX, e.offsetY);
    }
    draw();
  });

  ctx.canvas.addEventListener("mouseup", function(e) {
    drag = false;
    draw();
  });
}

init();