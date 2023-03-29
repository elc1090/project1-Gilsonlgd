class StateBuffer {
  // points é um array de Anchor
  // closedCurve é uma booleana
  constructor(points, closedCurve) {
    this.points = points.slice();
    for (i = 0; i < points.length; i++) {
      this.points[i].anchorPoint = new Point(points[i].anchorPoint.x, points[i].anchorPoint.y, points[i].anchorPoint.radius);
      this.points[i].angleLeft = new Point(points[i].angleLeft.x, points[i].angleLeft.y, points[i].angleLeft.radius);
      this.points[i].angleRight = new Point(points[i].angleRight.x, points[i].angleRight.y, points[i].angleRight.radius);
      
    }
    this.closedCurve = closedCurve;
  }
}