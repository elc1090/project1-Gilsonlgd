var canvas = document.getElementById("myCanvas");
var canvasWidth = canvas.width;
var canvasHeight = canvas.height;
var ctx = canvas.getContext("2d");
var canvasData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);

let points = []; // Array of Anchors
let drag = false; // signals if the mouse is dragging any point
let p; // Information about the anchor (and it's angle points) that is moving
let dragOnCreate = false; // signals if the mouse is dragging the angle points after creating the anchor point
let closedCurve = false; // signals when the curve is a closed path

let stateBufferArray = new Array(); // Array of canvas states

// ------------------------ INIT ------------------------ //

let pointErased = false;
let ctrlPressed = false;
let altPressed = false;

function init() {
  window.addEventListener('keydown', function(e) {
    if (e.code == "AltLeft") {
      altPressed = true;
    }

    if (e.code == "ControlLeft") {
      ctrlPressed = true;
    }

    if (e.code == "KeyZ" && ctrlPressed == true && pointErased == false) {
      // Tirar o pop e fazer os dados serem atualizados com a útlima posição do array de states
      // e remover a última posição do array
      if (stateBufferArray.length > 1) {
        stateBufferArray.pop();
        points = stateBufferArray[(stateBufferArray.length-1)].points.slice();
        closedCurve = stateBufferArray[(stateBufferArray.length-1)].closedCurve;
        pointErased = true;
      } else {
        stateBufferArray.pop();
        points.pop();
        closedCurve = false;
        pointErased = true;
      }
    }
    draw();
  }, false);
  window.addEventListener('keyup', function(e) {
    if (e.code == "AltLeft") {
      altPressed = false;
    }

    if (e.code == "ControlLeft") {
      ctrlPressed = false;
    }

    if (e.code == "KeyZ") {
      pointErased = false;
    }
    draw();
  }, false);

  ctx.canvas.addEventListener("mousedown", function(e) {
    for (i = 0; i < points.length; i++) {
      colidiu = points[i].colides(e.offsetX, e.offsetY);
      if (colidiu && ((colidiu == 'anchorPoint' && ctrlPressed) || (colidiu != 'anchorPoint' && altPressed))) {
        p = {
          key: i,
          value: colidiu,
          leftRelativeAngle: colidiu == 'anchorPoint' ? {
            x: (points[i].angleLeft.x - points[i].anchorPoint.x),
            y: (points[i].angleLeft.y - points[i].anchorPoint.y),
          } : null,
          rightRelativeAngle: colidiu == 'anchorPoint' ? {
            x: (points[i].angleRight.x - points[i].anchorPoint.x),
            y: (points[i].angleRight.y - points[i].anchorPoint.y),
          } : null
        }
        drag = true;
        return;
      } else if (colidiu == 'anchorPoint' && i == 0 && points.length >= 1) {
        closedCurve = true;
        return;
      }
    }

    createNewAnchorPoint(e);
    
    draw();
  });

  ctx.canvas.addEventListener("mousemove", function(e) {
    if (drag) {
      if (p.value == 'anchorPoint') {
        points[p.key].anchorPoint.movePoint(e.offsetX, e.offsetY);
        var leftRelative = {
          x: points[p.key].anchorPoint.x + p.leftRelativeAngle.x,
          y: points[p.key].anchorPoint.y + p.leftRelativeAngle.y
        }
        points[p.key].angleLeft.movePoint(leftRelative.x, leftRelative.y);
        
        var rightRelative = {
          x: points[p.key].anchorPoint.x + p.rightRelativeAngle.x,
          y: points[p.key].anchorPoint.y + p.rightRelativeAngle.y
        }
        points[p.key].angleRight.movePoint(rightRelative.x, rightRelative.y);
      } else {
        points[p.key][p.value].movePoint(e.offsetX, e.offsetY);
      }
    } else if (dragOnCreate) {
      points[(points.length-1)].moveAngle(movedAngleName, e.offsetX, e.offsetY);
    }
    draw();
  });

  ctx.canvas.addEventListener("mouseup", function(e) {
    drag = false;
    dragOnCreate = false;

    if(stateBufferArray.length >= 200) { // Removes the first position of array
      stateBufferArray.shift();
    }
    // Creates another state on the stateBufferArray
    stateBufferArray.push(new StateBuffer(points, closedCurve));
    console.log(stateBufferArray[(stateBufferArray.length-1)].points)
    console.log(points)

    draw();
  });
}


// ------------------------ DRAW FUNCTIONS ------------------------ //

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBezier();
  for (i = 0; i < points.length; i++) {
    ctx.strokeStyle = '#a64932';
    ctx.beginPath();
    ctx.moveTo(points[i].anchorPoint.x, points[i].anchorPoint.y);
    ctx.lineTo(points[i].angleLeft.x, points[i].angleLeft.y);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(points[i].anchorPoint.x, points[i].anchorPoint.y);
    ctx.lineTo(points[i].angleRight.x, points[i].angleRight.y);
    ctx.stroke();
    ctx.closePath();

    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(points[i].anchorPoint.x, points[i].anchorPoint.y, points[i].anchorPoint.radius, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = '#e36646';
    ctx.beginPath();
    ctx.arc(points[i].angleLeft.x, points[i].angleLeft.y, points[i].angleLeft.radius, 0, 2 * Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(points[i].angleRight.x, points[i].angleRight.y, points[i].angleRight.radius, 0, 2 * Math.PI);
    ctx.fill();
  }
}

function drawBezier() {
  ctx.strokeStyle = '#b3198f';
  if (points.length > 1) {
    drawOpenCurveBezier();
    if (closedCurve) {
      drawClosedCurveBezier();
    }
  }
}

function drawOpenCurveBezier() {
  for (i = 0; i < points.length-1; i++) {
    for (t = 0; t < 1; t+=0.01) {
      part1 = {
        x: Math.pow((1-t),3)*points[i].anchorPoint.x,
        y: Math.pow((1-t),3)*points[i].anchorPoint.y
      }
      part2 = {
        x: 3*Math.pow((1-t),2)*t*points[i].angleRight.x,
        y: 3*Math.pow((1-t),2)*t*points[i].angleRight.y
      }
      part3 = {
        x: 3*(1-t)*Math.pow(t,2)*points[i+1].angleLeft.x,
        y: 3*(1-t)*Math.pow(t,2)*points[i+1].angleLeft.y
      }
      part4 = {
        x: Math.pow(t,3)*points[i+1].anchorPoint.x,
        y: Math.pow(t,3)*points[i+1].anchorPoint.y
      }
      point1TempX = part1.x + part2.x + part3.x + part4.x;
      point1TempY = part1.y + part2.y + part3.y + part4.y;

      tt = t+0.01

      part1 = {
        x: Math.pow((1-tt),3)*points[i].anchorPoint.x,
        y: Math.pow((1-tt),3)*points[i].anchorPoint.y
      }
      part2 = {
        x: 3*Math.pow((1-tt),2)*tt*points[i].angleRight.x,
        y: 3*Math.pow((1-tt),2)*tt*points[i].angleRight.y
      }
      part3 = {
        x: 3*(1-tt)*Math.pow(tt,2)*points[i+1].angleLeft.x,
        y: 3*(1-tt)*Math.pow(tt,2)*points[i+1].angleLeft.y
      }
      part4 = {
        x: Math.pow(tt,3)*points[i+1].anchorPoint.x,
        y: Math.pow(tt,3)*points[i+1].anchorPoint.y
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

function drawClosedCurveBezier() {
  i = (points.length-1);
  for (t = 0; t < 1; t+=0.01) {
    part1 = {
      x: Math.pow((1-t),3)*points[i].anchorPoint.x,
      y: Math.pow((1-t),3)*points[i].anchorPoint.y
    }
    part2 = {
      x: 3*Math.pow((1-t),2)*t*points[i].angleRight.x,
      y: 3*Math.pow((1-t),2)*t*points[i].angleRight.y
    }
    part3 = {
      x: 3*(1-t)*Math.pow(t,2)*points[0].angleLeft.x,
      y: 3*(1-t)*Math.pow(t,2)*points[0].angleLeft.y
    }
    part4 = {
      x: Math.pow(t,3)*points[0].anchorPoint.x,
      y: Math.pow(t,3)*points[0].anchorPoint.y
    }
    point1TempX = part1.x + part2.x + part3.x + part4.x;
    point1TempY = part1.y + part2.y + part3.y + part4.y;

    tt = t+0.01

    part1 = {
      x: Math.pow((1-tt),3)*points[i].anchorPoint.x,
      y: Math.pow((1-tt),3)*points[i].anchorPoint.y
    }
    part2 = {
      x: 3*Math.pow((1-tt),2)*tt*points[i].angleRight.x,
      y: 3*Math.pow((1-tt),2)*tt*points[i].angleRight.y
    }
    part3 = {
      x: 3*(1-tt)*Math.pow(tt,2)*points[0].angleLeft.x,
      y: 3*(1-tt)*Math.pow(tt,2)*points[0].angleLeft.y
    }
    part4 = {
      x: Math.pow(tt,3)*points[0].anchorPoint.x,
      y: Math.pow(tt,3)*points[0].anchorPoint.y
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

// ------------------------ UTILS ------------------------ //

let movedAngleName;

function createNewAnchorPoint(e) {
  // Ao criar o novo ponto, verifica se os anglePoints devem ser invertido ou não
  if (points.length > 0) {
    if (e.offsetX <= points[(points.length-1)].anchorPoint.x) {
      points.push(new Anchor(e.offsetX, e.offsetY, true));
      movedAngleName = 'angleRight';
    } else {
      points.push(new Anchor(e.offsetX, e.offsetY, false));
      movedAngleName = 'angleRight';
    }
  } else {
    points.push(new Anchor(e.offsetX, e.offsetY, false));
    movedAngleName = 'angleRight';
  }
  dragOnCreate = true;
}

init();